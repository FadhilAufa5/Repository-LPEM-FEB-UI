<?php

namespace App\Services;

use App\Models\Asset;
use App\Jobs\ProcessAssetFileUpload;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;

class AssetService
{
    public function getFilteredAssets(array $filters, $user, int $perPage = 10)
    {
        $query = Asset::query();

        $this->applyUserFilter($query, $user);
        $this->applySearchFilter($query, $filters['search'] ?? null);
        $this->applyTypeFilters($query, $filters);
        $this->applySorting($query, $filters['sort_by'] ?? 'created_at', $filters['sort_order'] ?? 'desc');

        return $query->with(['user:id,name,email', 'client:id,kode_klien,nama_klien'])->paginate($perPage);
    }

    public function createAsset(array $data, $userId)
    {
        $data['user_id'] = $userId;

        $file = null;
        $proposalFile = null;
        
        if (isset($data['file_laporan'])) {
            $file = $data['file_laporan'];
            unset($data['file_laporan']); // Remove file from data, will be handled by queue
        }
        
        if (isset($data['file_proposal'])) {
            $proposalFile = $data['file_proposal'];
            unset($data['file_proposal']); // Remove file from data, will be handled by queue
        }

        $asset = Asset::create($data);

        // Dispatch queue job for report file upload if file exists
        if ($file) {
            $this->dispatchFileUpload($asset, $file, 'report');
        }
        
        // Dispatch queue job for proposal file upload if file exists
        if ($proposalFile) {
            $this->dispatchFileUpload($asset, $proposalFile, 'proposal');
        }

        return $asset;
    }

    public function updateAsset(Asset $asset, array $data)
    {
        $file = null;
        $proposalFile = null;
        
        if (isset($data['file_laporan'])) {
            $file = $data['file_laporan'];
            unset($data['file_laporan']); // Remove file from data, will be handled by queue
            
            // Clear old file data if exists
            $data['file_content'] = null;
            $data['file_name'] = null;
            $data['file_mime'] = null;
            $data['file_size'] = null;
        }
        
        if (isset($data['file_proposal'])) {
            $proposalFile = $data['file_proposal'];
            unset($data['file_proposal']); // Remove file from data, will be handled by queue
            
            // Clear old proposal data if exists
            $data['proposal_content'] = null;
            $data['proposal_name'] = null;
            $data['proposal_mime'] = null;
            $data['proposal_size'] = null;
        }

        $asset->update($data);

        // Dispatch queue job for report file upload if file exists
        if ($file) {
            $this->dispatchFileUpload($asset, $file, 'report');
        }
        
        // Dispatch queue job for proposal file upload if file exists
        if ($proposalFile) {
            $this->dispatchFileUpload($asset, $proposalFile, 'proposal');
        }

        return $asset;
    }

    public function deleteAsset(Asset $asset)
    {
        // No need to delete physical file anymore, just delete database record
        return $asset->delete();
    }

    public function checkAssetOwnership(Asset $asset, $user): bool
    {
        return $user->hasRole('admin') || $asset->user_id === $user->id;
    }

    private function applyUserFilter(Builder $query, $user): void
    {
        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }
    }

    private function applySearchFilter(Builder $query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kode', 'like', "%{$search}%")
                    ->orWhere('judul_laporan', 'like', "%{$search}%")
                    ->orWhere('abstrak', 'like', "%{$search}%")
                    ->orWhere('kepala_proyek', 'like', "%{$search}%");
            });
        }
    }

    private function applyTypeFilters(Builder $query, array $filters): void
    {
        if (!empty($filters['jenis_laporan'])) {
            $query->where('jenis_laporan', $filters['jenis_laporan']);
        }

        if (!empty($filters['tahun'])) {
            $query->where('tahun', $filters['tahun']);
        }

        if (!empty($filters['grup_kajian'])) {
            $query->where('grup_kajian', $filters['grup_kajian']);
        }
    }

    private function applySorting(Builder $query, string $sortBy, string $sortOrder): void
    {
        $query->orderBy($sortBy, $sortOrder);
    }

    private function dispatchFileUpload(Asset $asset, $file, string $fileType = 'report'): void
    {
        // Store file temporarily
        $tempFilename = 'temp_' . time() . '_' . $file->getClientOriginalName();
        $tempPath = $file->storeAs('temp', $tempFilename, 'public');

        // Dispatch queue job with file type
        ProcessAssetFileUpload::dispatch(
            $asset->id,
            $tempPath,
            $file->getClientOriginalName(),
            $file->getMimeType(),
            $file->getSize(),
            $fileType
        );
    }

    private function handleFileUpload($file): string
    {
        $filename = time() . '_' . $file->getClientOriginalName();
        return $file->storeAs('assets', $filename, 'public');
    }

    private function deleteFile(?string $filePath): void
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }
}
