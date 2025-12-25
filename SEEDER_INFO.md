# Database Seeder Information

## Important Note

⚠️ **The seeder will automatically assign roles to existing users that don't have roles:**
- Users with 'super' or 'admin' in their email will get the **admin** role
- All other users will get the **user** role

## Default Credentials

After running `php artisan db:seed`, the following users will be created:

### Admin Account
- **Email**: admin@example.com
- **Password**: password
- **Role**: Admin
- **Access**: Full access to all features including User Management, Roles & Permissions

### Regular Users

#### User 1
- **Email**: user@example.com
- **Password**: password
- **Role**: User
- **Access**: Dashboard and own Assets only

#### User 2
- **Email**: john.doe@example.com
- **Password**: password
- **Role**: User
- **Access**: Dashboard and own Assets only

#### User 3
- **Email**: jane.smith@example.com
- **Password**: password
- **Role**: User
- **Access**: Dashboard and own Assets only

## Roles & Permissions

### Admin Role
- Full access to User Management
- Full access to Roles & Permissions Management
- Full access to all Assets (view, create, edit, delete)
- Can view all dashboard statistics

### User Role
- Can only view own Assets
- Can create, edit, delete own Assets
- Can only view dashboard statistics from own Assets
- Cannot access User Management, Roles & Permissions

## Running Seeders

### Run all seeders
```bash
php artisan db:seed
```

### Run specific seeder
```bash
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
```

### Fresh migration with seeder
```bash
php artisan migrate:fresh --seed
```

## Troubleshooting

### Users Without Roles

If you have existing users without roles, run the seeder again:
```bash
php artisan db:seed --class=UserSeeder
```

This will automatically detect and assign appropriate roles to users without roles.

### Manually Assign Roles

To manually assign a role to a user using tinker:
```bash
php artisan tinker
```

Then run:
```php
$user = User::where('email', 'user@example.com')->first();
$role = Role::where('slug', 'admin')->first();
$user->roles()->attach($role->id);
```

## Notes

- All seeded users have `email_verified_at` set to current timestamp
- All seeded users have `status` set to `active`
- Passwords are hashed using Laravel's Hash facade
- Seeders use `firstOrCreate` to prevent duplicates
- UserSeeder automatically fixes users without roles on each run
