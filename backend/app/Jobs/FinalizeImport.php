<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\ImportTask;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FinalizeImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $importTask;
    protected $filePath;

    public function __construct(ImportTask $task, string $filePath)
    {
        $this->importTask = $task;
        $this->filePath = $filePath;
    }

    public function handle(): void
    {
        $task = $this->importTask->fresh();

        if (!$task) {
            Log::warning("ImportTask not found for finalization");
            return;
        }

        // Kiểm tra xem tất cả chunk đã được xử lý chưa
        if ($task->chunk_processed < $task->chunk_total) {
            Log::info("Not all chunks processed yet. Retrying...", [
                'processed' => $task->chunk_processed,
                'total' => $task->chunk_total,
            ]);
            // Retry sau 60 giây
            $this->release(60);
            return;
        }

        $task->update(['status' => 'completed']);
        Log::info("Import completed successfully", [
            'processed' => $task->processed_count,
            'errors' => $task->error_count,
        ]);

        Storage::delete($this->filePath);
    }
}
