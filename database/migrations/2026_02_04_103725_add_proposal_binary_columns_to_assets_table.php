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
            // Add new columns for proposal binary storage (similar to report file storage)
            if (!Schema::hasColumn('assets', 'proposal_content')) {
                $table->longText('proposal_content')->nullable(); // Base64 encoded proposal file
            }
            if (!Schema::hasColumn('assets', 'proposal_name')) {
                $table->string('proposal_name')->nullable();
            }
            if (!Schema::hasColumn('assets', 'proposal_mime')) {
                $table->string('proposal_mime')->nullable();
            }
            if (!Schema::hasColumn('assets', 'proposal_size')) {
                $table->bigInteger('proposal_size')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            // Remove new columns
            $table->dropColumn(['proposal_content', 'proposal_name', 'proposal_mime', 'proposal_size']);
        });
    }
};
