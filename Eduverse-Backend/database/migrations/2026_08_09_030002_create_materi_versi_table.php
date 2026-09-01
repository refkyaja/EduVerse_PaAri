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
        Schema::create('materi_versi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materi_id')->constrained('materi')->onDelete('cascade');
            $table->integer('nomor_versi')->default(1);
            $table->longText('isi');
            $table->string('file_path')->nullable();
            $table->enum('status', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'perlu_perbaikan', 'ditolak'])->default('terverifikasi');
            $table->foreignId('dibuat_oleh')->constrained('users')->onDelete('cascade');
            $table->foreignId('ditinjau_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('ditinjau_pada')->nullable();
            $table->text('catatan_review')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materi_versi');
    }
};
