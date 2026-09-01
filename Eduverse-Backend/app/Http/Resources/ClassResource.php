<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $role = $this->pivot ? $this->pivot->role : ($user ? $this->getRoleForUser($user) : null);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->category,
            'visibility' => $this->visibility,
            'code' => $this->code,
            'role' => $role,
            'owner' => [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
                'username' => $this->owner->username,
                'profile_photo' => $this->owner->profile_photo,
            ],
            'member_count' => $this->classMembers()->count(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
