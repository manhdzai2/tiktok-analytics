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
        Schema::create('daily_growths', function (Blueprint $table) {
            $table->id();
            $table->string('channel_id');
            $table->foreign('channel_id')->references('id')->on('channels')->onDelete('cascade');
            $table->string('date'); // Lưu định dạng 'MMM DD' như mock data
            $table->integer('followers')->default(0);
            $table->integer('views')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_growths');
    }
};
