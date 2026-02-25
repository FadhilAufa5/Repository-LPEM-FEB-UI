import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Download, Edit2, FileText, Trash2 } from 'lucide-react';
import { type Asset } from '@/services/assetService';

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

interface AssetsTableProps {
    assets: Asset[];
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
    onDownload: (assetId: number) => void;
    onDownloadProposal: (assetId: number) => void;
}

export function AssetsTable({
    assets,
    onEdit,
    onDelete,
    onDownload,
    onDownloadProposal,
}: AssetsTableProps) {
    return (
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
                        <TableHead>Report</TableHead>
                        <TableHead>Proposal</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center">
                                <div className="flex flex-col items-center gap-2 text-neutral-500">
                                    <FileText className="size-8" />
                                    <p className="text-sm">
                                        No asset data available
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        assets.map((asset) => (
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
                                            {asset.abstrak?.substring(0, 80) ?? ''}...
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs">
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
                                    {asset.grup_kajian ? (
                                        <Badge variant="secondary">
                                            {
                                                grupKajianOptions[
                                                    asset.grup_kajian as keyof typeof grupKajianOptions
                                                ] ?? asset.grup_kajian
                                            }
                                        </Badge>
                                    ) : (
                                        <span className="text-xs text-neutral-400">-</span>
                                    )}
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
                                            onClick={() => onDownload(asset.id)}
                                            title="Download Report"
                                        >
                                            <Download className="size-4" />
                                        </Button>
                                    ) : (
                                        <span className="text-xs text-neutral-400">
                                            -
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {asset.proposal_name ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDownloadProposal(asset.id)}
                                            title="Download Proposal"
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
                                            onClick={() => onEdit(asset)}
                                        >
                                            <Edit2 className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(asset)}
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
    );
}
