<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ImportTask extends Model
{
    use HasUuids;

    protected $fillable = [
        'total_count',
        'processed_count',
        'error_count',
        'status',
        'last_error',
        'errors_log'
    ];

    protected $casts = [
        'errors_log' => 'array',
        'total_count' => 'integer',
        'processed_count' => 'integer',
        'error_count' => 'integer',
    ];
}
