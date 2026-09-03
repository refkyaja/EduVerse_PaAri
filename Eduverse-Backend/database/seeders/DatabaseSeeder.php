<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ClassModel;
use App\Models\ClassMember;
use App\Models\Mapel;
use App\Models\Kuis;
use App\Models\Soal;
use App\Models\OpsiSoal;
use App\Models\PercobaanKuis;
use App\Models\JawabanPercobaan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default User
        $user = User::firstOrCreate(
            ['email' => 'owner@eduverse.com'],
            [
                'name' => 'Ari Owner',
                'username' => 'ari_owner',
                'password' => Hash::make('password'),
                'bio' => 'Owner & Pengembang Kelas EduVerse',
            ]
        );

        // 2. Create Default Class
        $class = ClassModel::firstOrCreate(
            ['code' => 'EDU123'],
            [
                'name' => 'XII RPL 1 — Pemrograman Web',
                'description' => 'Kelas kuis & materi latihan Pemrograman Web & Perangkat Bergerak',
                'category' => 'Teknologi & Informasi',
                'owner_id' => $user->id,
            ]
        );

        // 3. Attach User as Owner in ClassMember
        ClassMember::firstOrCreate(
            ['class_id' => $class->id, 'user_id' => $user->id],
            ['role' => 'owner']
        );

        // 4. Create Mapel
        $mapel = Mapel::firstOrCreate(
            ['kelas_id' => $class->id, 'kode' => 'PWP'],
            ['nama' => 'Pemrograman Web & Perangkat Bergerak', 'warna' => 'from-indigo-500 to-purple-600']
        );

        // 5. Create Sample Kuis
        $kuis = Kuis::firstOrCreate(
            ['kelas_id' => $class->id, 'judul' => 'Kuis Matriks & Logika Pemrograman'],
            [
                'deskripsi' => 'Latihan soal matriks dan logika array',
                'batas_waktu' => 30,
                'jumlah_soal' => 5,
                'dibuat_oleh' => $user->id,
            ]
        );

        // 6. Create Soal & Opsi if not exists
        if ($kuis->soal()->count() === 0) {
            for ($i = 1; $i <= 5; $i++) {
                $soal = Soal::create([
                    'kelas_id' => $class->id,
                    'pertanyaan' => "Soal Latihan #{$i}: Berapakah ordo matriks hasil penjumlahan?",
                    'jenis_soal' => 'pilihan_ganda',
                    'pembahasan' => "Ordo matriks penjumlahan tetap sama dengan ordo matriks asal.",
                    'dibuat_oleh' => $user->id,
                ]);

                $kuis->soal()->attach($soal->id, ['urutan' => $i]);

                OpsiSoal::create(['soal_id' => $soal->id, 'teks_opsi' => '2x2', 'benar' => true, 'urutan' => 1]);
                OpsiSoal::create(['soal_id' => $soal->id, 'teks_opsi' => '3x3', 'benar' => false, 'urutan' => 2]);
                OpsiSoal::create(['soal_id' => $soal->id, 'teks_opsi' => '1x2', 'benar' => false, 'urutan' => 3]);
                OpsiSoal::create(['soal_id' => $soal->id, 'teks_opsi' => '2x3', 'benar' => false, 'urutan' => 4]);
            }
        }

        // 7. Seed 44 Percobaan Kuis (Total 4,080 XP, 44 Exams, 80% Accuracy)
        if (PercobaanKuis::where('user_id', $user->id)->count() === 0) {
            $soalList = $kuis->soal()->get();
            $totalAttempts = 44;
            $targetTotalXp = 4080;
            $baseXpPerAttempt = (int)floor($targetTotalXp / $totalAttempts); // 92
            $remainderXp = $targetTotalXp - ($baseXpPerAttempt * $totalAttempts); // 32

            for ($attemptNum = 1; $attemptNum <= $totalAttempts; $attemptNum++) {
                $xpForThis = $baseXpPerAttempt + ($attemptNum <= $remainderXp ? 1 : 0);
                
                $percobaan = PercobaanKuis::create([
                    'kuis_id' => $kuis->id,
                    'user_id' => $user->id,
                    'percobaan_ke' => $attemptNum,
                    'skor' => 80,
                    'xp_didapat' => $xpForThis,
                    'mulai_pada' => now()->subDays(45 - $attemptNum)->subMinutes(30),
                    'selesai_pada' => now()->subDays(45 - $attemptNum),
                ]);

                // 4 correct, 1 incorrect per attempt = 80% accuracy
                foreach ($soalList as $index => $s) {
                    $isCorrect = ($index < 4);
                    $opsiDipilih = $s->opsi()->where('benar', $isCorrect)->first() ?? $s->opsi()->first();

                    JawabanPercobaan::create([
                        'percobaan_id' => $percobaan->id,
                        'soal_id' => $s->id,
                        'opsi_dipilih_id' => $opsiDipilih ? $opsiDipilih->id : null,
                        'benar' => $isCorrect,
                    ]);
                }
            }
        }
    }
}
