<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // User Management Routes
    Route::resource('users', \App\Http\Controllers\UserController::class);

    // Role Management Routes
    Route::resource('roles', \App\Http\Controllers\RoleController::class);

    // Permission Management Routes
    Route::resource('permissions', \App\Http\Controllers\PermissionController::class);

    // Asset Management Routes
    Route::resource('assets', \App\Http\Controllers\AssetController::class);
});

require __DIR__.'/settings.php';
