<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ChannelController;

Route::get('/channels', [ChannelController::class, 'index']);
Route::post('/channels/bulk-import', [ChannelController::class, 'bulkImport']);
Route::get('/imports/{id}', [ChannelController::class, 'getImportStatus']);
Route::get('/channels/{id}', [ChannelController::class, 'show']);
Route::delete('/channels/{id}', [ChannelController::class, 'destroy']);
Route::post('/channels/bulk-delete', [ChannelController::class, 'bulkDestroy']);
Route::post('/import-tiktok', [ChannelController::class, 'import']);
