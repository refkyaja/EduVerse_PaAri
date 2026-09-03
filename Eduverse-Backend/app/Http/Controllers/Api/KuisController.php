<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\Kuis;
use App\Models\Soal;
use App\Models\OpsiSoal;
use App\Models\PercobaanKuis;
use App\Models\JawabanPercobaan;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;

class KuisController extends Controller
{
    public function index(Request $request, $classId)
    {
        $user = $request->user();
        $class = ClassModel::find($classId);
        if (!$class || !$class->hasUser($user)) {
            return response()->json(['status' => 'error', 'message' => 'Anda tidak memiliki akses ke kuis kelas ini.'], 403);
        }

        $kuis = Kuis::where('kelas_id', $classId)
            ->withCount('soal')
            ->with('creator')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $kuis
        ]);
    }

    public function store(Request $request, $classId)
    {
        $user = $request->user();
        $class = ClassModel::find($classId);
        if (!$class) {
            return response()->json(['status' => 'error', 'message' => 'Kelas tidak ditemukan.'], 404);
        }

        $member = $class->classMembers()->where('user_id', $user->id)->first();
        if (!$member || !in_array($member->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Hanya Owner atau Admin yang dapat membuat Kuis.'], 403);
        }

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'batas_waktu' => 'nullable|integer|min:1',
            'soal_ids' => 'nullable|array',
            'soal_ids.*' => 'exists:soal,id',
        ]);

        $kuis = Kuis::create([
            'kelas_id' => $classId,
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'batas_waktu' => $validated['batas_waktu'] ?? 30,
            'jumlah_soal' => count($validated['soal_ids'] ?? []),
            'dibuat_oleh' => $user->id,
        ]);

        if (!empty($validated['soal_ids'])) {
            foreach ($validated['soal_ids'] as $idx => $soalId) {
                $kuis->soal()->attach($soalId, ['urutan' => $idx + 1]);
            }
        }

        LogAktivitas::create([
            'kelas_id' => $classId,
            'user_id' => $user->id,
            'peran_user' => strtoupper($member->role),
            'deskripsi_aksi' => "Menerbitkan Kuis Baru \"{$kuis->judul}\"",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Kuis \"{$kuis->judul}\" berhasil diterbitkan!",
            'data' => $kuis->load('soal')
        ], 201);
    }

    public function show(Request $request, $classId, $id)
    {
        $user = $request->user();
        $class = ClassModel::find($classId);
        if (!$class || !$class->hasUser($user)) {
            return response()->json(['status' => 'error', 'message' => 'Anda tidak memiliki akses ke kuis kelas ini.'], 403);
        }

        $kuis = Kuis::where('kelas_id', $classId)
            ->where('id', $id)
            ->with(['soal.opsi', 'creator'])
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $kuis
        ]);
    }

    public function submitAttempt(Request $request, $classId, $id)
    {
        $user = $request->user();
        $class = ClassModel::find($classId);
        if (!$class || !$class->hasUser($user)) {
            return response()->json(['status' => 'error', 'message' => 'Anda tidak memiliki akses ke kuis kelas ini.'], 403);
        }

        $kuis = Kuis::where('kelas_id', $classId)->where('id', $id)->firstOrFail();

        $validated = $request->validate([
            'jawaban' => 'required|array', // [{soal_id: 1, opsi_dipilih_id: 2}]
        ]);

        // Count previous attempts for XP scaling
        $attemptCount = PercobaanKuis::where('kuis_id', $id)->where('user_id', $user->id)->count();
        $nextAttemptNum = $attemptCount + 1;

        $correctCount = 0;
        $totalQuestions = count($validated['jawaban']);

        $percobaan = PercobaanKuis::create([
            'kuis_id' => $id,
            'user_id' => $user->id,
            'percobaan_ke' => $nextAttemptNum,
            'mulai_pada' => now()->subMinutes(5),
            'selesai_pada' => now(),
        ]);

        foreach ($validated['jawaban'] as $item) {
            $opsi = OpsiSoal::find($item['opsi_dipilih_id'] ?? null);
            $isCorrect = $opsi ? $opsi->benar : false;
            if ($isCorrect) $correctCount++;

            JawabanPercobaan::create([
                'percobaan_id' => $percobaan->id,
                'soal_id' => $item['soal_id'],
                'opsi_dipilih_id' => $item['opsi_dipilih_id'] ?? null,
                'benar' => $isCorrect,
            ]);
        }

        $score = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100) : 0;

        // XP scaling: Attempt 1 = 100%, Attempt 2 = 50%, Attempt 3+ = 0 XP
        $baseXp = $score * 1.5;
        if ($nextAttemptNum === 1) {
            $earnedXp = (int)$baseXp;
        } elseif ($nextAttemptNum === 2) {
            $earnedXp = (int)($baseXp * 0.5);
        } else {
            $earnedXp = 0;
        }

        $percobaan->update([
            'skor' => $score,
            'xp_didapat' => $earnedXp,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Percobaan kuis berhasil dicatat!',
            'data' => [
                'percobaan' => $percobaan,
                'skor' => $score,
                'xp_didapat' => $earnedXp,
                'benar' => $correctCount,
                'total_soal' => $totalQuestions,
            ]
        ]);
    }
}
