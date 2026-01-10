<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "User Role Permissions:\n";
echo "=====================\n\n";

$role = App\Models\Role::where('slug', 'user')->first();

if ($role) {
    echo "Role: {$role->name}\n";
    echo "Description: {$role->description}\n\n";
    echo "Permissions:\n";
    foreach ($role->permissions as $permission) {
        echo "  - {$permission->slug} ({$permission->name})\n";
    }
} else {
    echo "User role not found!\n";
}
