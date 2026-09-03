<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateClassRequest;
use App\Http\Requests\JoinClassRequest;
use App\Http\Requests\UpdateClassRequest;
use App\Http\Resources\ClassResource;
use App\Models\ClassMember;
use App\Models\ClassModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ClassController extends Controller
{
    /**
     * Get all classes joined or owned by the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $classes = ClassModel::where(function ($query) use ($user) {
            $query->whereHas('classMembers', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->orWhere('owner_id', $user->id);
        })
        ->with(['owner', 'classMembers'])
        ->latest()
        ->get();

        return response()->json([
            'status' => 'success',
            'data' => ClassResource::collection($classes),
        ]);
    }

    /**
     * Create a new class and assign authenticated user as Owner.
     */
    public function store(CreateClassRequest $request): JsonResponse
    {
        $user = $request->user();

        $classData = $request->validated();
        $classData['owner_id'] = $user->id;
        $classData['code'] = ClassModel::generateUniqueCode();

        $class = ClassModel::create($classData);

        // Automatically assign creator as Owner in class_members
        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $user->id,
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kelas berhasil dibuat',
            'data' => new ClassResource($class->load('owner')),
        ], 201);
    }

    /**
     * Display the specified class details.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $class = ClassModel::with('owner', 'classMembers')->find($id);

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kelas tidak ditemukan',
            ], 404);
        }

        if (Gate::denies('view', $class)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses ke kelas private ini',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => new ClassResource($class),
        ]);
    }

    /**
     * Join a class using its unique code.
     */
    public function join(JoinClassRequest $request): JsonResponse
    {
        $user = $request->user();
        $code = strtoupper(trim($request->input('code')));

        $class = ClassModel::where('code', $code)->first();

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kode kelas tidak ditemukan',
            ], 404);
        }

        // Check if user is already a member
        $existing = ClassMember::where('class_id', $class->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($existing || $class->owner_id === $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah terdaftar dalam kelas ini',
            ], 400);
        }

        // Add as Member (never owner/admin automatically)
        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $user->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil bergabung ke kelas',
            'data' => new ClassResource($class->load('owner')),
        ]);
    }

    /**
     * Regenerate class code (Owner only).
     */
    public function regenerateCode(Request $request, $id): JsonResponse
    {
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kelas tidak ditemukan',
            ], 404);
        }

        if (Gate::denies('regenerateCode', $class)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya Owner yang dapat membuat ulang kode kelas',
            ], 403);
        }

        $newCode = ClassModel::generateUniqueCode();
        $class->update(['code' => $newCode]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kode kelas berhasil dibuat ulang',
            'data' => [
                'code' => $newCode,
            ],
        ]);
    }

    /**
     * Update class information (Owner only).
     */
    public function update(UpdateClassRequest $request, $id): JsonResponse
    {
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kelas tidak ditemukan',
            ], 404);
        }

        if (Gate::denies('update', $class)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya Owner yang dapat mengubah informasi kelas',
            ], 403);
        }

        $class->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Informasi kelas berhasil diperbarui',
            'data' => new ClassResource($class->load('owner')),
        ]);
    }

    /**
     * Delete a class (Owner only).
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kelas tidak ditemukan',
            ], 404);
        }

        if (Gate::denies('delete', $class)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya Owner yang dapat menghapus kelas',
            ], 403);
        }

        $class->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kelas berhasil dihapus',
        ]);
    }
}
