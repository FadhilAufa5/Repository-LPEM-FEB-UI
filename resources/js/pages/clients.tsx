import { ClientDialog } from '@/components/client-dialog';
import { DeleteClientDialog } from '@/components/delete-client-dialog';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Building2,
    Edit2,
    MapPin,
    Phone,
    Plus,
    Search,
    Trash2,
    User,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Client Management',
        href: '/clients',
    },
];

interface Client {
    id: number;
    kode_klien: string;
    nama_klien: string;
    type_of_client?: string;
    alamat: string;
    kode_kabupaten: string;
    kontak_person: string;
    telp: string;
    created_at: string;
    wilayah?: {
        kode_kabupaten: string;
        kabupaten: string;
        provinsi: string;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface WilayahOption {
    value: string;
    label: string;
    provinsi: string;
    kabupaten: string;
}

interface ClientsPageProps {
    clients: {
        data: Client[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    wilayahList: WilayahOption[];
    provinsiList: string[];
    filters: {
        search?: string;
        provinsi?: string;
    };
    [key: string]: unknown;
}

export default function Clients() {
    const { clients, wilayahList, provinsiList, filters } =
        usePage<ClientsPageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [provinsiFilter, setProvinsiFilter] = useState(
        filters.provinsi || 'all',
    );
    const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | undefined>();

    const handleSearch = (value: string) => {
        setSearch(value);
        const params: Record<string, any> = { search: value };
        if (provinsiFilter !== 'all') {
            params.provinsi = provinsiFilter;
        }
        router.get('/clients', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleProvinsiFilter = (value: string) => {
        setProvinsiFilter(value);
        const params: Record<string, any> = { search };
        if (value !== 'all') {
            params.provinsi = value;
        }
        router.get('/clients', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleEdit = (client: Client) => {
        setSelectedClient(client);
        setIsClientDialogOpen(true);
    };

    const handleDelete = (client: Client) => {
        setSelectedClient(client);
        setIsDeleteDialogOpen(true);
    };

    const handleAddNew = () => {
        setSelectedClient(undefined);
        setIsClientDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        setIsClientDialogOpen(open);
        if (!open) {
            setSelectedClient(undefined);
        }
    };

    const handleDeleteDialogClose = (open: boolean) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
            setSelectedClient(undefined);
        }
    };

    const handlePageChange = (page: number) => {
        const params: Record<string, any> = { search, page };
        if (provinsiFilter !== 'all') {
            params.provinsi = provinsiFilter;
        }
        router.get('/clients', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Management" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Client Management
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Manage your clients and customer information.
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="w-full sm:w-auto">
                        <Plus className="mr-2 size-4" />
                        Add Client
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                        <Input
                            placeholder="Search by code, name, address, contact..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={provinsiFilter}
                        onValueChange={handleProvinsiFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filter Provinsi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Provinces</SelectItem>
                            {provinsiList.map((provinsi) => (
                                <SelectItem key={provinsi} value={provinsi}>
                                    {provinsi}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client Code</TableHead>
                                    <TableHead>Client Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Region</TableHead>
                                    <TableHead>Contact Person</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2 text-neutral-500">
                                                <Building2 className="size-8" />
                                                <p className="text-sm">
                                                    No client data available
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    clients.data.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium">
                                                {client.kode_klien}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    <p className="truncate font-medium">
                                                        {client.nama_klien}
                                                    </p>
                                                    {client.user && (
                                                        <p className="truncate text-xs text-neutral-500">
                                                            {client.user.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {client.type_of_client ? (
                                                    <Badge variant="outline" className="whitespace-nowrap">
                                                        {client.type_of_client}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-neutral-400">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {client.wilayah ? (
                                                    <div className="text-sm">
                                                        <p className="font-medium">
                                                            {
                                                                client.wilayah
                                                                    .kabupaten
                                                            }
                                                        </p>
                                                        <p className="text-xs text-neutral-500">
                                                            {
                                                                client.wilayah
                                                                    .provinsi
                                                            }
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-neutral-400">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {client.kontak_person}
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                {client.telp}
                                            </TableCell>
                                            <TableCell>
                                                <p className="max-w-xs truncate text-xs text-neutral-500">
                                                    {client.alamat}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(client)
                                                        }
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(client)
                                                        }
                                                        className="text-red-600 hover:text-red-700 dark:text-red-400"
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

                {/* Pagination Info */}
                {clients.data.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-neutral-500">
                        <p>
                            Showing{' '}
                            {(clients.current_page - 1) * clients.per_page + 1}{' '}
                            -{' '}
                            {Math.min(
                                clients.current_page * clients.per_page,
                                clients.total,
                            )}{' '}
                            of {clients.total} entries
                        </p>
                        <p>
                            Page {clients.current_page} of {clients.last_page}
                        </p>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <ClientDialog
                open={isClientDialogOpen}
                onOpenChange={handleDialogClose}
                client={selectedClient}
                wilayahList={wilayahList}
            />
            <DeleteClientDialog
                open={isDeleteDialogOpen}
                onOpenChange={handleDeleteDialogClose}
                client={selectedClient}
            />
        </AppLayout>
    );
}
