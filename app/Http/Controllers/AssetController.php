<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Client;
use App\Services\AssetService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetController extends Controller
{
    protected $assetService;

    public function __construct(AssetService $assetService)
    {
        $this->assetService = $assetService;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'jenis_laporan' => $request->input('jenis_laporan'),
            'tahun' => $request->input('tahun'),
            'grup_kajian' => $request->input('grup_kajian'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
        ];

        $perPage = $request->input('per_page', 10);
        $assets = $this->assetService->getFilteredAssets($filters, $request->user(), $perPage);
        
        $clients = Client::select('id', 'kode_klien', 'nama_klien')
            ->orderBy('nama_klien')
            ->get()
            ->map(fn($client) => [
                'value' => $client->id,
                'label' => "{$client->kode_klien} - {$client->nama_klien}",
            ]);

        return Inertia::render('assets', [
            'assets' => $assets,
            'clients' => $clients,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'kode' => 'required|string|max:255|unique:assets,kode',
            'judul_laporan' => 'required|string|max:500',
            'abstrak' => 'required|string',
            'jenis_laporan' => 'required|string|in:penelitian_survey,penelitian,diklat,jurnal,buku,lainnya',
            'grup_kajian' => 'required|string|in:bc_glove,nres,gec_rg,dtbs,mfpe,spl,sece,devpfin,mpower,trust',
            'kepala_proyek' => 'required|string|max:255',
            'staf' => 'required|array|min:1',
            'staf.*' => 'required|string|max:255',
            'tahun' => 'required|integer|min:1900|max:' . (date('Y') + 10),
            'file_laporan' => 'nullable|file|mimes:pdf,doc,docx,zip,rar|max:51200',
        ]);

        $this->assetService->createAsset($validated, $request->user()->id);

        return redirect()->back()->with('success', 'Asset berhasil ditambahkan!');
    }

    public function update(Request $request, Asset $asset)
    {
        if (!$this->assetService->checkAssetOwnership($asset, $request->user())) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah asset ini.');
        }

        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'kode' => 'required|string|max:255|unique:assets,kode,' . $asset->id,
            'judul_laporan' => 'required|string|max:500',
            'abstrak' => 'required|string',
            'jenis_laporan' => 'required|string|in:penelitian_survey,penelitian,diklat,jurnal,buku,lainnya',
            'grup_kajian' => 'required|string|in:bc_glove,nres,gec_rg,dtbs,mfpe,spl,sece,devpfin,mpower,trust',
            'kepala_proyek' => 'required|string|max:255',
            'staf' => 'required|array|min:1',
            'staf.*' => 'required|string|max:255',
            'tahun' => 'required|integer|min:1900|max:' . (date('Y') + 10),
            'file_laporan' => 'nullable|file|mimes:pdf,doc,docx,zip,rar|max:51200',
        ]);

        $this->assetService->updateAsset($asset, $validated);

        return redirect()->back()->with('success', 'Asset berhasil diperbarui!');
    }

    public function destroy(Request $request, Asset $asset)
    {
        if (!$this->assetService->checkAssetOwnership($asset, $request->user())) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus asset ini.');
        }

        $this->assetService->deleteAsset($asset);

        return redirect()->back()->with('success', 'Asset berhasil dihapus!');
    }
}
