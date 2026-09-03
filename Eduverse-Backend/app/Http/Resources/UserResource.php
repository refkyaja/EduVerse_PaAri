<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $attempts = \App\Models\PercobaanKuis::where('user_id', $this->id)->get();
        $examsCompleted = $attempts->count();
        $totalXp = (int)$attempts->sum('xp_didapat');
        
        $attemptIds = $attempts->pluck('id');
        $totalAnswers = \App\Models\JawabanPercobaan::whereIn('percobaan_id', $attemptIds)->count();
        $correctAnswers = \App\Models\JawabanPercobaan::whereIn('percobaan_id', $attemptIds)->where('benar', 1)->count();

        $accuracy = $totalAnswers > 0 
            ? (int)round(($correctAnswers / $totalAnswers) * 100) 
            : ($examsCompleted > 0 ? (int)round($attempts->avg('skor')) : 0);

        $avatarUrl = $this->profile_photo ? $this->profile_photo : "https://ui-avatars.com/api/?name=" . urlencode($this->name ?? $this->username ?? 'User') . "&background=8b5cf6&color=ffffff&bold=true&size=256";

        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'profile_photo' => $avatarUrl,
            'avatar' => $avatarUrl,
            'bio' => $this->bio,
            'xp' => $totalXp,
            'exams_completed' => $examsCompleted,
            'correct_answers' => $correctAnswers,
            'accuracy' => $accuracy,
            'streak' => 7,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
