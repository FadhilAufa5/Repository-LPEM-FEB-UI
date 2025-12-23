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
import { Download, Edit2, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
    file_laporan?: string;
    created_at: string;
}

interface AssetsPageProps {
    assets: {
        data: Asset[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
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
    const { assets, filters } = usePage<AssetsPageProps>().props;
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

    const handleDownload = (filePath: string) => {
        window.open(`/storage/${filePath}`, '_blank');
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
                            Kelola laporan dan asset repository LPEM FEB UI
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="w-full sm:w-auto">
                        <Plus className="mr-2 size-4" />
                        Tambah Asset
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                        <Input
                            placeholder="Cari berdasarkan kode, judul, abstrak, atau kepala proyek..."
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
                            <SelectItem value="all">Semua Jenis</SelectItem>
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
                            <SelectItem value="all">Semua Tahun</SelectItem>
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
                                <TableHead>Kode</TableHead>
                                <TableHead>Judul Laporan</TableHead>
                                <TableHead>Jenis</TableHead>
                                <TableHead>Kepala Proyek</TableHead>
                                <TableHead>Grup Kajian</TableHead>
                                <TableHead>Tahun</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-neutral-500">
                                            <FileText className="size-8" />
                                            <p className="text-sm">
                                                Tidak ada data asset
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
                                            {asset.kepala_proyek}
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
                                            {asset.file_laporan ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDownload(
                                                            asset.file_laporan!,
                                                        )
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

                {/* Pagination Info */}
                {assets.data.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-neutral-500">
                        <p>
                            Menampilkan{' '}
                            {(assets.current_page - 1) * assets.per_page + 1} -{' '}
                            {Math.min(
                                assets.current_page * assets.per_page,
                                assets.total,
                            )}{' '}
                            dari {assets.total} data
                        </p>
                        <p>
                            Halaman {assets.current_page} dari{' '}
                            {assets.last_page}
                        </p>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <AssetDialog
                open={assetDialogOpen}
                onOpenChange={setAssetDialogOpen}
                asset={selectedAsset}
            />
            <DeleteAssetDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                asset={selectedAsset}
            />
        </AppLayout>
    );
}
