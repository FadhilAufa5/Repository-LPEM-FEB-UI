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
        Schema::table('assets', function (Blueprint $table) {
            // Drop old file_laporan column
            $table->dropColumn('file_laporan');
            
            // Add new columns for binary storage
            $table->longText('file_content')->nullable()->after('tahun'); // Base64 encoded file
            $table->string('file_name')->nullable()->after('file_content');
            $table->string('file_mime')->nullable()->after('file_name');
            $table->bigInteger('file_size')->nullable()->after('file_mime'); // in bytes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            // Remove new columns
            $table->dropColumn(['file_content', 'file_name', 'file_mime', 'file_size']);
            
            // Restore old column
            $table->string('file_laporan')->nullable();
        });
    }
};
