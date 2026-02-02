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
import { useState, useCallback, useEffect } from 'react';

/* ================= CONSTANTS ================= */
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'User Management', href: '/users' },
];

/* ================= TYPES ================= */
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

/* ================= HELPERS ================= */
const getInitials = (name: string): string =>
    name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

const buildFilterParams = (
    search: string,
    role: string,
    status: string,
    page = 1,
) => {
    const params: Record<string, any> = { page };

    if (search.trim()) params.search = search.trim();
    if (role !== 'all') params.role = role;
    if (status !== 'all') params.status = status;

    return params;
};

/* ================= MAIN ================= */
export default function Users() {
    const { users, filters } = usePage<UsersPageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>();

    /* ===== FILTER APPLY (SINGLE SOURCE) ===== */
    const applyFilters = useCallback(
        (page = 1) => {
            router.get(
                '/users',
                buildFilterParams(search, roleFilter, statusFilter, page),
                { preserveState: true, preserveScroll: true },
            );
        },
        [search, roleFilter, statusFilter],
    );

    /* ===== SEARCH DEBOUNCE ===== */
    useEffect(() => {
        const timeout = setTimeout(() => {
            applyFilters(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, applyFilters]);

    /* ===== HANDLERS ===== */
    const handleRoleChange = (value: string) => {
        setRoleFilter(value);
        router.get(
            '/users',
            buildFilterParams(search, value, statusFilter, 1),
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        router.get(
            '/users',
            buildFilterParams(search, roleFilter, value, 1),
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleNavigatePage = (page: number) => {
        applyFilters(page);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <p className="text-sm text-neutral-500">
                            Manage users and access rights
                        </p>
                    </div>
                    <Button onClick={() => setUserDialogOpen(true)}>
                        <Plus className="mr-2 size-4" />
                        Add User
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                        <Input
                            className="pl-10"
                            placeholder="Search name, email, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Select value={roleFilter} onValueChange={handleRoleChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={statusFilter}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            user.role === 'admin'
                                                ? 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:text-blue-300 capitalize'
                                                : 'bg-neutral-500/10 text-neutral-700 hover:bg-neutral-500/20 dark:text-neutral-400 capitalize'
                                        }
                                    >
                                        {user.role === 'admin' ? 'Admin' : 'User'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            user.status === 'active'
                                                ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400'
                                                : 'bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-400'
                                        }
                                    >
                                        {user.status === 'active' ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setUserDialogOpen(true);
                                        }}
                                    >
                                        <Edit2 className="size-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        <Trash2 className="size-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-between">
                    <Button
                        disabled={users.current_page === 1}
                        onClick={() =>
                            handleNavigatePage(users.current_page - 1)
                        }
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={users.current_page === users.last_page}
                        onClick={() =>
                            handleNavigatePage(users.current_page + 1)
                        }
                    >
                        Next
                    </Button>
                </div>
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
