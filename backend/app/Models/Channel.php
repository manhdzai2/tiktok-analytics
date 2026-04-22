<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    protected $fillable = [
        'id', 'name', 'handle', 'avatar', 
        'total_likes', 'total_followers', 'total_videos', 'total_views', 'views_30d',
        'likes_change', 'followers_change', 'videos_change', 'views_change',
        'tiktok_created_at'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function dailyGrowths()
    {
        return $this->hasMany(DailyGrowth::class);
    }

    public function videos()
    {
        return $this->hasMany(Video::class);
    }
}
