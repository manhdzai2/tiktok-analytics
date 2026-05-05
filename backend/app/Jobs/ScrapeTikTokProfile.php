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
use Carbon\Carbon;

class ScrapeTikTokProfile implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 60;
    protected $maxRetryMinutes = 60;

    protected $importTask;
    protected $url;
    protected $index;

    public function __construct(ImportTask $task, string $url, int $index)
    {
        $this->importTask = $task;
        $this->url = $url;
        $this->index = $index;
    }

    public function handle(TikTokScraperService $scraper): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        try {
            $result = $scraper->scrapeFromUrl($this->url);

            if ($result) {
                $this->importTask->increment('processed_count');
                Log::info("Scrape success: " . $this->url);
            } else {
                $this->importTask->increment('error_count');
                $errors = $this->importTask->errors_log ?? [];
                $errors[] = "Item (" . ($this->index + 1) . "): No data returned for URL: " . $this->url;
                $this->importTask->update(['errors_log' => $errors]);
                Log::warning("Scrape returned null for: " . $this->url);
            }
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $statusCode = $e->getResponse()->getStatusCode();

            if ($statusCode == 429) {
                $attempts = $this->attempts();
                $delay = min(pow(2, $attempts) * 60, 600);
                Log::warning("Rate limit (429) for {$this->url}. Retrying in {$delay}s (attempt {$attempts})");
                $this->release($delay);
                return;
            }

            $this->importTask->increment('error_count');
            $errors = $this->importTask->errors_log ?? [];
            $errors[] = "Item (" . ($this->index + 1) . "): HTTP {$statusCode} - " . $e->getMessage();
            $this->importTask->update(['errors_log' => $errors]);
            Log::error("HTTP Error ({$statusCode}) for {$this->url}: " . $e->getMessage());
        } catch (\Exception $e) {
            $this->importTask->increment('error_count');

            $errors = $this->importTask->errors_log ?? [];
            $errors[] = "Item (" . ($this->index + 1) . "): " . $e->getMessage();
            $this->importTask->update(['errors_log' => $errors]);

            Log::error("Scrape Item Error (" . $this->url . "): " . $e->getMessage());

            if ($this->attempts() < $this->tries) {
                $delay = min($this->attempts() * 30, 180);
                $this->release($delay);
            }
        }
    }

    public function retryUntil(): Carbon
    {
        return now()->addMinutes($this->maxRetryMinutes);
    }
}
