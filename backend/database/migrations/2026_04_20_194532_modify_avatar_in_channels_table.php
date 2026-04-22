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
        Schema::table('channels', function (Blueprint $table) {
            $table->text('avatar')->nullable()->change();
        });
        
        Schema::table('videos', function (Blueprint $table) {
            $table->text('thumbnail')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('channels', function (Blueprint $table) {
            $table->string('avatar', 255)->nullable()->change();
        });
        
        Schema::table('videos', function (Blueprint $table) {
            $table->string('thumbnail', 255)->nullable()->change();
        });
    }
};
