import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Asset {
    id: number;
    kode: string;
    judul_laporan: string;
}

interface DeleteAssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset?: Asset;
}

export function DeleteAssetDialog({
    open,
    onOpenChange,
    asset,
}: DeleteAssetDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!asset) return;

        setIsDeleting(true);
        router.delete(`/assets/${asset.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Asset deleted successfully!', {
                    description: `Asset "${asset.judul_laporan}" has been permanently deleted.`,
                });
                onOpenChange(false);
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ');
                toast.error('Failed to delete asset', {
                    description: errorMessage || 'An error occurred while deleting the asset.',
                });
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle>Hapus Asset</DialogTitle>
                            <DialogDescription>
                                Tindakan ini tidak dapat dibatalkan
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Apakah Anda yakin ingin menghapus asset{' '}
                        <span className="font-semibold">{asset?.kode}</span> -{' '}
                        <span className="font-semibold">
                            {asset?.judul_laporan}
                        </span>
                        ?
                    </p>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Data asset dan file yang terkait akan dihapus secara
                        permanen.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
