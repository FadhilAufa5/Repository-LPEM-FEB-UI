<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wilayah', function (Blueprint $table) {
            $table->id();
            $table->string('kode_provinsi', 2);
            $table->string('kode_kabupaten', 4)->unique();
            $table->string('provinsi');
            $table->string('kabupaten');
            $table->timestamps();

            $table->index('kode_kabupaten');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wilayah');
    }
};
