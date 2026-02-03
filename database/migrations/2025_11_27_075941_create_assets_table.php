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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique();
            $table->string('judul_laporan', 500);
            $table->text('abstrak');
            $table->enum('jenis_laporan', ['penelitian_survey', 'penelitian', 'diklat', 'jurnal', 'buku', 'lainnya']);
            $table->integer('grup_kajian');
            $table->string('kepala_proyek');
            $table->json('staf');
            $table->integer('tahun');
            $table->string('file_laporan')->nullable();
            $table->string('file_proposal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
