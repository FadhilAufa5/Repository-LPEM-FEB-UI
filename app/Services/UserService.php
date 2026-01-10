<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserService
{
    public function getFilteredUsers(array $filters, int $perPage = 10)
    {
        $query = User::query();

        $this->applySearchFilter($query, $filters['search'] ?? null);
        $this->applyRoleFilter($query, $filters['role'] ?? null);
        $this->applyStatusFilter($query, $filters['status'] ?? null);
        $this->applySorting($query, $filters['sort_by'] ?? 'created_at', $filters['sort_order'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function createUser(array $data)
    {
        // Extract role from data and remove it from user data to handle separately
        $roleSlug = $data['role'] ?? 'user'; // Default to 'user' role
        unset($data['role']);
        
        // Create the user with all other data
        $user = User::create($data);
        
        // Get the role model and attach it to the user via the relationship
        $role = \App\Models\Role::where('slug', $roleSlug)->first();
        if ($role) {
            $user->roles()->attach($role->id);
        }
        
        // Also update the legacy role field for backward compatibility
        $user->update(['role' => $roleSlug]);
        
        return $user;
    }

    public function updateUser(User $user, array $data)
    {
        if (empty($data['password'])) {
            unset($data['password'], $data['password_confirmation']);
        }

        // Handle role update separately from other user data
        $roleSlug = $data['role'] ?? null;
        unset($data['role']);

        $user->update($data);

        // If role is being updated, sync it with the roles relationship
        if ($roleSlug) {
            $role = \App\Models\Role::where('slug', $roleSlug)->first();
            if ($role) {
                $user->roles()->sync([$role->id]); // Sync replaces all existing roles
            }
            
            // Also update the legacy role field for backward compatibility
            $user->update(['role' => $roleSlug]);
        }

        return $user;
    }

    public function deleteUser(User $user)
    {
        if ($user->hasRole(User::ROLE_ADMIN)) {
            $adminCount = User::whereHas('roles', function ($query) {
                $query->where('slug', User::ROLE_ADMIN);
            })->count();
            
            if ($adminCount <= 1) {
                throw new \Exception('Tidak dapat menghapus admin terakhir!');
            }
        }

        if ($user->id === auth()->id()) {
            throw new \Exception('Anda tidak dapat menghapus akun sendiri!');
        }

        return $user->delete();
    }

    private function applySearchFilter(Builder $query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }
    }

    private function applyRoleFilter(Builder $query, ?string $role): void
    {
        if ($role) {
            $query->where('role', $role);
        }
    }

    private function applyStatusFilter(Builder $query, ?string $status): void
    {
        if ($status) {
            $query->where('status', $status);
        }
    }

    private function applySorting(Builder $query, string $sortBy, string $sortOrder): void
    {
        $query->orderBy($sortBy, $sortOrder);
    }
}
