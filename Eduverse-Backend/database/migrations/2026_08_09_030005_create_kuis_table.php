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
        Schema::create('kuis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')->constrained('classes')->onDelete('cascade');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->integer('batas_waktu')->nullable()->default(30);
            $table->integer('jumlah_soal')->default(5);
            $table->boolean('acak_soal')->default(false);
            $table->boolean('acak_opsi')->default(false);
            $table->boolean('status_aktif')->default(true);
            $table->foreignId('dibuat_oleh')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kuis');
    }
};
