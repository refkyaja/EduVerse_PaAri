<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use App\Models\PercobaanKuis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    public function index(Request $request, $classId)
    {
        $user = $request->user();
        $class = ClassModel::find($classId);
        if (!$class || !$class->hasUser($user)) {
            return response()->json(['status' => 'error', 'message' => 'Anda tidak memiliki akses ke leaderboard kelas ini.'], 403);
        }

        // Aggregate total XP earned by each member in this class
        $rankings = DB::table('class_members')
            ->join('users', 'class_members.user_id', '=', 'users.id')
            ->leftJoin('kuis', 'kuis.kelas_id', '=', 'class_members.class_id')
            ->leftJoin('percobaan_kuis', function ($join) {
                $join->on('percobaan_kuis.kuis_id', '=', 'kuis.id')
                     ->on('percobaan_kuis.user_id', '=', 'class_members.user_id');
            })
            ->where('class_members.class_id', $classId)
            ->select(
                'users.id as user_id',
                'users.name',
                'users.profile_photo',
                'class_members.role',
                DB::raw('COALESCE(SUM(percobaan_kuis.xp_didapat), 0) as total_xp')
            )
            ->groupBy('users.id', 'users.name', 'users.profile_photo', 'class_members.role')
            ->orderBy('total_xp', 'desc')
            ->get();

        $rankings->transform(function ($item, $index) use ($request) {
            $item->rank = $index + 1;
            $item->is_current_user = ($request->user() && $request->user()->id == $item->user_id);
            return $item;
        });

        return response()->json([
            'status' => 'success',
            'data' => $rankings
        ]);
    }
}
