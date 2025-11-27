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
import { Textarea } from '@/components/ui/textarea';
import { useForm, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';

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
}

interface AssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset?: Asset;
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
    { value: 'bc_glove', label: 'Business Climate and Global Value Chain (BC-GLOVE)' },
    { value: 'nres', label: 'Natural Resources and Energy Studies (NRES)' },
    { value: 'gec_rg', label: 'Green Economy and Climate - Research Group (GEC-RG)' },
    { value: 'dtbs', label: 'Digital Transformation and Behavioral Studies (DTBS)' },
    { value: 'mfpe', label: 'Macro, Finance, and Political Economy (MFPE)' },
    { value: 'spl', label: 'Social Protection and Labor (SPL)' },
    { value: 'sece', label: 'Social Engineering and Community Empowerment (SECE)' },
    { value: 'devpfin', label: 'Public Finance and Development Planning (DEVPFIN)' },
    { value: 'mpower', label: 'Multidimensional Poverty and Well Being Research Group (MPOWER)' },
    { value: 'trust', label: 'Transport, Real Estate, and Urban Studies (TRUST)' },
];

export function AssetDialog({ open, onOpenChange, asset }: AssetDialogProps) {
    const isEditing = !!asset;
    const [stafList, setStafList] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, errors, reset } = useForm({
        kode: '',
        judul_laporan: '',
        abstrak: '',
        jenis_laporan: 'penelitian',
        grup_kajian: 'bc_glove',
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
                        stafArray = Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
                    } catch {
                        stafArray = [''];
                    }
                }
            }

            setData({
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Filter staf yang tidak kosong
        const filteredStaf = data.staf.filter(s => s.trim() !== '');

        const formData = new FormData();
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

        if (data.file_laporan) {
            formData.append('file_laporan', data.file_laporan);
        }

        if (isEditing) {
            formData.append('_method', 'PUT');
            router.post(`/assets/${asset.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    setStafList(['']);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } else {
            router.post('/assets', formData, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    setStafList(['']);
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
                    <DialogTitle>{isEditing ? 'Edit Asset' : 'Tambah Asset Baru'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Perbarui informasi asset di bawah ini.'
                            : 'Lengkapi form di bawah untuk menambahkan asset baru.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Kode */}
                        <div className="grid gap-2">
                            <Label htmlFor="kode">
                                Kode <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="kode"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                placeholder="LP-2025-001"
                                className={errors.kode ? 'border-red-500' : ''}
                            />
                            {errors.kode && <p className="text-sm text-red-500">{errors.kode}</p>}
                        </div>

                        {/* Judul Laporan */}
                        <div className="grid gap-2">
                            <Label htmlFor="judul_laporan">
                                Judul Laporan <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="judul_laporan"
                                value={data.judul_laporan}
                                onChange={(e) => setData('judul_laporan', e.target.value)}
                                placeholder="Masukkan judul laporan"
                                className={errors.judul_laporan ? 'border-red-500' : ''}
                            />
                            {errors.judul_laporan && <p className="text-sm text-red-500">{errors.judul_laporan}</p>}
                        </div>

                        {/* Abstrak */}
                        <div className="grid gap-2">
                            <Label htmlFor="abstrak">
                                Abstrak <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="abstrak"
                                value={data.abstrak}
                                onChange={(e) => setData('abstrak', e.target.value)}
                                placeholder="Masukkan abstrak laporan"
                                rows={4}
                                className={errors.abstrak ? 'border-red-500' : ''}
                            />
                            {errors.abstrak && <p className="text-sm text-red-500">{errors.abstrak}</p>}
                        </div>

                        {/* Jenis Laporan */}
                        <div className="grid gap-2">
                            <Label htmlFor="jenis_laporan">
                                Jenis Laporan <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.jenis_laporan} onValueChange={(value) => setData('jenis_laporan', value)}>
                                <SelectTrigger className={errors.jenis_laporan ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {jenisLaporanOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.jenis_laporan && <p className="text-sm text-red-500">{errors.jenis_laporan}</p>}
                        </div>

                        {/* Grup Kajian */}
                        <div className="grid gap-2">
                            <Label htmlFor="grup_kajian">
                                Grup Kajian <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.grup_kajian}
                                onValueChange={(value) => setData('grup_kajian', value)}
                            >
                                <SelectTrigger className={errors.grup_kajian ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {grupKajianOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.grup_kajian && <p className="text-sm text-red-500">{errors.grup_kajian}</p>}
                        </div>

                        {/* Kepala Proyek */}
                        <div className="grid gap-2">
                            <Label htmlFor="kepala_proyek">
                                Kepala Proyek <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="kepala_proyek"
                                value={data.kepala_proyek}
                                onChange={(e) => setData('kepala_proyek', e.target.value)}
                                placeholder="Nama kepala proyek"
                                className={errors.kepala_proyek ? 'border-red-500' : ''}
                            />
                            {errors.kepala_proyek && <p className="text-sm text-red-500">{errors.kepala_proyek}</p>}
                        </div>

                        {/* Staf */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>
                                    Staf <span className="text-red-500">*</span>
                                </Label>
                                <Button type="button" variant="outline" size="sm" onClick={addStafField}>
                                    <Plus className="mr-1 size-3" />
                                    Tambah Staf
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {stafList.map((staf, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={staf}
                                            onChange={(e) => handleStafChange(index, e.target.value)}
                                            placeholder={`Nama staf ${index + 1}`}
                                            className={errors.staf ? 'border-red-500' : ''}
                                        />
                                        {stafList.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeStafField(index)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {errors.staf && <p className="text-sm text-red-500">{errors.staf}</p>}
                        </div>

                        {/* Tahun */}
                        <div className="grid gap-2">
                            <Label htmlFor="tahun">
                                Tahun <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.tahun.toString()} onValueChange={(value) => setData('tahun', parseInt(value))}>
                                <SelectTrigger className={errors.tahun ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tahun && <p className="text-sm text-red-500">{errors.tahun}</p>}
                        </div>

                        {/* File Laporan */}
                        <div className="grid gap-2">
                            <Label htmlFor="file_laporan">File Laporan</Label>
                            <Input
                                id="file_laporan"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setData('file_laporan', e.target.files?.[0] || null)}
                                className={errors.file_laporan ? 'border-red-500' : ''}
                            />
                            {errors.file_laporan && <p className="text-sm text-red-500">{errors.file_laporan}</p>}
                            <p className="text-xs text-neutral-500">
                                Format: PDF, DOC, DOCX. Maksimal 10MB. {isEditing && 'Kosongkan jika tidak ingin mengubah file.'}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
