import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, Shield } from 'lucide-react';
import { useState } from 'react';
import { DeleteRoleDialog } from '@/components/delete-role-dialog';
import { RoleDialog } from '@/components/role-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Role Management',
        href: '/roles',
    },
];

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface Role {
    id: number;
    name: string;
    slug: string;
    description?: string;
    permissions?: Permission[];
    permissions_count: number;
    users_count: number;
    created_at: string;
}

interface RolesPageProps {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    allPermissions: Record<string, Permission[]>;
    filters: {
        search?: string;
    };
}

export default function Roles() {
    const { roles, allPermissions, filters } = usePage<RolesPageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | undefined>();

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get('/roles', { search: value }, { preserveState: true, preserveScroll: true });
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setRoleDialogOpen(true);
    };

    const handleDelete = (role: Role) => {
        setSelectedRole(role);
        setDeleteDialogOpen(true);
    };

    const handleAddNew = () => {
        setSelectedRole(undefined);
        setRoleDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Role Management</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola roles dan permissions sistem
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="w-full sm:w-auto">
                        <Plus className="mr-2 size-4" />
                        Tambah Role
                    </Button>
                </div>

                {/* Search */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                        <Input
                            placeholder="Cari role berdasarkan nama, slug, atau deskripsi..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Role</TableHead>
                                <TableHead className="hidden md:table-cell">Slug</TableHead>
                                <TableHead className="hidden lg:table-cell">Deskripsi</TableHead>
                                <TableHead className="text-center">Permissions</TableHead>
                                <TableHead className="text-center">Users</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Tidak ada data role.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.data.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Shield className="size-4 text-primary" />
                                                <div>
                                                    <div>{role.name}</div>
                                                    <div className="text-xs text-neutral-500 md:hidden">
                                                        {role.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden font-mono text-sm md:table-cell">
                                            {role.slug}
                                        </TableCell>
                                        <TableCell className="hidden max-w-xs truncate lg:table-cell">
                                            {role.description || '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">{role.permissions_count}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">{role.users_count}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(role)}
                                                    className="size-8 p-0"
                                                >
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(role)}
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
                {roles.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <div className="text-sm text-neutral-500">
                            Menampilkan {(roles.current_page - 1) * roles.per_page + 1} hingga{' '}
                            {Math.min(roles.current_page * roles.per_page, roles.total)} dari {roles.total} role
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        `/roles?page=${roles.current_page - 1}`,
                                        { search },
                                        { preserveState: true, preserveScroll: true }
                                    )
                                }
                                disabled={roles.current_page === 1}
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        `/roles?page=${roles.current_page + 1}`,
                                        { search },
                                        { preserveState: true, preserveScroll: true }
                                    )
                                }
                                disabled={roles.current_page === roles.last_page}
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <RoleDialog
                open={roleDialogOpen}
                onOpenChange={setRoleDialogOpen}
                role={selectedRole}
                allPermissions={allPermissions}
            />
            <DeleteRoleDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} role={selectedRole} />
        </AppLayout>
    );
}
