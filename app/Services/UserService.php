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
        return User::create($data);
    }

    public function updateUser(User $user, array $data)
    {
        if (empty($data['password'])) {
            unset($data['password'], $data['password_confirmation']);
        }

        $user->update($data);
        return $user;
    }

    public function deleteUser(User $user)
    {
        if ($user->role === User::ROLE_ADMIN) {
            $adminCount = User::where('role', User::ROLE_ADMIN)->count();
            
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
