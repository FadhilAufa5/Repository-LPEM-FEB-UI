<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Services\RolePermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
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
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
        ];

        $perPage = $request->input('per_page', 10);
        $roles = $this->rolePermissionService->getFilteredRoles($filters, $perPage);
        $allPermissions = $this->rolePermissionService->getAllPermissionsGrouped();

        return Inertia::render('roles', [
            'roles' => RoleResource::collection($roles),
            'allPermissions' => $allPermissions,
            'filters' => $filters,
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $this->rolePermissionService->createRole($request->validated());

        return redirect()->back()->with('success', 'Role berhasil ditambahkan!');
    }

    public function show(Role $role)
    {
        $role->load('permissions');
        return new RoleResource($role);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->rolePermissionService->updateRole($role, $request->validated());

        return redirect()->back()->with('success', 'Role berhasil diperbarui!');
    }

    public function destroy(Role $role)
    {
        try {
            $this->rolePermissionService->deleteRole($role);
            return redirect()->back()->with('success', 'Role berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
