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
    protected $chunkSize = 30; // Số lượng profile mỗi chunk
    protected $delayBetweenChunks = 60; // Delay giữa các chunk (giây)

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
        $this->importTask->update([
            'status' => 'processing',
            'chunk_total' => 0,
            'chunk_processed' => 0,
        ]);

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

            $links = array_values(array_filter(array_map('trim', $links)));
            $totalCount = count($links);

            if ($totalCount === 0) {
                $this->importTask->update(['status' => 'completed']);
                Storage::delete($this->filePath);
                return;
            }

            // Chia thành các chunks
            $chunks = array_chunk($links, $this->chunkSize);
            $chunkTotal = count($chunks);

            $this->importTask->update([
                'total_count' => $totalCount,
                'chunk_total' => $chunkTotal,
                'chunk_processed' => 0,
            ]);

            Log::info("Starting bulk import", [
                'total' => $totalCount,
                'chunks' => $chunkTotal,
                'chunk_size' => $this->chunkSize,
            ]);

            $task = $this->importTask;
            $filePath = $this->filePath;
            $delayBetweenChunks = $this->delayBetweenChunks;

            // Dispatch từng chunk với delay
            foreach ($chunks as $chunkIndex => $chunkLinks) {
                $jobs = [];
                foreach ($chunkLinks as $relativeIndex => $url) {
                    $absoluteIndex = $chunkIndex * $this->chunkSize + $relativeIndex;
                    $job = new ScrapeTikTokProfile($task, $url, $absoluteIndex);
                    // Stagger: mỗi job trong chunk cách nhau 3 giây
                    $job->delay($relativeIndex * 3);
                    $jobs[] = $job;
                }

                $delay = $chunkIndex * $delayBetweenChunks;

                Bus::batch($jobs)
                    ->then(function ($batch) use ($task, $chunkIndex, $chunkTotal) {
                        $task->increment('chunk_processed');
                        Log::info("Chunk {$chunkIndex} completed. Progress: {$task->chunk_processed}/{$chunkTotal}");
                    })
                    ->catch(function ($batch, Throwable $e) use ($task) {
                        Log::error("Chunk failed: " . $e->getMessage());
                    })
                    ->name("TikTok Import Chunk {$chunkIndex}/{$chunkTotal}: " . $task->id)
                    ->delay(now()->addSeconds($delay))
                    ->dispatch();
            }

            // Job tổng để dọn dẹp và cập nhật trạng thái
            \App\Jobs\FinalizeImport::dispatch($task, $filePath)
                ->delay(now()->addSeconds($chunkTotal * $delayBetweenChunks + 300));

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
        Log::info("Attempting to read Excel", ['script' => $scriptPath, 'file' => $path]);

        $command = "node \"$scriptPath\" \"$path\" 2>&1";
        $output = shell_exec($command);

        Log::info("Excel Parser Output", ['output' => $output]);

        $data = json_decode($output, true);
        if (!$data || !isset($data['success'])) {
            $errorMsg = $data['error'] ?? ($output ?: "Unknown shell error (maybe node is not installed?)");
            Log::error("Excel Parsing Failed", ['error' => $errorMsg]);
            throw new \Exception("Failed to parse Excel file: " . $errorMsg);
        }

        $links = $data['links'] ?? [];
        Log::info("Excel Links Found", ['count' => count($links)]);

        return $links;
    }
}
