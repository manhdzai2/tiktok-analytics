<?php
 
namespace App\Jobs;
 
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\ImportTask;
use App\Services\TikTokScraperService;
use Illuminate\Bus\Batchable;
use Illuminate\Support\Facades\Log;
 
class ScrapeTikTokProfile implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
 
    protected $importTask;
    protected $url;
    protected $index;
 
    /**
     * Create a new job instance.
     */
    public function __construct(ImportTask $task, string $url, int $index)
    {
        $this->importTask = $task;
        $this->url = $url;
        $this->index = $index;
    }
 
    /**
     * Execute the job.
     */
    public function handle(TikTokScraperService $scraper): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }
 
        try {
            $scraper->scrapeFromUrl($this->url);
            $this->importTask->increment('processed_count');
        } catch (\Exception $e) {
            $this->importTask->increment('error_count');
            
            $errors = $this->importTask->errors_log ?? [];
            $errors[] = "Item (" . ($this->index + 1) . "): " . $e->getMessage();
            $this->importTask->update(['errors_log' => $errors]);
            
            Log::error("Scrape Item Error (" . $this->url . "): " . $e->getMessage());
        }
    }
}
