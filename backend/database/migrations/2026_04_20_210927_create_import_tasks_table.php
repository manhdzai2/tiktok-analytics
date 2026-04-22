<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('import_tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('total_count')->default(0);
            $table->integer('processed_count')->default(0);
            $table->integer('error_count')->default(0);
            $table->string('status')->default('pending'); // pending, processing, completed, failed
            $table->text('last_error')->nullable();
            $table->json('errors_log')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_tasks');
    }
};
