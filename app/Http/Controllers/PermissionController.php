<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Permission::query()->withCount('roles');

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('module', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by module
        if ($module = $request->input('module')) {
            $query->where('module', $module);
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'module');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder)->orderBy('name', 'asc');

        // Pagination
        $perPage = $request->input('per_page', 20);
        $permissions = $query->paginate($perPage);

        // Get unique modules for filter
        $modules = Permission::select('module')->distinct()->orderBy('module')->pluck('module');

        return Inertia::render('permissions', [
            'permissions' => PermissionResource::collection($permissions),
            'modules' => $modules,
            'filters' => [
                'search' => $search,
                'module' => $module,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermissionRequest $request)
    {
        $validated = $request->validated();

        Permission::create($validated);

        return redirect()->back()->with('success', 'Permission berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        $permission->load('roles');
        return new PermissionResource($permission);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $validated = $request->validated();

        $permission->update($validated);

        return redirect()->back()->with('success', 'Permission berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        // Check if permission is assigned to roles
        $rolesCount = $permission->roles()->count();
        if ($rolesCount > 0) {
            return redirect()->back()->with('error', "Tidak dapat menghapus permission karena masih digunakan oleh {$rolesCount} role!");
        }

        $permission->delete();

        return redirect()->back()->with('success', 'Permission berhasil dihapus!');
    }
}
