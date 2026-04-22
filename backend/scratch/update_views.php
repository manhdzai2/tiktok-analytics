<?php
$channels = \App\Models\Channel::all();
foreach($channels as $channel) {
    $oldestGrowth30d = $channel->dailyGrowths()
        ->where('created_at', '>=', now()->subDays(30))
        ->orderBy('created_at', 'asc')
        ->first();
        
    $growthViews30d = 0;
    if ($oldestGrowth30d && (int)$channel->total_views >= (int)$oldestGrowth30d->views) {
        $growthViews30d = (int)$channel->total_views - (int)$oldestGrowth30d->views;
    }

    $viewsFrom30dVideos = (int) $channel->videos()
        ->where('posted_at', '>=', now()->subDays(30)->toDateString())
        ->sum('views');

    $views30d = max($growthViews30d, $viewsFrom30dVideos);
    $channel->views_30d = $views30d;
    $channel->save();
    
    echo "Updated {$channel->handle} to {$views30d}\n";
}
echo "Done updating all channels.\n";
