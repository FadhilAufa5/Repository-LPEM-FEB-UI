<?php

namespace App\Http\Controllers;

use App\Services\RepositoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RepositoryController extends Controller
{
    protected $repositoryService;

    public function __construct(RepositoryService $repositoryService)
    {
        $this->repositoryService = $repositoryService;
    }

    public function index(Request $request)
    {
        $filters = [
            'title' => $request->input('title'),
            'author' => $request->input('author'),
            'abstract' => $request->input('abstract'),
            'year' => $request->input('year'),
            'grup_kajian' => $request->input('grup_kajian'),
            'jenis_laporan' => $request->input('jenis_laporan'), // Added for report type filter
        ];

        $perPage = $request->input('per_page', 12);
        $assets = $this->repositoryService->getPublicRepositories($filters, $perPage);

        $repositories = $assets->through(fn($asset) => $this->repositoryService->transformForList($asset));

        // Get counts for each research group
        $grupKajianCounts = $this->repositoryService->getGrupKajianCounts();
        
        // Get counts for each report type
        $reportTypeCounts = $this->repositoryService->getReportTypeCounts();

        return Inertia::render('repository', [
            'repositories' => $repositories,
            'filters' => $filters,
            'grupKajianCounts' => $grupKajianCounts,
            'reportTypeCounts' => $reportTypeCounts, // Added for report type filter
        ]);
    }

    public function show($id)
    {
        $asset = $this->repositoryService->getRepositoryById($id);
        $repository = $this->repositoryService->transformForDetail($asset);

        return Inertia::render('repository-detail', [
            'repository' => $repository,
        ]);
    }

    public function download($id)
    {
        $asset = $this->repositoryService->getRepositoryById($id);

        if (!$asset->file_content || !$asset->file_name) {
            abort(404, 'File not found');
        }

        return response($asset->file_content)
            ->header('Content-Type', $asset->file_mime ?? 'application/octet-stream')
            ->header('Content-Disposition', 'inline; filename="' . $asset->file_name . '"');
    }
}
