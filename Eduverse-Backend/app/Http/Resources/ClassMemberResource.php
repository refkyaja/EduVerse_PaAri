<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassMemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $this->user ?? $this->resource;
        $name = $user->name ?? $user->username ?? 'Anggota Kelas';
        $photo = (!empty($user->profile_photo) && !str_contains($user->profile_photo, 'unsplash'))
            ? $user->profile_photo
            : "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=8b5cf6&color=ffffff&bold=true&size=256";

        return [
            'id' => $user->id ?? $this->id,
            'name' => $name,
            'username' => $user->username ?? '',
            'email' => $user->email ?? '',
            'profile_photo' => $photo,
            'avatar' => $photo,
            'role' => $this->role ?? ($this->pivot->role ?? 'member'),
            'joined_at' => $this->joined_at ?? ($this->pivot->joined_at ?? $this->created_at),
        ];
    }
}
