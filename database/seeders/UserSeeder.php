<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $adminRole = Role::where('slug', 'admin')->first();
        $userRole = Role::where('slug', 'user')->first();

        if (!$adminRole || !$userRole) {
            $this->command->error('Roles not found! Please run PermissionSeeder and RoleSeeder first.');
            return;
        }

        // Fix existing users without roles
        $this->assignRolesToExistingUsers($adminRole, $userRole);

        
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        // Attach admin role
        if (!$admin->roles()->where('role_id', $adminRole->id)->exists()) {
            $admin->roles()->attach($adminRole->id);
        }

        // Create Regular User 1
        $user1 = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        // Attach user role
        if ($userRole && !$user1->roles()->where('role_id', $userRole->id)->exists()) {
            $user1->roles()->attach($userRole->id);
        }

        // Create Regular User 2
        $user2 = User::firstOrCreate(
            ['email' => 'john.doe@example.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        // Attach user role
        if ($userRole && !$user2->roles()->where('role_id', $userRole->id)->exists()) {
            $user2->roles()->attach($userRole->id);
        }

        // Create Regular User 3
        $user3 = User::firstOrCreate(
            ['email' => 'jane.smith@example.com'],
            [
                'name' => 'Jane Smith',
                'password' => Hash::make('password'),
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        // Attach user role
        if ($userRole && !$user3->roles()->where('role_id', $userRole->id)->exists()) {
            $user3->roles()->attach($userRole->id);
        }

        $this->command->info('Users seeded successfully!');
        $this->command->info('Admin: admin@example.com / password');
        $this->command->info('User 1: user@example.com / password');
        $this->command->info('User 2: john.doe@example.com / password');
        $this->command->info('User 3: jane.smith@example.com / password');
    }

    /**
     * Assign roles to existing users that don't have roles
     */
    private function assignRolesToExistingUsers(Role $adminRole, Role $userRole): void
    {
        $usersWithoutRoles = User::doesntHave('roles')->get();
        
        if ($usersWithoutRoles->isEmpty()) {
            return;
        }

        $this->command->info("Found {$usersWithoutRoles->count()} users without roles. Assigning default roles...");
        
        foreach ($usersWithoutRoles as $user) {
            // Assign admin role to users with 'super' or 'admin' in email
            if (str_contains($user->email, 'super') || str_contains($user->email, 'admin')) {
                $user->roles()->attach($adminRole->id);
                $this->command->info("  - Assigned 'admin' role to {$user->email}");
            } else {
                // Assign user role to others
                $user->roles()->attach($userRole->id);
                $this->command->info("  - Assigned 'user' role to {$user->email}");
            }
        }
    }
}
