<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Super Admin Role - has all permissions
        $superAdmin = Role::firstOrCreate(
            ['slug' => 'super-admin'],
            [
                'name' => 'Super Admin',
                'description' => 'Has full access to all features and settings',
            ]
        );
        
        // Assign all permissions to Super Admin
        $allPermissions = Permission::all();
        $superAdmin->permissions()->sync($allPermissions->pluck('id'));

        // Admin Role - has most permissions except role/permission management
        $admin = Role::firstOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Admin',
                'description' => 'Has admin access except for role and permission management',
            ]
        );
        
        $adminPermissions = Permission::whereNotIn('module', ['roles', 'permissions'])->get();
        $admin->permissions()->sync($adminPermissions->pluck('id'));

        // Manager Role - can view and manage users
        $manager = Role::firstOrCreate(
            ['slug' => 'manager'],
            [
                'name' => 'Manager',
                'description' => 'Can manage users and view dashboard',
            ]
        );
        
        $managerPermissions = Permission::whereIn('slug', [
            'dashboard.view',
            'users.view',
            'users.create',
            'users.edit',
            'assets.view',
            'assets.create',
            'assets.edit',
        ])->get();
        $manager->permissions()->sync($managerPermissions->pluck('id'));

        // User Role - basic access
        $user = Role::firstOrCreate(
            ['slug' => 'user'],
            [
                'name' => 'User',
                'description' => 'Basic user access with asset management capabilities',
            ]
        );
        
        $userPermissions = Permission::whereIn('slug', [
            'dashboard.view',
            'users.view',
            'assets.view',
            'assets.create',
            'assets.edit',
            'assets.delete',
        ])->get();
        $user->permissions()->sync($userPermissions->pluck('id'));
    }
}
