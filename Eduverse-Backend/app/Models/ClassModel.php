<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ClassModel extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'classes';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'owner_id',
        'name',
        'description',
        'category',
        'visibility',
        'code',
    ];

    /**
     * Generate a unique 6-character random code for the class.
     */
    public static function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (static::where('code', $code)->exists());

        return $code;
    }

    /**
     * Get the owner of the class.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get all members of the class via pivot.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'class_members', 'class_id', 'user_id')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get the class members pivot model relationship.
     */
    public function classMembers(): HasMany
    {
        return $this->hasMany(ClassMember::class, 'class_id');
    }

    /**
     * Get role of a specific user in this class.
     */
    public function getRoleForUser(User $user): ?string
    {
        if ($this->owner_id === $user->id) {
            return 'owner';
        }

        $member = $this->classMembers()->where('user_id', $user->id)->first();
        return $member ? $member->role : null;
    }

    /**
     * Check if a user is a member of this class.
     */
    public function hasUser(User $user): bool
    {
        return $this->owner_id === $user->id || $this->classMembers()->where('user_id', $user->id)->exists();
    }
}
