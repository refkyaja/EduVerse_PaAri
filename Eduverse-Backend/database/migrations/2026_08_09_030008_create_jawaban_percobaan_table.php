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
        Schema::create('jawaban_percobaan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('percobaan_id')->constrained('percobaan_kuis')->onDelete('cascade');
            $table->foreignId('soal_id')->constrained('soal')->onDelete('cascade');
            $table->foreignId('opsi_dipilih_id')->nullable()->constrained('opsi_soal')->onDelete('set null');
            $table->boolean('benar')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jawaban_percobaan');
    }
};
