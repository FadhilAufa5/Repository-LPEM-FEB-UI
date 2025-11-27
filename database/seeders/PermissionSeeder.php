<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $permissions = [
            // Dashboard
            ['name' => 'View Dashboard', 'slug' => 'dashboard.view', 'module' => 'dashboard', 'description' => 'Can view dashboard'],

            // Users
            ['name' => 'View Users', 'slug' => 'users.view', 'module' => 'users', 'description' => 'Can view users list'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module' => 'users', 'description' => 'Can create new users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'module' => 'users', 'description' => 'Can edit existing users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module' => 'users', 'description' => 'Can delete users'],

            // Roles
            ['name' => 'View Roles', 'slug' => 'roles.view', 'module' => 'roles', 'description' => 'Can view roles list'],
            ['name' => 'Create Roles', 'slug' => 'roles.create', 'module' => 'roles', 'description' => 'Can create new roles'],
            ['name' => 'Edit Roles', 'slug' => 'roles.edit', 'module' => 'roles', 'description' => 'Can edit existing roles'],
            ['name' => 'Delete Roles', 'slug' => 'roles.delete', 'module' => 'roles', 'description' => 'Can delete roles'],

            // Permissions
            ['name' => 'View Permissions', 'slug' => 'permissions.view', 'module' => 'permissions', 'description' => 'Can view permissions list'],
            ['name' => 'Create Permissions', 'slug' => 'permissions.create', 'module' => 'permissions', 'description' => 'Can create new permissions'],
            ['name' => 'Edit Permissions', 'slug' => 'permissions.edit', 'module' => 'permissions', 'description' => 'Can edit existing permissions'],
            ['name' => 'Delete Permissions', 'slug' => 'permissions.delete', 'module' => 'permissions', 'description' => 'Can delete permissions'],

            // Assets (future module)
            ['name' => 'View Assets', 'slug' => 'assets.view', 'module' => 'assets', 'description' => 'Can view assets list'],
            ['name' => 'Create Assets', 'slug' => 'assets.create', 'module' => 'assets', 'description' => 'Can create new assets'],
            ['name' => 'Edit Assets', 'slug' => 'assets.edit', 'module' => 'assets', 'description' => 'Can edit existing assets'],
            ['name' => 'Delete Assets', 'slug' => 'assets.delete', 'module' => 'assets', 'description' => 'Can delete assets'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
}
