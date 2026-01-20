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
import { ClientCombobox } from '@/components/client-combobox';
import { router, useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    client_id?: number;
}

interface ClientOption {
    value: number;
    label: string;
}

interface AssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset?: Asset;
    clients: ClientOption[];
}

const jenisLaporanOptions = [
    { value: 'penelitian_survey', label: 'Penelitian + Survey' },
    { value: 'penelitian', label: 'Penelitian' },
    { value: 'diklat', label: 'Diklat' },
    { value: 'jurnal', label: 'Jurnal' },
    { value: 'buku', label: 'Buku' },
    { value: 'lainnya', label: 'Lainnya' },
];

const grupKajianOptions = [
    {
        value: 'bc_glove',
        label: 'Business Climate and Global Value Chain (BC-GLOVE)',
    },
    { value: 'nres', label: 'Natural Resources and Energy Studies (NRES)' },
    {
        value: 'gec_rg',
        label: 'Green Economy and Climate - Research Group (GEC-RG)',
    },
    {
        value: 'dtbs',
        label: 'Digital Transformation and Behavioral Studies (DTBS)',
    },
    { value: 'mfpe', label: 'Macro, Finance, and Political Economy (MFPE)' },
    { value: 'spl', label: 'Social Protection and Labor (SPL)' },
    {
        value: 'sece',
        label: 'Social Engineering and Community Empowerment (SECE)',
    },
    {
        value: 'devpfin',
        label: 'Public Finance and Development Planning (DEVPFIN)',
    },
    {
        value: 'mpower',
        label: 'Multidimensional Poverty and Well Being Research Group (MPOWER)',
    },
    {
        value: 'trust',
        label: 'Transport, Real Estate, and Urban Studies (TRUST)',
    },
];

export function AssetDialog({ open, onOpenChange, asset, clients }: AssetDialogProps) {
    const isEditing = !!asset;
    const [stafList, setStafList] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, reset } = useForm({
        client_id: null as number | null,
        kode: '',
        judul_laporan: '',
        abstrak: '',
        jenis_laporan: '',
        grup_kajian: '',
        kepala_proyek: '',
        staf: [''],
        tahun: new Date().getFullYear(),
        file_laporan: null as File | null,
    });

    useEffect(() => {
        if (asset) {
            // Ensure staf is always an array
            let stafArray: string[] = [''];
            if (asset.staf) {
                if (Array.isArray(asset.staf)) {
                    stafArray = asset.staf.length > 0 ? asset.staf : [''];
                } else if (typeof asset.staf === 'string') {
                    try {
                        const parsed = JSON.parse(asset.staf);
                        stafArray =
                            Array.isArray(parsed) && parsed.length > 0
                                ? parsed
                                : [''];
                    } catch {
                        stafArray = [''];
                    }
                }
            }

            setData({
                client_id: asset.client_id || null,
                kode: asset.kode,
                judul_laporan: asset.judul_laporan,
                abstrak: asset.abstrak,
                jenis_laporan: asset.jenis_laporan,
                grup_kajian: asset.grup_kajian,
                kepala_proyek: asset.kepala_proyek,
                staf: stafArray,
                tahun: asset.tahun,
                file_laporan: null,
            });
            setStafList(stafArray);
        } else {
            reset();
            setStafList(['']);
        }
    }, [asset, open]);

    const handleStafChange = (index: number, value: string) => {
        const newStafList = [...stafList];
        newStafList[index] = value;
        setStafList(newStafList);
        setData('staf', newStafList);
    };

    const addStafField = () => {
        const newStafList = [...stafList, ''];
        setStafList(newStafList);
        setData('staf', newStafList);
    };

    const removeStafField = (index: number) => {
        if (stafList.length > 1) {
            const newStafList = stafList.filter((_, i) => i !== index);
            setStafList(newStafList);
            setData('staf', newStafList);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmSubmit = () => {
        setShowConfirm(false);
        setIsSubmitting(true);

        // Filter staf yang tidak kosong
        const filteredStaf = data.staf.filter((s) => s.trim() !== '');

        const formData = new FormData();
        if (data.client_id) {
            formData.append('client_id', data.client_id.toString());
        }
        formData.append('kode', data.kode);
        formData.append('judul_laporan', data.judul_laporan);
        formData.append('abstrak', data.abstrak);
        formData.append('jenis_laporan', data.jenis_laporan);
        formData.append('grup_kajian', data.grup_kajian);
        formData.append('kepala_proyek', data.kepala_proyek);
        formData.append('tahun', data.tahun.toString());

        // Append staf as array
        filteredStaf.forEach((s, index) => {
            formData.append(`staf[${index}]`, s);
        });

        // Show upload progress toast if file is being uploaded
        let uploadToastId: string | number | undefined;
        if (data.file_laporan) {
            formData.append('file_laporan', data.file_laporan);
            uploadToastId = toast.loading('Uploading file...', {
                description: `Uploading ${data.file_laporan.name}. Please wait...`
            });
        }

        if (isEditing) {
            formData.append('_method', 'PUT');
            router.post(`/assets/${asset.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    // Dismiss upload toast if exists
                    if (uploadToastId) {
                        toast.dismiss(uploadToastId);
                    }
                    toast.success('Asset updated successfully!', {
                        description: `Asset "${data.judul_laporan}" has been updated.`
                    });
                    onOpenChange(false);
                    reset();
                    setStafList(['']);
                },
                onError: (errors) => {
                    // Dismiss upload toast if exists
                    if (uploadToastId) {
                        toast.dismiss(uploadToastId);
                    }
                    const errorMessages = Object.values(errors).flat();
                    const errorMessage = errorMessages.join(', ');
                    toast.error('Failed to update asset', {
                        description: errorMessage || 'Please check your input and try again.'
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } else {
            router.post('/assets', formData, {
                preserveScroll: true,
                onSuccess: () => {
                    // Dismiss upload toast if exists
                    if (uploadToastId) {
                        toast.dismiss(uploadToastId);
                    }
                    toast.success('Asset created successfully!', {
                        description: `Asset "${data.judul_laporan}" has been added.`
                    });
                    onOpenChange(false);
                    reset();
                    setStafList(['']);
                },
                onError: (errors) => {
                    // Dismiss upload toast if exists
                    if (uploadToastId) {
                        toast.dismiss(uploadToastId);
                    }
                    const errorMessages = Object.values(errors).flat();
                    const errorMessage = errorMessages.join(', ');
                    toast.error('Failed to create asset', {
                        description: errorMessage || 'Please check your input and try again.'
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        }
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
                <DialogHeader>
                        <DialogTitle>
                        {isEditing ? 'Edit Asset' : 'Add New Asset'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the asset information below.'
                            : 'Fill out the form below to add a new asset.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Kode */}
                        <div className="grid gap-2">
                            <Label htmlFor="kode">
                                Code <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="kode"
                                value={data.kode}
                                onChange={(e) =>
                                    setData('kode', e.target.value)
                                }
                                placeholder="LP-2025-001"
                                className={errors.kode ? 'border-red-500' : ''}
                            />
                            {errors.kode && (
                                <p className="text-sm text-red-500">
                                    {errors.kode}
                                </p>
                            )}
                        </div>

                        {/* Kode Client */}
                        <div className="grid gap-2">
                            <Label htmlFor="client_id">
                                Code Client
                            </Label>
                            <ClientCombobox
                                clients={clients}
                                value={data.client_id}
                                onChange={(value) => setData('client_id', value)}
                                error={errors.client_id}
                            />
                            {errors.client_id && (
                                <p className="text-sm text-red-500">
                                    {errors.client_id}
                                </p>
                            )}
                        </div>

                        {/* Judul Laporan */}
                        <div className="grid gap-2">
                            <Label htmlFor="judul_laporan">
                                Report Title{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="judul_laporan"
                                value={data.judul_laporan}
                                onChange={(e) =>
                                    setData('judul_laporan', e.target.value)
                                }
                                placeholder="Enter report title"
                                className={
                                    errors.judul_laporan ? 'border-red-500' : ''
                                }
                            />
                            {errors.judul_laporan && (
                                <p className="text-sm text-red-500">
                                    {errors.judul_laporan}
                                </p>
                            )}
                        </div>

                        {/* Abstrak */}
                        <div className="grid gap-2">
                            <Label htmlFor="abstrak">
                                Abstract <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="abstrak"
                                value={data.abstrak}
                                onChange={(e) =>
                                    setData('abstrak', e.target.value)
                                }
                                placeholder="Enter report abstract"
                                rows={4}
                                className={
                                    errors.abstrak ? 'border-red-500' : ''
                                }
                            />
                            {errors.abstrak && (
                                <p className="text-sm text-red-500">
                                    {errors.abstrak}
                                </p>
                            )}
                        </div>

                        {/* Jenis Laporan */}
                        <div className="grid gap-2">
                            <Label htmlFor="jenis_laporan">
                                Report Type{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.jenis_laporan}
                                onValueChange={(value) => {
                                    setData('jenis_laporan', value);
                                    // Enable research group selection by clearing it when creating new asset
                                    if (!isEditing) {
                                        setData('grup_kajian', '');
                                    }
                                }}
                            >
                                <SelectTrigger
                                    className={
                                        errors.jenis_laporan
                                            ? 'border-red-500'
                                            : ''
                                    }
                                >
                                    <SelectValue 
                                        placeholder={
                                            isEditing 
                                                ? "Select report type" 
                                                : "Select report type"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {jenisLaporanOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.jenis_laporan && (
                                <p className="text-sm text-red-500">
                                    {errors.jenis_laporan}
                                </p>
                            )}
                        </div>  

                        {/* Grup Kajian */}
                        <div className="grid gap-2">
                            <Label htmlFor="grup_kajian">
                                Research Group{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.grup_kajian}
                                onValueChange={(value) =>
                                    setData('grup_kajian', value)
                                }
                                disabled={!data.jenis_laporan}
                            >
                                <SelectTrigger
                                    className={
                                        errors.grup_kajian
                                            ? 'border-red-500'
                                            : ''
                                    }
                                >
                                    <SelectValue 
                                        placeholder={
                                            !data.jenis_laporan
                                                ? 'Please select Report Type first'
                                                : 'Select research group'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {grupKajianOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {!data.jenis_laporan && (
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                    Please select Report Type before choosing Research Group
                                </p>
                            )}
                            {errors.grup_kajian && (
                                <p className="text-sm text-red-500">
                                    {errors.grup_kajian}
                                </p>
                            )}
                        </div>

                        {/* Kepala Proyek */}
                        <div className="grid gap-2">
                            <Label htmlFor="kepala_proyek">
                                Project Leader{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="kepala_proyek"
                                value={data.kepala_proyek}
                                onChange={(e) =>
                                    setData('kepala_proyek', e.target.value)
                                }
                                placeholder="Project lead name"
                                className={
                                    errors.kepala_proyek ? 'border-red-500' : ''
                                }
                            />
                            {errors.kepala_proyek && (
                                <p className="text-sm text-red-500">
                                    {errors.kepala_proyek}
                                </p>
                            )}
                        </div>

                        {/* Staf */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>
                                    Staf <span className="text-red-500">*</span>
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addStafField}
                                >
                                    <Plus className="mr-1 size-3" />
                                        Add Staff
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {stafList.map((staf, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={staf}
                                            onChange={(e) =>
                                                handleStafChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Staff name ${index + 1}`}
                                            className={
                                                errors.staf
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        {stafList.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    removeStafField(index)
                                                }
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {errors.staf && (
                                <p className="text-sm text-red-500">
                                    {errors.staf}
                                </p>
                            )}
                        </div>

                        {/* Tahun */}
                        <div className="grid gap-2">
                            <Label htmlFor="tahun">
                                Year <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.tahun.toString()}
                                onValueChange={(value) =>
                                    setData('tahun', parseInt(value))
                                }
                            >
                                <SelectTrigger
                                    className={
                                        errors.tahun ? 'border-red-500' : ''
                                    }
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={year.toString()}
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tahun && (
                                <p className="text-sm text-red-500">
                                    {errors.tahun}
                                </p>
                            )}
                        </div>

                        {/* File Laporan */}
                        <div className="grid gap-2">
                            <Label htmlFor="file_laporan">Upload File</Label>
                            <Input
                                id="file_laporan"
                                type="file"
                                accept=".pdf,.doc,.docx,.zip,.rar"
                                onChange={(e) =>
                                    setData(
                                        'file_laporan',
                                        e.target.files?.[0] || null,
                                    )
                                }
                                className={
                                    errors.file_laporan ? 'border-red-500' : ''
                                }
                            />
                            {errors.file_laporan && (
                                <p className="text-sm text-red-500">
                                    {errors.file_laporan}
                                </p>
                            )}
                            <p className="text-xs text-neutral-500">
                                Format: PDF, DOC, DOCX, ZIP, RAR. Maximum 50MB.{' '}
                                {isEditing &&
                                    'Leave empty if you do not want to change the file.'}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Saving...'
                                : isEditing
                                  ? 'Update'
                                  : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm {isEditing ? 'Update' : 'Create'}</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {isEditing ? 'update' : 'create'} this asset?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            <span className="font-semibold">Code:</span> {data.kode}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            <span className="font-semibold">Title:</span> {data.judul_laporan}
                        </p>
                        {data.file_laporan && (
                            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <span className="font-semibold">File:</span> {data.file_laporan.name}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowConfirm(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmSubmit}
                            disabled={isSubmitting}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
}
