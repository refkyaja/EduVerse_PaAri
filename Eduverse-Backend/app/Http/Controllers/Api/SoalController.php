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
    public function index(Request $request, $classId)
    {
        $user = $request->user();
        $class = ClassModel::find($classId);
        if (!$class || !$class->hasUser($user)) {
            return response()->json(['status' => 'error', 'message' => 'Anda tidak memiliki akses ke bank soal kelas ini.'], 403);
        }

        $soal = Soal::where('kelas_id', $classId)->with('opsi')->get();

        return response()->json([
            'status' => 'success',
            'data' => $soal
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
            return response()->json(['message' => 'Hanya Owner atau Admin yang dapat menambah Soal ke Bank Soal.'], 403);
        }

        $validated = $request->validate([
            'pertanyaan' => 'required|string',
            'jenis_soal' => 'required|in:pilihan_ganda,benar_salah',
            'pembahasan' => 'nullable|string',
            'tingkat_kesulitan' => 'nullable|string',
            'materi_id' => 'nullable|exists:materi,id',
            'opsi' => 'required|array|min:2|max:5',
            'opsi.*.teks_opsi' => 'required|string',
            'opsi.*.benar' => 'required|boolean',
        ]);

        $jumlahOpsi = count($validated['opsi']);
        if ($jumlahOpsi < 2 || $jumlahOpsi > 5) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jumlah opsi jawaban per soal harus antara 2 hingga 5 opsi.'
            ], 422);
        }

        $benarCount = 0;
        foreach ($validated['opsi'] as $opt) {
            if (!empty($opt['benar'])) {
                $benarCount++;
            }
        }

        if ($benarCount !== 1) {
            return response()->json([
                'status' => 'error',
                'message' => 'Soal harus memiliki tepat satu jawaban benar.'
            ], 422);
        }

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

    public function parseTeks(Request $request, $classId)
    {
        $request->validate([
            'teks' => 'required|string',
        ]);

        $parser = new \App\Services\SoalParserService();
        $hasil = $parser->parse($request->input('teks'));

        return response()->json([
            'status' => 'success',
            'data' => $hasil,
        ]);
    }

    public function imporBatch(Request $request, $classId)
    {
        $user = $request->user();
        $class = ClassModel::find($classId);
        if (!$class) {
            return response()->json(['status' => 'error', 'message' => 'Kelas tidak ditemukan.'], 404);
        }

        $member = $class->classMembers()->where('user_id', $user->id)->first();
        if (!$member || !in_array($member->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Hanya Owner atau Admin yang dapat mengimpor Soal.'], 403);
        }

        $validated = $request->validate([
            'soal' => 'required|array|min:1',
            'soal.*.pertanyaan' => 'required|string',
            'soal.*.jenis_soal' => 'nullable|string',
            'soal.*.pembahasan' => 'nullable|string',
            'soal.*.opsi' => 'required|array|min:2|max:5',
            'soal.*.opsi.*.teks_opsi' => 'required|string',
            'soal.*.opsi.*.benar' => 'required|boolean',
        ]);

        foreach ($validated['soal'] as $item) {
            $jumlahOpsi = count($item['opsi']);
            if ($jumlahOpsi < 2 || $jumlahOpsi > 5) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Jumlah opsi jawaban per soal harus antara 2 hingga 5 opsi.'
                ], 422);
            }

            $benarCount = 0;
            foreach ($item['opsi'] as $opt) {
                if (!empty($opt['benar'])) {
                    $benarCount++;
                }
            }

            if ($benarCount !== 1) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Setiap soal harus memiliki tepat satu jawaban benar.'
                ], 422);
            }
        }

        $createdCount = 0;
        foreach ($validated['soal'] as $item) {
            $soal = Soal::create([
                'kelas_id' => $classId,
                'pertanyaan' => $item['pertanyaan'],
                'jenis_soal' => $item['jenis_soal'] ?? 'pilihan_ganda',
                'pembahasan' => $item['pembahasan'] ?? null,
                'tingkat_kesulitan' => 'sedang',
                'dibuat_oleh' => $user->id,
            ]);

            foreach ($item['opsi'] as $idx => $opt) {
                OpsiSoal::create([
                    'soal_id' => $soal->id,
                    'teks_opsi' => $opt['teks_opsi'],
                    'benar' => $opt['benar'],
                    'urutan' => $idx + 1,
                ]);
            }
            $createdCount++;
        }

        LogAktivitas::create([
            'kelas_id' => $classId,
            'user_id' => $user->id,
            'peran_user' => strtoupper($member->role),
            'deskripsi_aksi' => "Mengimpor {$createdCount} soal sekaligus ke Bank Soal kelas",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Berhasil mengimpor {$createdCount} soal ke Bank Soal!",
        ], 201);
    }
}
