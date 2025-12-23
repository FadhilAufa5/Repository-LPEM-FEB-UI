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

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
    roles_count: number;
}

interface DeletePermissionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    permission?: Permission;
}

export function DeletePermissionDialog({
    open,
    onOpenChange,
    permission,
}: DeletePermissionDialogProps) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!permission) return;

        setProcessing(true);
        router.delete(`/permissions/${permission.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                onOpenChange(false);
            },
        });
    };

    if (!permission) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle>Hapus Permission</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Apakah Anda yakin ingin menghapus permission berikut?
                    </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                Nama Permission
                            </p>
                            <p className="font-medium">{permission.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                Slug
                            </p>
                            <p className="font-mono text-sm">
                                {permission.slug}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                    Module
                                </p>
                                <p className="capitalize">
                                    {permission.module}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                    Roles
                                </p>
                                <p className="font-medium">
                                    {permission.roles_count}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {permission.roles_count > 0 && (
                    <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950/30">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            <strong>Perhatian:</strong> Permission ini masih
                            digunakan oleh {permission.roles_count} role. Hapus
                            permission akan menghapus assignment dari semua
                            role.
                        </p>
                    </div>
                )}
                <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
                    <p className="text-sm text-red-800 dark:text-red-300">
                        <strong>Peringatan:</strong> Tindakan ini tidak dapat
                        dibatalkan. Permission akan dihapus secara permanen.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {processing ? 'Menghapus...' : 'Hapus Permission'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
