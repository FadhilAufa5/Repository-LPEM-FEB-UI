<?php

namespace App\Services;

use App\Models\Asset;
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

        return $query->with('user:id,name,email')->paginate($perPage);
    }

    public function createAsset(array $data, $userId)
    {
        $data['user_id'] = $userId;

        if (isset($data['file_laporan'])) {
            $data['file_laporan'] = $this->handleFileUpload($data['file_laporan']);
        }

        return Asset::create($data);
    }

    public function updateAsset(Asset $asset, array $data)
    {
        if (isset($data['file_laporan'])) {
            $this->deleteFile($asset->file_laporan);
            $data['file_laporan'] = $this->handleFileUpload($data['file_laporan']);
        }

        $asset->update($data);
        return $asset;
    }

    public function deleteAsset(Asset $asset)
    {
        $this->deleteFile($asset->file_laporan);
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
