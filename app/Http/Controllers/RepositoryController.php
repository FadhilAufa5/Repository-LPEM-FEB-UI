<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RepositoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Asset::query();

        // Search by title
        if ($title = $request->input('title')) {
            $query->where('judul_laporan', 'like', "%{$title}%");
        }

        // Search by author
        if ($author = $request->input('author')) {
            $query->where('kepala_proyek', 'like', "%{$author}%");
        }

        // Search by abstract
        if ($abstract = $request->input('abstract')) {
            $query->where('abstrak', 'like', "%{$abstract}%");
        }

        // Filter by year
        if ($year = $request->input('year')) {
            $query->where('tahun', $year);
        }

        // Order by latest
        $query->orderBy('tahun', 'desc')->orderBy('created_at', 'desc');

        // Pagination
        $perPage = $request->input('per_page', 12);
        $assets = $query->paginate($perPage);

        // Transform data for frontend
        $repositories = $assets->through(function ($asset) {
            return [
                'id' => $asset->id,
                'title' => $asset->judul_laporan,
                'author' => $asset->kepala_proyek,
                'year' => $asset->tahun,
                'abstract' => $asset->abstrak,
                'file_url' => $asset->file_laporan ? asset('storage/' . $asset->file_laporan) : null,
            ];
        });

        return Inertia::render('repository', [
            'repositories' => $repositories,
            'filters' => [
                'title' => $title,
                'author' => $author,
                'abstract' => $abstract,
                'year' => $year,
            ],
        ]);
    }

    public function show($id)
    {
        $asset = Asset::findOrFail($id);

        return Inertia::render('repository-detail', [
            'repository' => [
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
            ],
        ]);
    }
}
