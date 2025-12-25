<?php

namespace App\Services;

use App\Models\Asset;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getDashboardData($user): array
    {
        $baseQuery = $this->getBaseQuery($user);

        return [
            'stats' => $this->getStatistics($baseQuery),
            'charts' => $this->getChartData($baseQuery),
            'recentRepositories' => $this->getRecentRepositories($baseQuery),
        ];
    }

    private function getBaseQuery($user)
    {
        $query = Asset::query();
        
        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }

        return $query;
    }

    private function getStatistics($baseQuery): array
    {
        $currentYear = date('Y');

        return [
            'totalRepositories' => (clone $baseQuery)->count(),
            'totalThisYear' => (clone $baseQuery)->where('tahun', $currentYear)->count(),
            'totalLastYear' => (clone $baseQuery)->where('tahun', $currentYear - 1)->count(),
            'uniqueAuthors' => (clone $baseQuery)->distinct('kepala_proyek')->count('kepala_proyek'),
        ];
    }

    private function getChartData($baseQuery): array
    {
        return [
            'byYear' => $this->getRepositoriesByYear($baseQuery),
            'byType' => $this->getRepositoriesByType($baseQuery),
            'byGroup' => $this->getRepositoriesByGroup($baseQuery),
        ];
    }

    private function getRepositoriesByYear($baseQuery)
    {
        $currentYear = date('Y');

        return (clone $baseQuery)
            ->select('tahun', DB::raw('count(*) as total'))
            ->where('tahun', '>=', $currentYear - 4)
            ->groupBy('tahun')
            ->orderBy('tahun', 'asc')
            ->get()
            ->map(fn($item) => [
                'year' => (string) $item->tahun,
                'total' => $item->total,
            ]);
    }

    private function getRepositoriesByType($baseQuery)
    {
        return (clone $baseQuery)
            ->select('jenis_laporan', DB::raw('count(*) as total'))
            ->groupBy('jenis_laporan')
            ->get()
            ->map(fn($item) => [
                'type' => Asset::getJenisLaporanOptions()[$item->jenis_laporan] ?? $item->jenis_laporan,
                'total' => $item->total,
            ]);
    }

    private function getRepositoriesByGroup($baseQuery)
    {
        return (clone $baseQuery)
            ->select('grup_kajian', DB::raw('count(*) as total'))
            ->groupBy('grup_kajian')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $label = Asset::getGrupKajianOptions()[$item->grup_kajian] ?? $item->grup_kajian;
                $shortLabel = strlen($label) > 30 ? substr($label, 0, 27) . '...' : $label;
                
                return [
                    'group' => $shortLabel,
                    'total' => $item->total,
                ];
            });
    }

    private function getRecentRepositories($baseQuery)
    {
        return (clone $baseQuery)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($asset) => [
                'id' => $asset->id,
                'title' => $asset->judul_laporan,
                'author' => $asset->kepala_proyek,
                'year' => $asset->tahun,
                'type' => $asset->jenis_laporan_label,
            ]);
    }
}
