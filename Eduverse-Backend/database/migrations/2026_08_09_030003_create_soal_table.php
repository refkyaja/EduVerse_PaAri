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
        Schema::create('soal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('materi_id')->nullable()->constrained('materi')->onDelete('set null');
            $table->text('pertanyaan');
            $table->enum('jenis_soal', ['pilihan_ganda', 'benar_salah'])->default('pilihan_ganda');
            $table->text('pembahasan')->nullable();
            $table->string('tingkat_kesulitan')->nullable()->default('sedang');
            $table->foreignId('dibuat_oleh')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soal');
    }
};
