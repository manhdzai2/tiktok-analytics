<?php

namespace Database\Seeders;

use App\Models\Channel;
use App\Models\DailyGrowth;
use App\Models\Video;
use Illuminate\Database\Seeder;

class TikTokSeeder extends Seeder
{
    public function run(): void
    {
        $channels = [
            [
                'id' => 'ch-1',
                'name' => 'TechVibes Studio',
                'handle' => '@techvibes',
                'avatar' => 'https://api.dicebear.com/7.x/initials/svg?seed=TV&backgroundColor=fe2c55&textColor=ffffff',
                'total_likes' => 2450000,
                'total_followers' => 385200,
                'total_videos' => 248,
                'total_views' => 18700000,
                'likes_change' => 12.5,
                'followers_change' => 8.3,
                'videos_change' => 4.2,
                'views_change' => 15.7,
                'daily_growths' => [
                    ['date' => 'Apr 1', 'followers' => 350000, 'views' => 16000000],
                    ['date' => 'Apr 15', 'followers' => 365000, 'views' => 17500000],
                    ['date' => 'Apr 20', 'followers' => 385200, 'views' => 18700000],
                ],
                'videos' => [
                    [
                        'id' => 'v1',
                        'title' => '5 AI Tools You NEED in 2026',
                        'thumbnail' => 'https://picsum.photos/seed/techvid1/400/600',
                        'views' => 1230000,
                        'likes' => 98500,
                        'comments' => 3200,
                        'shares' => 12400,
                        'posted_at' => '2 days ago',
                    ],
                    [
                        'id' => 'v2',
                        'title' => 'Building a Smart Home on a Budget',
                        'thumbnail' => 'https://picsum.photos/seed/techvid2/400/600',
                        'views' => 856000,
                        'likes' => 67200,
                        'comments' => 2100,
                        'shares' => 8900,
                        'posted_at' => '5 days ago',
                    ]
                ]
            ],
            [
                'id' => 'ch-2',
                'name' => 'FoodieJourney',
                'handle' => '@foodiejourney',
                'avatar' => 'https://api.dicebear.com/7.x/initials/svg?seed=FJ&backgroundColor=25f4ee&textColor=000000',
                'total_likes' => 5120000,
                'total_followers' => 720400,
                'total_videos' => 412,
                'total_views' => 42300000,
                'likes_change' => -2.1,
                'followers_change' => 5.6,
                'videos_change' => 6.8,
                'views_change' => -0.8,
                'daily_growths' => [
                    ['date' => 'Apr 1', 'followers' => 680000, 'views' => 38000000],
                    ['date' => 'Apr 20', 'followers' => 720400, 'views' => 42300000],
                ],
                'videos' => [
                    [
                        'id' => 'v7',
                        'title' => 'Street Food in Bangkok - Top 10',
                        'thumbnail' => 'https://picsum.photos/seed/foodvid1/400/600',
                        'views' => 3400000,
                        'likes' => 256000,
                        'comments' => 9800,
                        'shares' => 45200,
                        'posted_at' => '1 day ago',
                    ]
                ]
            ]
        ];

        foreach ($channels as $cData) {
            $growths = $cData['daily_growths'];
            $videos = $cData['videos'];
            unset($cData['daily_growths'], $cData['videos']);

            $channel = Channel::create($cData);

            foreach ($growths as $g) {
                $channel->dailyGrowths()->create($g);
            }

            foreach ($videos as $v) {
                $channel->videos()->create($v);
            }
        }
    }
}
