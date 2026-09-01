<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\Mapel;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;

class MapelController extends Controller
{
    public function index($classId)
    {
        $mapel = Mapel::where('kelas_id', $classId)->withCount('materi')->get();

        return response()->json([
            'status' => 'success',
            'data' => $mapel
        ]);
    }

    public function store(Request $request, $classId)
    {
        $user = $request->user();
        $class = ClassModel::findOrFail($classId);

        // Check if user is Owner or Admin
        $member = $class->members()->where('user_id', $user->id)->first();
        if (!$member || !in_array($member->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Hanya Owner atau Admin yang dapat menambah Mata Pelajaran.'], 403);
        }

        $validated = $request->validate([
            'kode' => 'required|string|max:10',
            'nama' => 'required|string|max:255',
            'warna' => 'nullable|string|max:100',
        ]);

        $mapel = Mapel::create([
            'kelas_id' => $classId,
            'kode' => strtoupper($validated['kode']),
            'nama' => $validated['nama'],
            'warna' => $validated['warna'] ?? 'from-indigo-500 to-purple-600',
        ]);

        // Record log
        LogAktivitas::create([
            'kelas_id' => $classId,
            'user_id' => $user->id,
            'peran_user' => strtoupper($member->role),
            'deskripsi_aksi' => "Menambahkan Mata Pelajaran Baru \"{$mapel->nama}\" ({$mapel->kode})",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Mata Pelajaran \"{$mapel->nama}\" berhasil ditambahkan!",
            'data' => $mapel
        ], 201);
    }
}
