<?php

namespace App\Services;

use App\Models\Asset;
use Illuminate\Database\Eloquent\Builder;

class RepositoryService
{
    public function getPublicRepositories(array $filters, int $perPage = 12)
    {
        $query = Asset::query();

        $this->applyTitleFilter($query, $filters['title'] ?? null);
        $this->applyAuthorFilter($query, $filters['author'] ?? null);
        $this->applyAbstractFilter($query, $filters['abstract'] ?? null);
        $this->applyYearFilter($query, $filters['year'] ?? null);
        $this->applyGrupKajianFilter($query, $filters['grup_kajian'] ?? null);
        $this->applyDefaultSorting($query);

        return $query->paginate($perPage);
    }

    public function getRepositoryById($id)
    {
        return Asset::findOrFail($id);
    }

    public function transformForList($asset): array
    {
        return [
            'id' => $asset->id,
            'title' => $asset->judul_laporan,
            'author' => $asset->kepala_proyek,
            'year' => $asset->tahun,
            'abstract' => $asset->abstrak,
            'file_url' => $asset->file_name ? route('repository.download', $asset->id) : null,
            'file_name' => $asset->file_name,
            'jenis_laporan' => $asset->jenis_laporan_label,
            'grup_kajian' => $asset->grup_kajian_label,
        ];
    }

    public function transformForDetail($asset): array
    {
        return [
            'id' => $asset->id,
            'kode' => $asset->kode,
            'title' => $asset->judul_laporan,
            'abstract' => $asset->abstrak,
            'jenis_laporan' => $asset->jenis_laporan_label,
            'grup_kajian' => $asset->grup_kajian_label,
            'author' => $asset->kepala_proyek,
            'staff' => $asset->staf,
            'year' => $asset->tahun,
            'file_url' => $asset->file_name ? route('repository.download', $asset->id) : null,
            'file_name' => $asset->file_name,
            'file_size' => $asset->file_size,
            'created_at' => $asset->created_at->format('d M Y'),
        ];
    }

    private function applyTitleFilter(Builder $query, ?string $title): void
    {
        if ($title) {
            $searchTerms = explode(' ', trim($title));
            $query->where(function ($q) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    if (!empty($term)) {
                        $q->where('judul_laporan', 'like', "%{$term}%");
                    }
                }
            });
        }
    }

    private function applyAuthorFilter(Builder $query, ?string $author): void
    {
        if ($author) {
            $searchTerms = explode(' ', trim($author));
            $query->where(function ($q) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    if (!empty($term)) {
                        $q->where(function ($subQ) use ($term) {
                            $subQ->where('kepala_proyek', 'like', "%{$term}%")
                                 ->orWhere('staf', 'like', "%{$term}%");
                        });
                    }
                }
            });
        }
    }

    private function applyAbstractFilter(Builder $query, ?string $abstract): void
    {
        if ($abstract) {
            $searchTerms = explode(' ', trim($abstract));
            $query->where(function ($q) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    if (!empty($term)) {
                        $q->where(function ($subQ) use ($term) {
                            $subQ->where('abstrak', 'like', "%{$term}%")
                                 ->orWhere('judul_laporan', 'like', "%{$term}%")
                                 ->orWhere('kode', 'like', "%{$term}%");
                        });
                    }
                }
            });
        }
    }

    private function applyYearFilter(Builder $query, ?string $year): void
    {
        if ($year) {
            $query->where('tahun', $year);
        }
    }

    private function applyGrupKajianFilter(Builder $query, ?string $grupKajian): void
    {
        if ($grupKajian) {
            $query->where('grup_kajian', $grupKajian);
        }
    }

    private function applyDefaultSorting(Builder $query): void
    {
        $query->orderBy('tahun', 'desc')->orderBy('created_at', 'desc');
    }

    public function getGrupKajianCounts(): array
    {
        $counts = Asset::query()
            ->selectRaw('grup_kajian, COUNT(*) as count')
            ->groupBy('grup_kajian')
            ->pluck('count', 'grup_kajian')
            ->toArray();

        return $counts;
    }

    public function getJenisLaporanCounts(): array
    {
        $counts = Asset::query()
            ->selectRaw('jenis_laporan, COUNT(*) as count')
            ->groupBy('jenis_laporan')
            ->pluck('count', 'jenis_laporan')
            ->toArray();

        return $counts;
    }
}
