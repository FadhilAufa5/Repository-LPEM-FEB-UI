<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use App\Services\RolePermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    protected $rolePermissionService;

    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'module' => $request->input('module'),
            'sort_by' => $request->input('sort_by', 'module'),
            'sort_order' => $request->input('sort_order', 'asc'),
        ];

        $perPage = $request->input('per_page', 20);
        $permissions = $this->rolePermissionService->getFilteredPermissions($filters, $perPage);
        $modules = $this->rolePermissionService->getUniqueModules();

        return Inertia::render('permissions', [
            'permissions' => PermissionResource::collection($permissions),
            'modules' => $modules,
            'filters' => $filters,
        ]);
    }

    public function store(StorePermissionRequest $request)
    {
        $this->rolePermissionService->createPermission($request->validated());

        return redirect()->back()->with('success', 'Permission berhasil ditambahkan!');
    }

    public function show(Permission $permission)
    {
        $permission->load('roles');
        return new PermissionResource($permission);
    }

    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $this->rolePermissionService->updatePermission($permission, $request->validated());

        return redirect()->back()->with('success', 'Permission berhasil diperbarui!');
    }

    public function destroy(Permission $permission)
    {
        try {
            $this->rolePermissionService->deletePermission($permission);
            return redirect()->back()->with('success', 'Permission berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
