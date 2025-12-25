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

interface Role {
    id: number;
    name: string;
    slug: string;
    permissions_count: number;
    users_count: number;
}

interface DeleteRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: Role;
}

export function DeleteRoleDialog({
    open,
    onOpenChange,
    role,
}: DeleteRoleDialogProps) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!role) return;

        setProcessing(true);
        router.delete(`/roles/${role.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                onOpenChange(false);
            },
        });
    };

    if (!role) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle>Hapus Role</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Apakah Anda yakin ingin menghapus role berikut?
                    </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                Nama Role
                            </p>
                            <p className="font-medium">{role.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                Slug
                            </p>
                            <p className="font-mono text-sm">{role.slug}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                    Permissions
                                </p>
                                <p className="font-medium">
                                    {role.permissions_count}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                    Users
                                </p>
                                <p className="font-medium">
                                    {role.users_count}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {role.users_count > 0 && (
                    <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950/30">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            <strong>Perhatian:</strong> Role ini masih digunakan
                            oleh {role.users_count} user. Hapus role akan
                            menghapus assignment dari semua user.
                        </p>
                    </div>
                )}
                <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
                    <p className="text-sm text-red-800 dark:text-red-300">
                        <strong>Peringatan:</strong> Tindakan ini tidak dapat
                        dibatalkan. Role akan dihapus secara permanen.
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
                        {processing ? 'Menghapus...' : 'Hapus Role'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
