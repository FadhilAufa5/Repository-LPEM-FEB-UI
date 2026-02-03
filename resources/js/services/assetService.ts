import { toast } from 'sonner';
import { router } from '@inertiajs/react';

export interface AssetFormData {
    client_id: number | null;
    kode: string;
    judul_laporan: string;
    abstrak: string;
    jenis_laporan: string;
    grup_kajian: string;
    kepala_proyek: string;
    staf: string[];
    tahun: number;
    file_laporan: File | null;
    file_proposal: File | null;
}

export interface Asset extends AssetFormData {
    id: number;
}

export const assetService = {
    /**
     * Parse staf field to ensure it's always an array
     */
    parseStafArray(staf: string[] | string | undefined): string[] {
        if (!staf) return [''];
        
        if (Array.isArray(staf)) {
            return staf.length > 0 ? staf : [''];
        }
        
        if (typeof staf === 'string') {
            try {
                const parsed = JSON.parse(staf);
                return Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
            } catch {
                return [''];
            }
        }
        
        return [''];
    },

    /**
     * Initialize form data from existing asset
     */
    initializeFormData(asset: Asset): AssetFormData {
        return {
            client_id: asset.client_id || null,
            kode: asset.kode,
            judul_laporan: asset.judul_laporan,
            abstrak: asset.abstrak,
            jenis_laporan: asset.jenis_laporan,
            grup_kajian: asset.grup_kajian,
            kepala_proyek: asset.kepala_proyek,
            staf: this.parseStafArray(asset.staf),
            tahun: asset.tahun,
            file_laporan: null,
            file_proposal: null,
        };
    },

    /**
     * Get default form data for new asset
     */
    getDefaultFormData(): AssetFormData {
        return {
            client_id: null,
            kode: '',
            judul_laporan: '',
            abstrak: '',
            jenis_laporan: '',
            grup_kajian: '',
            kepala_proyek: '',
            staf: [''],
            tahun: new Date().getFullYear(),
            file_laporan: null,
            file_proposal: null,
        };
    },

    /**
     * Check if research group should be shown based on report type
     */
    shouldShowResearchGroup(jenisLaporan: string): boolean {
        return jenisLaporan === 'penelitian' || jenisLaporan === 'penelitian_survey';
    },

    /**
     * Build FormData for submission
     */
    buildFormData(data: AssetFormData, isEditing: boolean, assetId?: number): FormData {
        const formData = new FormData();
        const filteredStaf = data.staf.filter((s) => s.trim() !== '');

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

        filteredStaf.forEach((s, index) => {
            formData.append(`staf[${index}]`, s);
        });

        if (data.file_laporan) {
            formData.append('file_laporan', data.file_laporan);
        }
        if (data.file_proposal) {
            formData.append('file_proposal', data.file_proposal);
        }

        if (isEditing && assetId) {
            formData.append('_method', 'PUT');
        }

        return formData;
    },

    /**
     * Get upload toast configuration
     */
    getUploadToastConfig(data: AssetFormData): { toastId: string | number | undefined; uploadNames: string[] } {
        const uploadNames: string[] = [];
        
        if (data.file_laporan) {
            uploadNames.push(data.file_laporan.name);
        }
        if (data.file_proposal) {
            uploadNames.push(data.file_proposal.name);
        }

        let toastId: string | number | undefined;
        if (uploadNames.length > 0) {
            toastId = toast.loading('Uploading file(s)...', {
                description: `Uploading ${uploadNames.join(', ')}. Please wait...`,
            });
        }

        return { toastId, uploadNames };
    },

    /**
     * Submit asset form
     */
    submitAsset(
        data: AssetFormData,
        isEditing: boolean,
        assetId: number | undefined,
        onSuccess: () => void,
        onFinally: () => void,
    ) {
        const formData = this.buildFormData(data, isEditing, assetId);
        const { toastId } = this.getUploadToastConfig(data);

        const url = isEditing && assetId ? `/assets/${assetId}` : '/assets';
        const method = isEditing ? 'post' : 'post';

        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => {
                if (toastId) {
                    toast.dismiss(toastId);
                }
                const action = isEditing ? 'updated' : 'added';
                toast.success(`Asset ${action} successfully!`, {
                    description: `Asset "${data.judul_laporan}" has been ${action}.`,
                });
                onSuccess();
            },
            onError: (errors) => {
                if (toastId) {
                    toast.dismiss(toastId);
                }
                const errorMessages = Object.values(errors).flat();
                const errorMessage = errorMessages.join(', ');
                const actionText = isEditing ? 'update' : 'create';
                toast.error(`Failed to ${actionText} asset`, {
                    description: errorMessage || 'Please check your input and try again.',
                });
            },
            onFinish: () => {
                onFinally();
            },
        });
    },
};
