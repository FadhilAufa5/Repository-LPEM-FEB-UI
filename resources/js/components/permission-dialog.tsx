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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
    description?: string;
}

interface PermissionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    permission?: Permission;
    modules: string[];
}

export function PermissionDialog({ open, onOpenChange, permission, modules }: PermissionDialogProps) {
    const isEditing = !!permission;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        slug: '',
        module: '',
        description: '',
    });

    useEffect(() => {
        if (permission) {
            setData({
                name: permission.name,
                slug: permission.slug,
                module: permission.module,
                description: permission.description || '',
            });
        } else {
            reset();
        }
    }, [permission, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/permissions/${permission.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post('/permissions', {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    const autoGenerateSlug = (name: string, module: string) => {
        const slugName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return module ? `${module}.${slugName}` : slugName;
    };

    const handleNameChange = (name: string) => {
        setData('name', name);
        if (!isEditing && data.module) {
            setData('slug', autoGenerateSlug(name, data.module));
        }
    };

    const handleModuleChange = (module: string) => {
        setData('module', module);
        if (!isEditing && data.name) {
            setData('slug', autoGenerateSlug(data.name, module));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Permission' : 'Tambah Permission Baru'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Perbarui informasi permission di bawah ini.'
                            : 'Lengkapi form di bawah untuk menambahkan permission baru.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Module */}
                        <div className="grid gap-2">
                            <Label htmlFor="module">
                                Module <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.module} onValueChange={handleModuleChange}>
                                <SelectTrigger className={errors.module ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih module atau ketik baru" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modules.map((module) => (
                                        <SelectItem key={module} value={module} className="capitalize">
                                            {module}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Atau ketik nama module baru..."
                                value={data.module}
                                onChange={(e) => handleModuleChange(e.target.value)}
                                className={errors.module ? 'border-red-500' : ''}
                            />
                            {errors.module && <p className="text-sm text-red-500">{errors.module}</p>}
                        </div>

                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Nama Permission <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g., Create Users"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Slug */}
                        <div className="grid gap-2">
                            <Label htmlFor="slug">
                                Slug <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="e.g., users.create"
                                className={errors.slug ? 'border-red-500' : ''}
                            />
                            {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                            <p className="text-xs text-neutral-500">
                                Format: module.action (huruf kecil, angka, dan titik). Contoh: users.create, posts.delete
                            </p>
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Deskripsi permission..."
                                rows={3}
                                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${errors.description ? 'border-red-500' : ''}`}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
