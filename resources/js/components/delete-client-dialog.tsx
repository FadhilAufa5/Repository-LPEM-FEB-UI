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
import { useState } from 'react';
import { toast } from 'sonner';

interface Client {
    id: number;
    kode_klien: string;
    nama_klien: string;
    alamat: string;
    kode_kabupaten: string;
    kontak_person: string;
    telp: string;
}

interface DeleteClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client?: Client;
}

export function DeleteClientDialog({
    open,
    onOpenChange,
    client,
}: DeleteClientDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!client) return;

        setIsDeleting(true);

        router.delete(`/clients/${client.id}`, {
            onSuccess: () => {
                toast.success('Client deleted successfully!');
                onOpenChange(false);
                setIsDeleting(false);
            },
            onError: (errors: any) => {
                setIsDeleting(false);
                
                // Handle specific error messages
                if (errors.message) {
                    toast.error(errors.message);
                } else if (typeof errors === 'string') {
                    toast.error(errors);
                } else {
                    toast.error('Failed to delete client. Please check your permissions.');
                }
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Client</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this client? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {client && (
                    <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                        <div>
                            <span className="text-sm font-medium">Kode:</span>{' '}
                            {client.kode_klien}
                        </div>
                        <div>
                            <span className="text-sm font-medium">
                                Nama Client:
                            </span>{' '}
                            {client.nama_klien}
                        </div>
                        <div>
                            <span className="text-sm font-medium">
                                Kontak Person:
                            </span>{' '}
                            {client.kontak_person}
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
