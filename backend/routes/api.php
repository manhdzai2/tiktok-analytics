<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ChannelController;

Route::post('/bulk-action/import-channels', [ChannelController::class, 'bulkImport']);
Route::get('/channels', [ChannelController::class, 'index']);
Route::get('/imports/{id}', [ChannelController::class, 'getImportStatus']);
Route::get('/channels/{id}', [ChannelController::class, 'show']);
Route::delete('/channels/{id}', [ChannelController::class, 'destroy']);
Route::post('/channels/bulk-delete', [ChannelController::class, 'bulkDestroy']);
Route::post('/import-tiktok', [ChannelController::class, 'import']);

Route::get('/check-version', function() {
    return response()->json(['version' => '1.0.5', 'time' => now()->toDateTimeString()]);
});
