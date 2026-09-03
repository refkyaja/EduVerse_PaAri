<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\Materi;
use App\Models\MateriVersi;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;

class MateriController extends Controller
{
    public function index(Request $request, $classId)
    {
        $user = $request->user();
        $class = ClassModel::find($classId);
        if (!$class || !$class->hasUser($user)) {
            return response()->json(['status' => 'error', 'message' => 'Anda tidak memiliki akses ke materi kelas ini.'], 403);
        }

        $materi = Materi::where('kelas_id', $classId)
            ->with(['versiAktif', 'mapel', 'creator'])
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $materi
        ]);
    }

    public function store(Request $request, $classId)
    {
        $user = $request->user();
        $class = ClassModel::findOrFail($classId);

        $member = $class->classMembers()->where('user_id', $user->id)->first();
        if (!$member || !in_array($member->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Hanya Owner atau Admin yang dapat membuat materi.'], 403);
        }

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'ringkasan' => 'nullable|string',
            'isi' => 'required|string',
            'mapel_id' => 'nullable|exists:mapel,id',
        ]);

        $status = ($member->role === 'owner') ? 'terverifikasi' : 'menunggu_verifikasi';

        $materi = Materi::create([
            'kelas_id' => $classId,
            'mapel_id' => $validated['mapel_id'] ?? null,
            'judul' => $validated['judul'],
            'ringkasan' => $validated['ringkasan'] ?? null,
            'dibuat_oleh' => $user->id,
        ]);

        $versi = MateriVersi::create([
            'materi_id' => $materi->id,
            'nomor_versi' => 1,
            'isi' => $validated['isi'],
            'status' => $status,
            'dibuat_oleh' => $user->id,
            'ditinjau_oleh' => ($member->role === 'owner') ? $user->id : null,
            'ditinjau_pada' => ($member->role === 'owner') ? now() : null,
        ]);

        $materi->update(['versi_aktif_id' => $versi->id]);

        LogAktivitas::create([
            'kelas_id' => $classId,
            'user_id' => $user->id,
            'peran_user' => strtoupper($member->role),
            'deskripsi_aksi' => ($member->role === 'owner')
                ? "Membuat & menerbitkan materi \"{$materi->judul}\" (Terverifikasi)"
                : "Mengajukan materi baru \"{$materi->judul}\" (Menunggu Verifikasi)",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => ($member->role === 'owner')
                ? "Materi \"{$materi->judul}\" berhasil diterbitkan!"
                : "Materi \"{$materi->judul}\" diajukan! Menunggu Verifikasi Owner.",
            'data' => $materi->load('versiAktif')
        ], 201);
    }

    public function show(Request $request, $classId, $id)
    {
        $user = $request->user();
        $class = ClassModel::find($classId);
        if (!$class || !$class->hasUser($user)) {
            return response()->json(['status' => 'error', 'message' => 'Anda tidak memiliki akses ke materi kelas ini.'], 403);
        }

        $materi = Materi::where('kelas_id', $classId)
            ->where('id', $id)
            ->with(['versiAktif', 'versi.creator', 'versi.reviewer', 'mapel', 'creator'])
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $materi
        ]);
    }

    public function verifyVersion(Request $request, $classId, $versiId)
    {
        $user = $request->user();
        $class = ClassModel::findOrFail($classId);

        $member = $class->classMembers()->where('user_id', $user->id)->first();
        if (!$member || $member->role !== 'owner') {
            return response()->json(['message' => 'Hanya Owner kelas yang dapat memverifikasi materi.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:terverifikasi,perlu_perbaikan,ditolak',
            'catatan_review' => 'nullable|string',
        ]);

        $versi = MateriVersi::findOrFail($versiId);
        $versi->update([
            'status' => $validated['status'],
            'ditinjau_oleh' => $user->id,
            'ditinjau_pada' => now(),
            'catatan_review' => $validated['catatan_review'] ?? null,
        ]);

        if ($validated['status'] === 'terverifikasi') {
            $versi->materi->update(['versi_aktif_id' => $versi->id]);
        }

        LogAktivitas::create([
            'kelas_id' => $classId,
            'user_id' => $user->id,
            'peran_user' => 'OWNER',
            'deskripsi_aksi' => "Memverifikasi versi materi \"{$versi->materi->judul}\" (Status: {$validated['status']})",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Status versi materi berhasil diperbarui menjadi {$validated['status']}.",
            'data' => $versi
        ]);
    }

    public function update(Request $request, $classId, $materiId)
    {
        $user = $request->user();
        $class = ClassModel::findOrFail($classId);

        $member = $class->classMembers()->where('user_id', $user->id)->first();
        if (!$member || !in_array($member->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Hanya Owner atau Admin yang dapat memperbarui materi.'], 403);
        }

        $materi = Materi::where('kelas_id', $classId)->where('id', $materiId)->firstOrFail();

        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'ringkasan' => 'nullable|string',
            'isi' => 'required|string',
            'mapel_id' => 'nullable|exists:mapel,id',
        ]);

        if (isset($validated['judul'])) {
            $materi->judul = $validated['judul'];
        }
        if (array_key_exists('ringkasan', $validated)) {
            $materi->ringkasan = $validated['ringkasan'];
        }
        if (array_key_exists('mapel_id', $validated)) {
            $materi->mapel_id = $validated['mapel_id'];
        }
        $materi->save();

        $maxVersi = MateriVersi::where('materi_id', $materi->id)->max('nomor_versi') ?: 1;
        $nextVersi = $maxVersi + 1;

        $status = ($member->role === 'owner') ? 'terverifikasi' : 'menunggu_verifikasi';

        $versi = MateriVersi::create([
            'materi_id' => $materi->id,
            'nomor_versi' => $nextVersi,
            'isi' => $validated['isi'],
            'status' => $status,
            'dibuat_oleh' => $user->id,
            'ditinjau_oleh' => ($member->role === 'owner') ? $user->id : null,
            'ditinjau_pada' => ($member->role === 'owner') ? now() : null,
        ]);

        if ($member->role === 'owner') {
            $materi->update(['versi_aktif_id' => $versi->id]);
        }

        LogAktivitas::create([
            'kelas_id' => $classId,
            'user_id' => $user->id,
            'peran_user' => strtoupper($member->role),
            'deskripsi_aksi' => ($member->role === 'owner')
                ? "Memperbarui materi \"{$materi->judul}\" ke versi {$nextVersi} (Terverifikasi)"
                : "Mengajukan pembaruan materi \"{$materi->judul}\" ke versi {$nextVersi} (Menunggu Verifikasi)",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => ($member->role === 'owner')
                ? "Materi \"{$materi->judul}\" berhasil diperbarui ke versi {$nextVersi}!"
                : "Pembaruan materi \"{$materi->judul}\" versi {$nextVersi} diajukan! Menunggu Verifikasi Owner.",
            'data' => $materi->load(['versiAktif', 'versi.creator'])
        ]);
    }
}
