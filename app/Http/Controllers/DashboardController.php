<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Total repositories
        $totalRepositories = Asset::count();

        // Repositories by year (last 5 years)
        $currentYear = date('Y');
        $repositoriesByYear = Asset::select('tahun', DB::raw('count(*) as total'))
            ->where('tahun', '>=', $currentYear - 4)
            ->groupBy('tahun')
            ->orderBy('tahun', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'year' => (string) $item->tahun,
                    'total' => $item->total,
                ];
            });

        // Repositories by type (jenis laporan)
        $repositoriesByType = Asset::select('jenis_laporan', DB::raw('count(*) as total'))
            ->groupBy('jenis_laporan')
            ->get()
            ->map(function ($item) {
                return [
                    'type' => Asset::getJenisLaporanOptions()[$item->jenis_laporan] ?? $item->jenis_laporan,
                    'total' => $item->total,
                ];
            });

        // Repositories by research group (grup kajian)
        $repositoriesByGroup = Asset::select('grup_kajian', DB::raw('count(*) as total'))
            ->groupBy('grup_kajian')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $label = Asset::getGrupKajianOptions()[$item->grup_kajian] ?? $item->grup_kajian;
                // Shorten long names
                $shortLabel = strlen($label) > 30 ? substr($label, 0, 27) . '...' : $label;
                return [
                    'group' => $shortLabel,
                    'total' => $item->total,
                ];
            });

        // Recent repositories
        $recentRepositories = Asset::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($asset) {
                return [
                    'id' => $asset->id,
                    'title' => $asset->judul_laporan,
                    'author' => $asset->kepala_proyek,
                    'year' => $asset->tahun,
                    'type' => $asset->jenis_laporan_label,
                ];
            });

        // Statistics cards
        $totalThisYear = Asset::where('tahun', $currentYear)->count();
        $totalLastYear = Asset::where('tahun', $currentYear - 1)->count();
        $uniqueAuthors = Asset::distinct('kepala_proyek')->count('kepala_proyek');

        return Inertia::render('dashboard', [
            'stats' => [
                'totalRepositories' => $totalRepositories,
                'totalThisYear' => $totalThisYear,
                'totalLastYear' => $totalLastYear,
                'uniqueAuthors' => $uniqueAuthors,
            ],
            'charts' => [
                'byYear' => $repositoriesByYear,
                'byType' => $repositoriesByType,
                'byGroup' => $repositoriesByGroup,
            ],
            'recentRepositories' => $recentRepositories,
        ]);
    }
}
