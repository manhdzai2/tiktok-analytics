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
        'errors_log',
        'chunk_total',
        'chunk_processed',
        'current_status_message',
    ];

    protected $casts = [
        'errors_log' => 'array',
        'total_count' => 'integer',
        'processed_count' => 'integer',
        'error_count' => 'integer',
        'chunk_total' => 'integer',
        'chunk_processed' => 'integer',
    ];

    /**
     * Tính % hoàn thành
     */
    public function getProgressPercentageAttribute(): float
    {
        if ($this->total_count === 0) return 0;
        return round(($this->processed_count + $this->error_count) / $this->total_count * 100, 1);
    }

    /**
     * Trạng thái hiển thị cho frontend
     */
    public function getDisplayStatusAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Đang chờ xử lý',
            'processing' => 'Đang xử lý...',
            'completed' => 'Hoàn thành',
            'failed' => 'Lỗi: ' . ($this->last_error ?? 'Unknown'),
            default => $this->status,
        };
    }
}
