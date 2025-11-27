<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $query = Asset::query();

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('kode', 'like', "%{$search}%")
                    ->orWhere('judul_laporan', 'like', "%{$search}%")
                    ->orWhere('abstrak', 'like', "%{$search}%")
                    ->orWhere('kepala_proyek', 'like', "%{$search}%");
            });
        }

        // Filter by jenis laporan
        if ($jenisLaporan = $request->input('jenis_laporan')) {
            $query->where('jenis_laporan', $jenisLaporan);
        }

        // Filter by tahun
        if ($tahun = $request->input('tahun')) {
            $query->where('tahun', $tahun);
        }

        // Filter by grup kajian
        if ($grupKajian = $request->input('grup_kajian')) {
            $query->where('grup_kajian', $grupKajian);
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $assets = $query->paginate($perPage);

        return Inertia::render('assets', [
            'assets' => $assets,
            'filters' => [
                'search' => $search,
                'jenis_laporan' => $jenisLaporan,
                'tahun' => $tahun,
                'grup_kajian' => $grupKajian,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:255|unique:assets,kode',
            'judul_laporan' => 'required|string|max:500',
            'abstrak' => 'required|string',
            'jenis_laporan' => 'required|string|in:penelitian_survey,penelitian,diklat,jurnal,buku,lainnya',
            'grup_kajian' => 'required|string|in:bc_glove,nres,gec_rg,dtbs,mfpe,spl,sece,devpfin,mpower,trust',
            'kepala_proyek' => 'required|string|max:255',
            'staf' => 'required|array|min:1',
            'staf.*' => 'required|string|max:255',
            'tahun' => 'required|integer|min:1900|max:' . (date('Y') + 10),
            'file_laporan' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        // Handle file upload
        if ($request->hasFile('file_laporan')) {
            $file = $request->file('file_laporan');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('assets', $filename, 'public');
            $validated['file_laporan'] = $path;
        }

        Asset::create($validated);

        return redirect()->back()->with('success', 'Asset berhasil ditambahkan!');
    }

    public function update(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:255|unique:assets,kode,' . $asset->id,
            'judul_laporan' => 'required|string|max:500',
            'abstrak' => 'required|string',
            'jenis_laporan' => 'required|string|in:penelitian_survey,penelitian,diklat,jurnal,buku,lainnya',
            'grup_kajian' => 'required|string|in:bc_glove,nres,gec_rg,dtbs,mfpe,spl,sece,devpfin,mpower,trust',
            'kepala_proyek' => 'required|string|max:255',
            'staf' => 'required|array|min:1',
            'staf.*' => 'required|string|max:255',
            'tahun' => 'required|integer|min:1900|max:' . (date('Y') + 10),
            'file_laporan' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        // Handle file upload
        if ($request->hasFile('file_laporan')) {
            // Delete old file if exists
            if ($asset->file_laporan && Storage::disk('public')->exists($asset->file_laporan)) {
                Storage::disk('public')->delete($asset->file_laporan);
            }

            $file = $request->file('file_laporan');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('assets', $filename, 'public');
            $validated['file_laporan'] = $path;
        }

        $asset->update($validated);

        return redirect()->back()->with('success', 'Asset berhasil diperbarui!');
    }

    public function destroy(Asset $asset)
    {
        // Delete file if exists
        if ($asset->file_laporan && Storage::disk('public')->exists($asset->file_laporan)) {
            Storage::disk('public')->delete($asset->file_laporan);
        }

        $asset->delete();

        return redirect()->back()->with('success', 'Asset berhasil dihapus!');
    }
}
