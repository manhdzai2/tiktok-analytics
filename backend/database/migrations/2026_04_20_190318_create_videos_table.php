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
        Schema::create('videos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('channel_id');
            $table->foreign('channel_id')->references('id')->on('channels')->onDelete('cascade');
            $table->string('title');
            $table->string('thumbnail')->nullable();
            $table->bigInteger('views')->default(0);
            $table->bigInteger('likes')->default(0);
            $table->bigInteger('comments')->default(0);
            $table->bigInteger('shares')->default(0);
            $table->string('posted_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
