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
        Schema::table('clients', function (Blueprint $table) {
            $table->enum('type_of_client', [
                'Kementerian/Lembaga Pemerintah',
                'Pemerintah Daerah',
                'BUMN/D',
                'Swasta Nasional',
                'Lembaga Asing'
            ])->nullable()->after('nama_klien');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('type_of_client');
        });
    }
};
