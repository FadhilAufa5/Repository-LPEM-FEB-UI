import { AssetDialog } from '@/components/asset-dialog';
import { DeleteAssetDialog } from '@/components/delete-asset-dialog';
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
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Download, Edit2, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Asset Management',
        href: '/assets',
    },
];

interface Asset {
    id: number;
    kode: string;
    judul_laporan: string;
    abstrak: string;
    jenis_laporan: string;
    grup_kajian: string;
    kepala_proyek: string;
    staf: string[] | string;
    tahun: number;
    file_name?: string;
    file_size?: number;
    file_mime?: string;
    created_at: string;
    client_id?: number;
    client?: {
        id: number;
        kode_klien: string;
        nama_klien: string;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface ClientOption {
    value: number;
    label: string;
}

interface AssetsPageProps {
    assets: {
        data: Asset[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    clients: ClientOption[];
    filters: {
        search?: string;
        jenis_laporan?: string;
        tahun?: string;
        grup_kajian?: string;
    };
}

const jenisLaporanOptions = {
    penelitian_survey: 'Penelitian + Survey',
    penelitian: 'Penelitian',
    diklat: 'Diklat',
    jurnal: 'Jurnal',
    buku: 'Buku',
    lainnya: 'Lainnya',
};

const grupKajianOptions = {
    bc_glove: 'BC-GLOVE',
    nres: 'NRES',
    gec_rg: 'GEC-RG',
    dtbs: 'DTBS',
    mfpe: 'MFPE',
    spl: 'SPL',
    sece: 'SECE',
    devpfin: 'DEVPFIN',
    mpower: 'MPOWER',
    trust: 'TRUST',
};

export default function Assets() {
    const { assets, clients, filters } = usePage<AssetsPageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [jenisLaporanFilter, setJenisLaporanFilter] = useState(
        filters.jenis_laporan || 'all',
    );
    const [tahunFilter, setTahunFilter] = useState(filters.tahun || 'all');
    const [assetDialogOpen, setAssetDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/assets',
            {
                search: value,
                jenis_laporan:
                    jenisLaporanFilter !== 'all'
                        ? jenisLaporanFilter
                        : undefined,
                tahun: tahunFilter !== 'all' ? tahunFilter : undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleJenisLaporanFilter = (value: string) => {
        setJenisLaporanFilter(value);
        router.get(
            '/assets',
            {
                search,
                jenis_laporan: value !== 'all' ? value : undefined,
                tahun: tahunFilter !== 'all' ? tahunFilter : undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleTahunFilter = (value: string) => {
        setTahunFilter(value);
        router.get(
            '/assets',
            {
                search,
                jenis_laporan:
                    jenisLaporanFilter !== 'all'
                        ? jenisLaporanFilter
                        : undefined,
                tahun: value !== 'all' ? value : undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleEdit = (asset: Asset) => {
        toast.info(`Opening edit form for "${asset.judul_laporan}"`, {
            description: 'You can now modify the asset details.',
            duration: 3000,
        });
        setSelectedAsset(asset);
        setAssetDialogOpen(true);
    };

    const handleDelete = (asset: Asset) => {
        setSelectedAsset(asset);
        setDeleteDialogOpen(true);
    };

    const handleAddNew = () => {
        setSelectedAsset(undefined);
        setAssetDialogOpen(true);
    };

    const handleDownload = (assetId: number) => {
        window.location.href = `/assets/${assetId}/download`;
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/assets',
            {
                search,
                jenis_laporan:
                    jenisLaporanFilter !== 'all'
                        ? jenisLaporanFilter
                        : undefined,
                tahun: tahunFilter !== 'all' ? tahunFilter : undefined,
                page: page.toString(),
            },
            { preserveState: true, preserveScroll: false },
        );
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Asset Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Asset Management
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Manage reports and assets repository LPEM FEB UI
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="w-full sm:w-auto">
                        <Plus className="mr-2 size-4" />
                        Add Asset
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                        <Input
                            placeholder="Search by code, title, abstract, or project leader..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={jenisLaporanFilter}
                        onValueChange={handleJenisLaporanFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Semua Jenis" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {Object.entries(jenisLaporanOptions).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ),
                            )}
                        </SelectContent>
                    </Select>
                    <Select
                        value={tahunFilter}
                        onValueChange={handleTahunFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Semua Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {yearOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
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
                                <TableHead>Code</TableHead>
                                <TableHead>Report Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Client Code</TableHead>
                                <TableHead>Research Group</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-neutral-500">
                                            <FileText className="size-8" />
                                            <p className="text-sm">
                                                No asset data available
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                assets.data.map((asset) => (
                                    <TableRow key={asset.id}>
                                        <TableCell className="font-medium">
                                            {asset.kode}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                <p className="truncate font-medium">
                                                    {asset.judul_laporan}
                                                </p>
                                                <p className="truncate text-xs text-neutral-500">
                                                    {asset.abstrak.substring(
                                                        0,
                                                        80,
                                                    )}
                                                    ...
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {
                                                    jenisLaporanOptions[
                                                        asset.jenis_laporan as keyof typeof jenisLaporanOptions
                                                    ]
                                                }
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {asset.client ? (
                                                <div className="text-sm">
                                                    <p className="font-medium">
                                                        {asset.client.kode_klien}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 truncate max-w-[150px]">
                                                        {asset.client.nama_klien}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-neutral-400">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {
                                                    grupKajianOptions[
                                                        asset.grup_kajian as keyof typeof grupKajianOptions
                                                    ]
                                                }
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{asset.tahun}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p className="font-medium">
                                                    {asset.user?.name || '-'}
                                                </p>
                                                {asset.user?.email && (
                                                    <p className="text-xs text-neutral-500">
                                                        {asset.user.email}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {asset.file_name ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDownload(asset.id)
                                                    }
                                                >
                                                    <Download className="size-4" />
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-neutral-400">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEdit(asset)
                                                    }
                                                >
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(asset)
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

                {/* Pagination */}
                {assets.total > 10 && assets.data.length > 0 && (
                    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            Showing{' '}
                            {(assets.current_page - 1) * assets.per_page + 1} to{' '}
                            {Math.min(
                                assets.current_page * assets.per_page,
                                assets.total,
                            )}{' '}
                            of {assets.total} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(assets.current_page - 1)
                                }
                                disabled={assets.current_page === 1}
                                className="gap-2"
                            >
                                <ChevronLeft className="size-4" />
                                Previous
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: assets.last_page },
                                    (_, i) => i + 1,
                                ).map((page) => {
                                    const showPage =
                                        page === 1 ||
                                        page === assets.last_page ||
                                        (page >= assets.current_page - 1 &&
                                            page <= assets.current_page + 1);

                                    const showEllipsisBefore =
                                        page === assets.current_page - 2 &&
                                        assets.current_page > 3;
                                    const showEllipsisAfter =
                                        page === assets.current_page + 2 &&
                                        assets.current_page <
                                            assets.last_page - 2;

                                    if (
                                        showEllipsisBefore ||
                                        showEllipsisAfter
                                    ) {
                                        return (
                                            <span
                                                key={page}
                                                className="px-2 text-neutral-500 dark:text-neutral-500"
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    if (!showPage) return null;

                                    return (
                                        <Button
                                            key={page}
                                            variant={
                                                page === assets.current_page
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`hidden size-9 sm:inline-flex ${
                                                page === assets.current_page
                                                    ? ''
                                                    : ''
                                            }`}
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(assets.current_page + 1)
                                }
                                disabled={
                                    assets.current_page === assets.last_page
                                }
                                className="gap-2"
                            >
                                Next
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <AssetDialog
                open={assetDialogOpen}
                onOpenChange={setAssetDialogOpen}
                asset={selectedAsset}
                clients={clients}
            />
            <DeleteAssetDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                asset={selectedAsset}
            />
        </AppLayout>
    );
}
