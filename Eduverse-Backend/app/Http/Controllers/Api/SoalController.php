<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\Soal;
use App\Models\OpsiSoal;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;

class SoalController extends Controller
{
    public function index($classId)
    {
        $soal = Soal::where('kelas_id', $classId)->with('opsi')->get();

        return response()->json([
            'status' => 'success',
            'data' => $soal
        ]);
    }

    public function store(Request $request, $classId)
    {
        $user = $request->user();
        $class = ClassModel::findOrFail($classId);

        $member = $class->members()->where('user_id', $user->id)->first();
        if (!$member || !in_array($member->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Hanya Owner atau Admin yang dapat menambah Soal ke Bank Soal.'], 403);
        }

        $validated = $request->validate([
            'pertanyaan' => 'required|string',
            'jenis_soal' => 'required|in:pilihan_ganda,benar_salah',
            'pembahasan' => 'nullable|string',
            'tingkat_kesulitan' => 'nullable|string',
            'materi_id' => 'nullable|exists:materi,id',
            'opsi' => 'required|array|min:2',
            'opsi.*.teks_opsi' => 'required|string',
            'opsi.*.benar' => 'required|boolean',
        ]);

        $soal = Soal::create([
            'kelas_id' => $classId,
            'materi_id' => $validated['materi_id'] ?? null,
            'pertanyaan' => $validated['pertanyaan'],
            'jenis_soal' => $validated['jenis_soal'],
            'pembahasan' => $validated['pembahasan'] ?? null,
            'tingkat_kesulitan' => $validated['tingkat_kesulitan'] ?? 'sedang',
            'dibuat_oleh' => $user->id,
        ]);

        foreach ($validated['opsi'] as $idx => $opt) {
            OpsiSoal::create([
                'soal_id' => $soal->id,
                'teks_opsi' => $opt['teks_opsi'],
                'benar' => $opt['benar'],
                'urutan' => $idx + 1,
            ]);
        }

        LogAktivitas::create([
            'kelas_id' => $classId,
            'user_id' => $user->id,
            'peran_user' => strtoupper($member->role),
            'deskripsi_aksi' => "Menambahkan soal baru ke Bank Soal kelas",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Soal berhasil ditambahkan ke Bank Soal!',
            'data' => $soal->load('opsi')
        ], 201);
    }
}
