<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\ImportTask;
use League\Csv\Reader;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Bus;
use Throwable;

class ProcessTikTokImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $importTask;
    protected $filePath;

    /**
     * Create a new job instance.
     */
    public function __construct(ImportTask $task, string $filePath)
    {
        $this->importTask = $task;
        $this->filePath = $filePath;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->importTask->update(['status' => 'processing']);
        
        try {
            $path = Storage::path($this->filePath);
            $extension = pathinfo($path, PATHINFO_EXTENSION);
            
            $links = [];
            
            if (in_array(strtolower($extension), ['xlsx', 'xls'])) {
                $links = $this->readLinksFromExcel($path);
            } else {
                $csv = Reader::createFromPath($path, 'r');
                $csv->setHeaderOffset(0);
                $records = iterator_to_array($csv->getRecords());
                foreach ($records as $record) {
                    $links[] = $record['url'] ?? $record['link'] ?? $record['URL'] ?? reset($record);
                }
            }

            $links = array_filter(array_map('trim', $links));
            $this->importTask->update(['total_count' => count($links)]);

            if (empty($links)) {
                $this->importTask->update(['status' => 'completed']);
                Storage::delete($this->filePath);
                return;
            }

            $jobs = [];
            foreach ($links as $index => $url) {
                $jobs[] = new ScrapeTikTokProfile($this->importTask, $url, $index);
            }

            $task = $this->importTask;
            $filePath = $this->filePath;

            Bus::batch($jobs)
                ->then(function ($batch) use ($task) {
                    $task->update(['status' => 'completed']);
                })
                ->catch(function ($batch, Throwable $e) use ($task) {
                    $task->update([
                        'status' => 'failed',
                        'last_error' => $e->getMessage()
                    ]);
                })
                ->finally(function ($batch) use ($filePath) {
                    Storage::delete($filePath);
                })
                ->name('TikTok Bulk Import: ' . $task->id)
                ->dispatch();

        } catch (\Exception $e) {
            $this->importTask->update([
                'status' => 'failed',
                'last_error' => $e->getMessage()
            ]);
            Log::error("Fatal Import Initialization Error: " . $e->getMessage());
            Storage::delete($this->filePath);
        }
    }

    protected function readLinksFromExcel($path)
    {
        $scriptPath = base_path('scraper-tool/read-excel.js');
        $command = "node \"$scriptPath\" \"$path\" 2>&1";
        $output = shell_exec($command);
        
        $data = json_decode($output, true);
        if (!$data || !isset($data['success'])) {
            throw new \Exception("Failed to parse Excel file: " . ($data['error'] ?? $output));
        }
        
        return $data['links'] ?? [];
    }
}
