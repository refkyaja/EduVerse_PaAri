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
        Schema::create('materi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('mapel_id')->nullable()->constrained('mapel')->onDelete('set null');
            $table->string('judul');
            $table->text('ringkasan')->nullable();
            $table->unsignedBigInteger('versi_aktif_id')->nullable();
            $table->foreignId('dibuat_oleh')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materi');
    }
};
