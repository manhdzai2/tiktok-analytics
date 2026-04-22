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
        Schema::create('channels', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('handle');
            $table->string('avatar')->nullable();
            $table->bigInteger('total_likes')->default(0);
            $table->bigInteger('total_followers')->default(0);
            $table->integer('total_videos')->default(0);
            $table->bigInteger('total_views')->default(0);
            $table->float('likes_change')->default(0);
            $table->float('followers_change')->default(0);
            $table->float('videos_change')->default(0);
            $table->float('views_change')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('channels');
    }
};
