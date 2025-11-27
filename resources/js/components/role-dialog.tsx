import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface Role {
   id: number;
    name: string;
    slug: string;
    description?: string;
    permissions?: Permission[];
}

interface RoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: Role;
    allPermissions: Record<string, Permission[]>;
}

export function RoleDialog({ open, onOpenChange, role, allPermissions }: RoleDialogProps) {
    const isEditing = !!role;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        slug: '',
        description: '',
        permissions: [] as number[],
    });

    useEffect(() => {
        if (role) {
            setData({
                name: role.name,
                slug: role.slug,
                description: role.description || '',
                permissions: role.permissions?.map((p) => p.id) || [],
            });
        } else {
            reset();
        }
    }, [role, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/roles/${role.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post('/roles', {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    const handlePermissionToggle = (permissionId: number) => {
        const newPermissions = data.permissions.includes(permissionId)
            ? data.permissions.filter((id) => id !== permissionId)
            : [...data.permissions, permissionId];
        setData('permissions', newPermissions);
    };

    const handleModuleToggle = (modulePermissions: Permission[]) => {
        const moduleIds = modulePermissions.map((p) => p.id);
        const allSelected = moduleIds.every((id) => data.permissions.includes(id));

        if (allSelected) {
            setData('permissions', data.permissions.filter((id) => !moduleIds.includes(id)));
        } else {
            const newPermissions = [...new Set([...data.permissions, ...moduleIds])];
            setData('permissions', newPermissions);
        }
    };

    const autoGenerateSlug = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Role' : 'Tambah Role Baru'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Perbarui informasi role di bawah ini.'
                            : 'Lengkapi form di bawah untuk menambahkan role baru.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Nama Role <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => {
                                    setData('name', e.target.value);
                                    if (!isEditing) {
                                        setData('slug', autoGenerateSlug(e.target.value));
                                    }
                                }}
                                placeholder="e.g., Manager"
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
                                placeholder="e.g., manager"
                                className={errors.slug ? 'border-red-500' : ''}
                            />
                            {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                            <p className="text-xs text-neutral-500">
                                Format: huruf kecil, angka, dan tanda hubung. Contoh: manager, super-admin
                            </p>
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Deskripsi role..."
                                rows={3}
                                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${errors.description ? 'border-red-500' : ''}`}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Permissions */}
                        <div className="grid gap-2">
                            <Label>Permissions</Label>
                            <div className="rounded-md border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                                <div className="space-y-4">
                                    {Object.entries(allPermissions).map(([module, permissions]) => {
                                        const moduleIds = permissions.map((p) => p.id);
                                        const allSelected = moduleIds.every((id) => data.permissions.includes(id));
                                        const someSelected = moduleIds.some((id) => data.permissions.includes(id));

                                        return (
                                            <div key={module} className="space-y-2">
                                                <div className="flex items-center gap-2 border-b py-2">
                                                    <Checkbox
                                                        id={`module-${module}`}
                                                        checked={allSelected}
                                                        onCheckedChange={() => handleModuleToggle(permissions)}
                                                        className={someSelected && !allSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                                                    />
                                                    <Label
                                                        htmlFor={`module-${module}`}
                                                        className="cursor-pointer text-sm font-semibold capitalize"
                                                    >
                                                        {module}
                                                    </Label>
                                                </div>
                                                <div className="grid gap-2 pl-6 sm:grid-cols-2">
                                                    {permissions.map((permission) => (
                                                        <div key={permission.id} className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={`permission-${permission.id}`}
                                                                checked={data.permissions.includes(permission.id)}
                                                                onCheckedChange={() =>
                                                                    handlePermissionToggle(permission.id)
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor={`permission-${permission.id}`}
                                                                className="cursor-pointer text-sm font-normal"
                                                            >
                                                                {permission.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {errors.permissions && <p className="text-sm text-red-500">{errors.permissions}</p>}
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
