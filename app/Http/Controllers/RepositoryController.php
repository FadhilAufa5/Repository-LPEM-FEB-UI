<?php

namespace App\Http\Controllers;

use App\Services\RepositoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class RepositoryController extends Controller
{
    protected RepositoryService $repositoryService;

    public function __construct(RepositoryService $repositoryService)
    {
        $this->repositoryService = $repositoryService;
    }

    public function index(Request $request): InertiaResponse
    {
        $filters = [
            'title'        => $request->input('title'),
            'author'       => $request->input('author'),
            'abstract'     => $request->input('abstract'),
            'year'         => $request->input('year'),
            'grup_kajian'  => $request->input('grup_kajian'),
            'jenis_laporan'=> $request->input('jenis_laporan'),
        ];

        $perPage      = $request->integer('per_page', 12);
        $assets       = $this->repositoryService->getPublicRepositories($filters, $perPage);
        $repositories = $assets->through(fn ($asset) => $this->repositoryService->transformForList($asset));

        return Inertia::render('repository', [
            'repositories'    => $repositories,
            'filters'         => $filters,
            'grupKajianCounts'=> $this->repositoryService->getGrupKajianCounts(),
            'reportTypeCounts'=> $this->repositoryService->getReportTypeCounts(),
        ]);
    }

    public function show(int $id): InertiaResponse
    {
        $asset      = $this->repositoryService->getRepositoryById($id);
        $repository = $this->repositoryService->transformForDetail($asset);

        return Inertia::render('repository-detail', [
            'repository' => $repository,
        ]);
    }

    public function download(int $id): Response
    {
        $asset = $this->repositoryService->getRepositoryById($id);

        if (! $asset->file_content || ! $asset->file_name) {
            abort(404, 'File tidak ditemukan.');
        }

        // File content is stored as base64 in the database
        $fileContent = base64_decode($asset->file_content);

        return response($fileContent)
            ->header('Content-Type', $asset->file_mime ?? 'application/octet-stream')
            ->header('Content-Disposition', 'inline; filename="' . $asset->file_name . '"')
            ->header('Content-Length', strlen($fileContent));
    }
}
