import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Client {
    id: number;
    kode_klien: string;
    nama_klien: string;
    alamat: string;
    kode_kabupaten: string;
    kontak_person: string;
    telp: string;
    wilayah?: {
        kode_kabupaten: string;
        kabupaten: string;
        provinsi: string;
    };
}

interface WilayahOption {
    value: string;
    label: string;
    provinsi: string;
    kabupaten: string;
}

interface ClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client?: Client;
    wilayahList: WilayahOption[];
}

export function ClientDialog({
    open,
    onOpenChange,
    client,
    wilayahList,
}: ClientDialogProps) {
    const isEditing = !!client;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchWilayah, setSearchWilayah] = useState('');

    const { data, setData, errors, reset } = useForm({
        kode_klien: '',
        nama_klien: '',
        alamat: '',
        kode_kabupaten: '',
        kontak_person: '',
        telp: '',
    });

    useEffect(() => {
        if (open) {
            if (client) {
                setData({
                    kode_klien: client.kode_klien,
                    nama_klien: client.nama_klien,
                    alamat: client.alamat,
                    kode_kabupaten: client.kode_kabupaten,
                    kontak_person: client.kontak_person,
                    telp: client.telp,
                });
            } else {
                reset();
            }
            setSearchWilayah('');
        }
    }, [client, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi client-side
        if (!data.kode_klien || !data.nama_klien || !data.alamat || 
            !data.kode_kabupaten || !data.kontak_person || !data.telp) {
            return;
        }

        setIsSubmitting(true);

        const options = {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                setSearchWilayah('');
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        };

        if (isEditing) {
            router.put(`/clients/${client.id}`, data, options);
        } else {
            router.post('/clients', data, options);
        }
    };

    const filteredWilayah = wilayahList.filter((wilayah) =>
        wilayah.label.toLowerCase().includes(searchWilayah.toLowerCase()),
    );

    // Get selected wilayah info
    const selectedWilayah = wilayahList.find(
        (w) => w.value === data.kode_kabupaten,
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Client' : 'Tambah Client Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Ubah informasi client yang sudah ada'
                            : 'Masukkan informasi client baru yang akan ditambahkan'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4">
                        {/* Kode Klien */}
                        <div className="grid gap-2">
                            <Label htmlFor="kode_klien">
                                Kode Klien{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="kode_klien"
                                value={data.kode_klien}
                                onChange={(e) =>
                                    setData('kode_klien', e.target.value)
                                }
                                placeholder="Contoh: KLN-001"
                                autoFocus
                                required
                                disabled={isSubmitting}
                            />
                            {errors.kode_klien && (
                                <p className="text-sm text-red-500">
                                    {errors.kode_klien}
                                </p>
                            )}
                        </div>

                        {/* Nama Klien */}
                        <div className="grid gap-2">
                            <Label htmlFor="nama_klien">
                                Nama Klien{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nama_klien"
                                value={data.nama_klien}
                                onChange={(e) =>
                                    setData('nama_klien', e.target.value)
                                }
                                placeholder="Nama lengkap client"
                                required
                                disabled={isSubmitting}
                            />
                            {errors.nama_klien && (
                                <p className="text-sm text-red-500">
                                    {errors.nama_klien}
                                </p>
                            )}
                        </div>

                        {/* Alamat */}
                        <div className="grid gap-2">
                            <Label htmlFor="alamat">
                                Alamat <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="alamat"
                                value={data.alamat}
                                onChange={(e) =>
                                    setData('alamat', e.target.value)
                                }
                                placeholder="Alamat lengkap client"
                                rows={3}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.alamat && (
                                <p className="text-sm text-red-500">
                                    {errors.alamat}
                                </p>
                            )}
                        </div>

                        {/* Kode Kabupaten (Auto-filled, Read-only) */}
                        <div className="grid gap-2">
                            <Label htmlFor="kode_kabupaten_display">
                                Kode Kabupaten
                            </Label>
                            <Input
                                id="kode_kabupaten_display"
                                value={data.kode_kabupaten || ''}
                                placeholder="Pilih wilayah terlebih dahulu"
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                Kode akan otomatis terisi saat memilih wilayah
                            </p>
                        </div>

                        {/* Wilayah/Kabupaten */}
                        <div className="grid gap-2">
                            <Label htmlFor="kode_kabupaten">
                                Wilayah/Kabupaten{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.kode_kabupaten}
                                onValueChange={(value) =>
                                    setData('kode_kabupaten', value)
                                }
                                required
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih wilayah/kabupaten" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    <div className="sticky top-0 z-10 bg-background p-2">
                                        <Input
                                            placeholder="Cari wilayah..."
                                            value={searchWilayah}
                                            onChange={(e) =>
                                                setSearchWilayah(e.target.value)
                                            }
                                            className="h-8"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    {filteredWilayah.length > 0 ? (
                                        filteredWilayah.map((wilayah) => (
                                            <SelectItem
                                                key={wilayah.value}
                                                value={wilayah.value}
                                            >
                                                {wilayah.label}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            Tidak ada wilayah yang sesuai
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                            {selectedWilayah && (
                                <p className="text-xs text-muted-foreground">
                                    Kode: <span className="font-mono font-medium">{selectedWilayah.value}</span> - {selectedWilayah.kabupaten}, {selectedWilayah.provinsi}
                                </p>
                            )}
                            {errors.kode_kabupaten && (
                                <p className="text-sm text-red-500">
                                    {errors.kode_kabupaten}
                                </p>
                            )}
                        </div>

                        {/* Kontak Person */}
                        <div className="grid gap-2">
                            <Label htmlFor="kontak_person">
                                Kontak Person{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="kontak_person"
                                value={data.kontak_person}
                                onChange={(e) =>
                                    setData('kontak_person', e.target.value)
                                }
                                placeholder="Nama kontak person"
                                required
                                disabled={isSubmitting}
                            />
                            {errors.kontak_person && (
                                <p className="text-sm text-red-500">
                                    {errors.kontak_person}
                                </p>
                            )}
                        </div>

                        {/* Telepon */}
                        <div className="grid gap-2">
                            <Label htmlFor="telp">
                                Telepon <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="telp"
                                type="tel"
                                value={data.telp}
                                onChange={(e) =>
                                    setData('telp', e.target.value)
                                }
                                placeholder="Contoh: 0812-3456-7890"
                                required
                                disabled={isSubmitting}
                            />
                            {errors.telp && (
                                <p className="text-sm text-red-500">
                                    {errors.telp}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="mr-2">Menyimpan...</span>
                                </>
                            ) : isEditing ? (
                                'Update Client'
                            ) : (
                                'Simpan Client'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
