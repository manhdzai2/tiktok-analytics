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
        Schema::table('import_tasks', function (Blueprint $table) {
            $table->integer('chunk_total')->default(0)->after('total_count');
            $table->integer('chunk_processed')->default(0)->after('chunk_total');
            $table->text('current_status_message')->nullable()->after('errors_log');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('import_tasks', function (Blueprint $table) {
            $table->dropColumn(['chunk_total', 'chunk_processed', 'current_status_message']);
        });
    }
};
