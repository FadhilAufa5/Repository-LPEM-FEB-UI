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
            'file_url' => $asset->file_laporan ? asset('storage/' . $asset->file_laporan) : null,
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
            'file_url' => $asset->file_laporan ? asset('storage/' . $asset->file_laporan) : null,
            'created_at' => $asset->created_at->format('d M Y'),
        ];
    }

    private function applyTitleFilter(Builder $query, ?string $title): void
    {
        if ($title) {
            $query->where('judul_laporan', 'like', "%{$title}%");
        }
    }

    private function applyAuthorFilter(Builder $query, ?string $author): void
    {
        if ($author) {
            $query->where('kepala_proyek', 'like', "%{$author}%");
        }
    }

    private function applyAbstractFilter(Builder $query, ?string $abstract): void
    {
        if ($abstract) {
            $query->where('abstrak', 'like', "%{$abstract}%");
        }
    }

    private function applyYearFilter(Builder $query, ?string $year): void
    {
        if ($year) {
            $query->where('tahun', $year);
        }
    }

    private function applyDefaultSorting(Builder $query): void
    {
        $query->orderBy('tahun', 'desc')->orderBy('created_at', 'desc');
    }
}
