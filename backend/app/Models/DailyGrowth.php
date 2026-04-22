<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyGrowth extends Model
{
    protected $fillable = ['channel_id', 'date', 'followers', 'views'];

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
