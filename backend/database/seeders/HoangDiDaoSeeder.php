<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Channel;
use App\Models\DailyGrowth;
use App\Models\Video;

class HoangDiDaoSeeder extends Seeder
{
    public function run()
    {
        $channel = Channel::updateOrCreate(
            ['handle' => '@hoangdidao'],
            [
                'id' => '7343603410714738689',
                'name' => 'Hoàng Đi Dạo',
                'avatar' => 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7343603410714738689~c5_100x100.jpeg',
                'total_likes' => 585800,
                'total_followers' => 30300,
                'total_videos' => 12,
                'total_views' => 29200000
            ]
        );

        $channel->dailyGrowths()->delete();
        for ($i = 30; $i >= 0; $i--) {
            $channel->dailyGrowths()->create([
                'date' => date('M d', strtotime("-$i days")),
                'followers' => 28000 + (30 - $i) * 75,
                'views' => 10000000 + (30 - $i) * 640000
            ]);
        }

        $channel->videos()->delete();
        $channel->videos()->create([
            'id' => '7627831940040658184',
            'channel_id' => $channel->id,
            'title' => 'Quá bất ngờ với Ổ Tôm Tít Ở Biển #hoangdidao',
            'thumbnail' => 'https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/7343603410714738689?x-expires=1745215200',
            'views' => 29100000,
            'likes' => 246100,
            'comments' => 1250,
            'shares' => 580,
            'posted_at' => date('Y-m-d', strtotime('-5 days'))
        ]);
        
        $channel->videos()->create([
            'id' => '7630801813045775624',
            'channel_id' => $channel->id,
            'title' => 'Vui Quá Vì Đi biển Có Tôm Tít #hoangdidao',
            'views' => 76500,
            'likes' => 450,
            'comments' => 45,
            'shares' => 20,
            'posted_at' => date('Y-m-d', strtotime('-2 days'))
        ]);
    }
}
