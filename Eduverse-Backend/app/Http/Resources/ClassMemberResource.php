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
        // Support both ClassMember pivot model or direct User model
        $user = $this->resource instanceof \App\Models::class ? $this->resource : ($this->user ?? $this->resource);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'profile_photo' => $user->profile_photo,
            'role' => $this->pivot->role ?? $this->role ?? 'member',
            'joined_at' => $this->pivot->joined_at ?? $this->joined_at ?? $this->created_at,
        ];
    }
}
