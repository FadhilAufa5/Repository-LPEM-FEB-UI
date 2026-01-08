<?php

namespace App\Http\Controllers;

use App\Services\RepositoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportSearchController extends Controller
{
    protected $repositoryService;

    public function __construct(RepositoryService $repositoryService)
    {
        $this->repositoryService = $repositoryService;
    }

    public function index(Request $request)
    {
        $jenisLaporan = $request->input('jenis_laporan');
        
        $filters = [
            'jenis_laporan' => $jenisLaporan,
        ];

        // Get repositories if a report type is selected
        if ($jenisLaporan) {
            $perPage = $request->input('per_page', 12);
            $assets = $this->repositoryService->getPublicRepositories($filters, $perPage);
            $repositories = $assets->through(fn($asset) => $this->repositoryService->transformForList($asset));
        } else {
            // Empty paginated result when no type selected
            $repositories = new \Illuminate\Pagination\LengthAwarePaginator(
                [],
                0,
                12,
                1
            );
        }

        // Get counts for each report type
        $jenisLaporanCounts = $this->repositoryService->getJenisLaporanCounts();

        return Inertia::render('report-search', [
            'repositories' => $repositories,
            'filters' => [
                'jenis_laporan' => $jenisLaporan,
            ],
            'jenisLaporanCounts' => $jenisLaporanCounts,
        ]);
    }
}
