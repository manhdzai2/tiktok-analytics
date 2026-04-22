<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'id', 'channel_id', 'title', 'thumbnail', 
        'views', 'likes', 'comments', 'shares', 'posted_at'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
