<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClassMemberResource;
use App\Models\ClassMember;
use App\Models\ClassModel;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ClassMemberController extends Controller
{
    /**
     * Get list of members in a class (Members only).
     */
    public function index(Request $request, $id): JsonResponse
    {
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kelas tidak ditemukan',
            ], 404);
        }

        if (Gate::denies('viewMembers', $class)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya anggota kelas yang dapat melihat daftar anggota',
            ], 403);
        }

        // Ensure class owner is recorded in class_members
        if (!ClassMember::where('class_id', $class->id)->where('user_id', $class->owner_id)->exists()) {
            ClassMember::create([
                'class_id' => $class->id,
                'user_id' => $class->owner_id,
                'role' => 'owner',
                'joined_at' => $class->created_at ?? now(),
            ]);
        }

        $members = ClassMember::where('class_id', $class->id)
            ->with('user')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => ClassMemberResource::collection($members),
        ]);
    }

    /**
     * Promote a Member to Admin (Owner only).
     */
    public function promote(Request $request, $id, $userId): JsonResponse
    {
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kelas tidak ditemukan',
            ], 404);
        }

        if (Gate::denies('manageMembers', $class)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya Owner yang dapat mengubah role anggota',
            ], 403);
        }

        if ((int)$userId === (int)$class->owner_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role Owner tidak dapat diubah',
            ], 400);
        }

        $targetMember = ClassMember::where('class_id', $class->id)
            ->where('user_id', $userId)
            ->first();

        if (!$targetMember) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pengguna tidak ditemukan dalam kelas ini',
            ], 404);
        }

        $targetMember->update(['role' => 'admin']);

        try {
            \App\Models\LogAktivitas::create([
                'kelas_id' => $class->id,
                'user_id' => $request->user()->id,
                'peran_user' => 'OWNER',
                'deskripsi_aksi' => 'Menjadikan ' . ($targetMember->user->name ?? 'Anggota') . ' sebagai Admin',
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'status' => 'success',
            'message' => 'Anggota berhasil dijadikan Admin',
            'data' => [
                'user_id' => $targetMember->user_id,
                'role' => 'admin',
            ],
        ]);
    }

    /**
     * Demote an Admin to Member (Owner only).
     */
    public function demote(Request $request, $id, $userId): JsonResponse
    {
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kelas tidak ditemukan',
            ], 404);
        }

        if (Gate::denies('manageMembers', $class)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya Owner yang dapat mengubah role anggota',
            ], 403);
        }

        if ((int)$userId === (int)$class->owner_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Owner tidak dapat diturunkan menjadi Member',
            ], 400);
        }

        $targetMember = ClassMember::where('class_id', $class->id)
            ->where('user_id', $userId)
            ->first();

        if (!$targetMember) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pengguna tidak ditemukan dalam kelas ini',
            ], 404);
        }

        $targetMember->update(['role' => 'member']);

        return response()->json([
            'status' => 'success',
            'message' => 'Admin berhasil dikembalikan menjadi Member',
            'data' => [
                'user_id' => $targetMember->user_id,
                'role' => 'member',
            ],
        ]);
    }

    /**
     * Kick a member or admin from the class (Owner only).
     */
    public function destroy(Request $request, $id, $userId): JsonResponse
    {
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kelas tidak ditemukan',
            ], 404);
        }

        if (Gate::denies('manageMembers', $class)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya Owner yang dapat mengeluarkan anggota dari kelas',
            ], 403);
        }

        if ((int)$userId === (int)$class->owner_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Owner tidak dapat mengeluarkan dirinya sendiri',
            ], 400);
        }

        $targetMember = ClassMember::where('class_id', $class->id)
            ->where('user_id', $userId)
            ->first();

        if (!$targetMember) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pengguna tidak ditemukan dalam kelas ini',
            ], 404);
        }

        $targetMember->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Anggota berhasil dikeluarkan dari kelas',
        ]);
    }

    /**
     * Member or Admin leaves the class (Owner CANNOT leave).
     */
    public function leave(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kelas tidak ditemukan',
            ], 404);
        }

        if ($class->owner_id === $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Owner tidak dapat keluar dari kelas tanpa transfer ownership',
            ], 400);
        }

        $memberRecord = ClassMember::where('class_id', $class->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$memberRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda bukan anggota kelas ini',
            ], 400);
        }

        $memberRecord->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil keluar dari kelas',
        ]);
    }
}
