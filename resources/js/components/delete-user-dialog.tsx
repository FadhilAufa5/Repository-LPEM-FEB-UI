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

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
}

export function DeleteUserDialog({
    open,
    onOpenChange,
    user,
}: DeleteUserDialogProps) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!user) return;

        setProcessing(true);
        router.delete(`/users/${user.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                onOpenChange(false);
            },
        });
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle>Hapus User</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Apakah Anda yakin ingin menghapus user berikut?
                    </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                Nama
                            </p>
                            <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                Email
                            </p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                Peran
                            </p>
                            <p className="font-medium capitalize">
                                {user.role}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
                    <p className="text-sm text-red-800 dark:text-red-300">
                        <strong>Warning:</strong> This action cannot be
                        undone. User akan dihapus secara permanen dari
                        sistem.
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
                        {processing ? 'Menghapus...' : 'Hapus User'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
