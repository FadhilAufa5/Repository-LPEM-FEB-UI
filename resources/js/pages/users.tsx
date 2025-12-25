import { DeleteUserDialog } from '@/components/delete-user-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UserDialog } from '@/components/user-dialog';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'User Management',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    phone?: string;
    avatar?: string;
    created_at: string;
}

interface UsersPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
}

export default function Users() {
    const { users, filters } = usePage<UsersPageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>();

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/users',
            {
                search: value,
                role: roleFilter !== 'all' ? roleFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleRoleFilter = (value: string) => {
        setRoleFilter(value);
        router.get(
            '/users',
            {
                search,
                role: value !== 'all' ? value : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        router.get(
            '/users',
            {
                search,
                role: roleFilter !== 'all' ? roleFilter : undefined,
                status: value !== 'all' ? value : undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setUserDialogOpen(true);
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleAddNew = () => {
        setSelectedUser(undefined);
        setUserDialogOpen(true);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            User Management
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola pengguna dan hak akses mereka. User terdaftar
                            dapat login dengan OTP email atau password.
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="w-full sm:w-auto">
                        <Plus className="mr-2 size-4" />
                        Tambah User
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                        <Input
                            placeholder="Cari berdasarkan nama, email, atau telepon..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={handleRoleFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Semua Peran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Peran</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter}
                        onValueChange={handleStatusFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">
                                Tidak Aktif
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    Avatar
                                </TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Email
                                </TableHead>
                                <TableHead className="hidden lg:table-cell">
                                    Telepon
                                </TableHead>
                                <TableHead>Peran</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center"
                                    >
                                        Tidak ada data user.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Avatar className="size-10">
                                                <AvatarImage
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback>
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div>
                                                <div>{user.name}</div>
                                                <div className="text-xs text-neutral-500 md:hidden">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {user.email}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {user.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.role === 'admin'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="capitalize"
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.status === 'active'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className={
                                                    user.status === 'active'
                                                        ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400'
                                                        : 'bg-neutral-500/10 text-neutral-700 hover:bg-neutral-500/20 dark:text-neutral-400'
                                                }
                                            >
                                                {user.status === 'active'
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                    className="size-8 p-0"
                                                >
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(user)
                                                    }
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
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <div className="text-sm text-neutral-500">
                            Menampilkan{' '}
                            {(users.current_page - 1) * users.per_page + 1}{' '}
                            hingga{' '}
                            {Math.min(
                                users.current_page * users.per_page,
                                users.total,
                            )}{' '}
                            dari {users.total} user
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        `/users?page=${users.current_page - 1}`,
                                        {
                                            search,
                                            role:
                                                roleFilter !== 'all'
                                                    ? roleFilter
                                                    : undefined,
                                            status:
                                                statusFilter !== 'all'
                                                    ? statusFilter
                                                    : undefined,
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    )
                                }
                                disabled={users.current_page === 1}
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        `/users?page=${users.current_page + 1}`,
                                        {
                                            search,
                                            role:
                                                roleFilter !== 'all'
                                                    ? roleFilter
                                                    : undefined,
                                            status:
                                                statusFilter !== 'all'
                                                    ? statusFilter
                                                    : undefined,
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    )
                                }
                                disabled={
                                    users.current_page === users.last_page
                                }
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <UserDialog
                open={userDialogOpen}
                onOpenChange={setUserDialogOpen}
                user={selectedUser}
            />
            <DeleteUserDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                user={selectedUser}
            />
        </AppLayout>
    );
}
