<?php

namespace App\Policies;

use App\Models\ClassModel;
use App\Models\User;

class ClassPolicy
{
    /**
     * Determine whether the user can view the class details.
     */
    public function view(User $user, ClassModel $class): bool
    {
        if ($class->visibility === 'public') {
            return true;
        }

        return $class->hasUser($user);
    }

    /**
     * Determine whether the user can view the class members list.
     */
    public function viewMembers(User $user, ClassModel $class): bool
    {
        return $class->hasUser($user);
    }

    /**
     * Determine whether the user can update the class.
     */
    public function update(User $user, ClassModel $class): bool
    {
        return $class->owner_id === $user->id;
    }

    /**
     * Determine whether the user can delete the class.
     */
    public function delete(User $user, ClassModel $class): bool
    {
        return $class->owner_id === $user->id;
    }

    /**
     * Determine whether the user can regenerate the class code.
     */
    public function regenerateCode(User $user, ClassModel $class): bool
    {
        return $class->owner_id === $user->id;
    }

    /**
     * Determine whether the user can manage members (promote, demote, kick).
     */
    public function manageMembers(User $user, ClassModel $class): bool
    {
        return $class->owner_id === $user->id;
    }

    /**
     * Determine whether the user can leave the class (Owner CANNOT leave).
     */
    public function leave(User $user, ClassModel $class): bool
    {
        if ($class->owner_id === $user->id) {
            return false;
        }

        return $class->hasUser($user);
    }
}
