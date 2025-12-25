<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('kode_klien')->unique();
            $table->string('nama_klien');
            $table->text('alamat');
            $table->string('kode_kabupaten', 4);
            $table->string('kontak_person');
            $table->string('telp');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();

            $table->foreign('kode_kabupaten')->references('kode_kabupaten')->on('wilayah')->onDelete('restrict');
            $table->index('kode_kabupaten');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
