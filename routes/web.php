<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/repository', [\App\Http\Controllers\RepositoryController::class, 'index'])->name('repository');
Route::get('/repository/{id}', [\App\Http\Controllers\RepositoryController::class, 'show'])->name('repository.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Asset Management Routes - accessible by all authenticated users
    Route::resource('assets', \App\Http\Controllers\AssetController::class);

    // Admin Only Routes
    Route::middleware(['role:admin'])->group(function () {
        // User Management Routes
        Route::resource('users', \App\Http\Controllers\UserController::class);

        // Role Management Routes
        Route::resource('roles', \App\Http\Controllers\RoleController::class);

        // Permission Management Routes
        Route::resource('permissions', \App\Http\Controllers\PermissionController::class);
    });
});

require __DIR__.'/settings.php';
