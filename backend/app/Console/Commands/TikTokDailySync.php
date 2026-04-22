<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Channel;
use App\Services\TikTokScraperService;
use Illuminate\Support\Facades\Log;

class TikTokDailySync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tiktok:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize all TikTok accounts data daily';

    /**
     * Execute the console command.
     */
    public function handle(TikTokScraperService $scraper)
    {
        $this->info('Starting TikTok data synchronization...');
        $channels = Channel::all();
        
        $bar = $this->output->createProgressBar(count($channels));
        $bar->start();

        foreach ($channels as $channel) {
            try {
                $url = "https://www.tiktok.com/{$channel->handle}";
                $scraper->scrapeFromUrl($url);
                $this->info("\nUpdated: {$channel->handle}");
            } catch (\Exception $e) {
                $this->error("\nFailed to update {$channel->handle}: " . $e->getMessage());
                Log::error("Bulk Sync Error for {$channel->handle}: " . $e->getMessage());
            }
            $bar->advance();
            // Một chút delay để tránh bị TikTok block
            sleep(2);
        }

        $bar->finish();
        $this->info("\nTikTok synchronization completed!");
    }
}
