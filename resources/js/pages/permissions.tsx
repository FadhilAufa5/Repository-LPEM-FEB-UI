import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, Key } from 'lucide-react';
import { useState } from 'react';
import { DeletePermissionDialog } from '@/components/delete-permission-dialog';
import { PermissionDialog } from '@/components/permission-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Permission Management',
        href: '/permissions',
    },
];

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
    description?: string;
    roles_count: number;
    created_at: string;
}

interface PermissionsPageProps {
    permissions: {
        data: Permission[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    modules: string[];
    filters: {
        search?: string;
        module?: string;
    };
}

export default function Permissions() {
    const { permissions, modules, filters } = usePage<PermissionsPageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [moduleFilter, setModuleFilter] = useState(filters.module || 'all');
    const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | undefined>();

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/permissions',
            { search: value, module: moduleFilter !== 'all' ? moduleFilter : undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleModuleFilter = (value: string) => {
        setModuleFilter(value);
        router.get(
            '/permissions',
            { search, module: value !== 'all' ? value : undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleEdit = (permission: Permission) => {
        setSelectedPermission(permission);
        setPermissionDialogOpen(true);
    };

    const handleDelete = (permission: Permission) => {
        setSelectedPermission(permission);
        setDeleteDialogOpen(true);
    };

    const handleAddNew = () => {
        setSelectedPermission(undefined);
        setPermissionDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Permission Management</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola permissions yang tersedia di sistem
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="w-full sm:w-auto">
                        <Plus className="mr-2 size-4" />
                        Tambah Permission
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                        <Input
                            placeholder="Cari permission berdasarkan nama, slug, atau module..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={moduleFilter} onValueChange={handleModuleFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Semua Module" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Module</SelectItem>
                            {modules.map((module) => (
                                <SelectItem key={module} value={module} className="capitalize">
                                    {module}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Permission</TableHead>
                                <TableHead className="hidden md:table-cell">Slug</TableHead>
                                <TableHead>Module</TableHead>
                                <TableHead className="hidden lg:table-cell">Deskripsi</TableHead>
                                <TableHead className="text-center">Roles</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {permissions.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Tidak ada data permission.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                permissions.data.map((permission) => (
                                    <TableRow key={permission.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Key className="size-4 text-primary" />
                                                <div>
                                                    <div>{permission.name}</div>
                                                    <div className="font-mono text-xs text-neutral-500 md:hidden">
                                                        {permission.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden font-mono text-sm md:table-cell">
                                            {permission.slug}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {permission.module}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden max-w-xs truncate lg:table-cell">
                                            {permission.description || '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">{permission.roles_count}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(permission)}
                                                    className="size-8 p-0"
                                                >
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(permission)}
                                                    className="size-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {permissions.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <div className="text-sm text-neutral-500">
                            Menampilkan {(permissions.current_page - 1) * permissions.per_page + 1} hingga{' '}
                            {Math.min(permissions.current_page * permissions.per_page, permissions.total)} dari{' '}
                            {permissions.total} permission
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        `/permissions?page=${permissions.current_page - 1}`,
                                        { search, module: moduleFilter !== 'all' ? moduleFilter : undefined },
                                        { preserveState: true, preserveScroll: true }
                                    )
                                }
                                disabled={permissions.current_page === 1}
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        `/permissions?page=${permissions.current_page + 1}`,
                                        { search, module: moduleFilter !== 'all' ? moduleFilter : undefined },
                                        { preserveState: true, preserveScroll: true }
                                    )
                                }
                                disabled={permissions.current_page === permissions.last_page}
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <PermissionDialog
                open={permissionDialogOpen}
                onOpenChange={setPermissionDialogOpen}
                permission={selectedPermission}
                modules={modules}
            />
            <DeletePermissionDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                permission={selectedPermission}
            />
        </AppLayout>
    );
}
