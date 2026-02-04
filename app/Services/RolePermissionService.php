<?php

namespace App\Services;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Builder;

class RolePermissionService
{
    public function getFilteredRoles(array $filters, int $perPage = 10)
    {
        $query = Role::query()
            ->with('permissions') // Eager load permissions for edit dialog
            ->withCount(['permissions', 'users']);

        $this->applySearchFilter($query, $filters['search'] ?? null);
        $this->applySorting($query, $filters['sort_by'] ?? 'created_at', $filters['sort_order'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function getFilteredPermissions(array $filters, int $perPage = 20)
    {
        $query = Permission::query()->withCount('roles');

        $this->applySearchFilter($query, $filters['search'] ?? null, true);
        $this->applyModuleFilter($query, $filters['module'] ?? null);
        $this->applySorting($query, $filters['sort_by'] ?? 'module', $filters['sort_order'] ?? 'asc');
        $query->orderBy('name', 'asc');

        return $query->paginate($perPage);
    }

    public function getAllPermissionsGrouped()
    {
        return Permission::orderBy('module')->orderBy('name')->get()->groupBy('module');
    }

    public function getUniqueModules()
    {
        return Permission::select('module')->distinct()->orderBy('module')->pluck('module');
    }

    public function createRole(array $data)
    {
        $role = Role::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
        ]);

        if (!empty($data['permissions'])) {
            $role->permissions()->attach($data['permissions']);
        }

        return $role;
    }

    public function updateRole(Role $role, array $data)
    {
        $role->update([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
        ]);

        $role->permissions()->sync($data['permissions'] ?? []);
        return $role;
    }

    public function deleteRole(Role $role)
    {
        // Detach all users from this role before deleting
        $role->users()->detach();
        
        // Detach all permissions from this role
        $role->permissions()->detach();
        
        return $role->delete();
    }

    public function createPermission(array $data)
    {
        return Permission::create($data);
    }

    public function updatePermission(Permission $permission, array $data)
    {
        $permission->update($data);
        return $permission;
    }

    public function deletePermission(Permission $permission)
    {
        $rolesCount = $permission->roles()->count();
        
        if ($rolesCount > 0) {
            throw new \Exception("Tidak dapat menghapus permission karena masih digunakan oleh {$rolesCount} role!");
        }

        return $permission->delete();
    }

    private function applySearchFilter(Builder $query, ?string $search, bool $includeModule = false): void
    {
        if ($search) {
            $query->where(function ($q) use ($search, $includeModule) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
                
                if ($includeModule) {
                    $q->orWhere('module', 'like', "%{$search}%");
                }
            });
        }
    }

    private function applyModuleFilter(Builder $query, ?string $module): void
    {
        if ($module) {
            $query->where('module', $module);
        }
    }

    private function applySorting(Builder $query, string $sortBy, string $sortOrder): void
    {
        $query->orderBy($sortBy, $sortOrder);
    }
}
