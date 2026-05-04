<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Client;
use App\Services\AssetService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AssetController extends Controller
{
    protected AssetService $assetService;

    public function __construct(AssetService $assetService)
    {
        $this->assetService = $assetService;
    }

    public function index(Request $request): InertiaResponse
    {
        $filters = [
            'search'        => $request->input('search'),
            'jenis_laporan' => $request->input('jenis_laporan'),
            'tahun'         => $request->input('tahun'),
            'grup_kajian'   => $request->input('grup_kajian'),
            'sort_by'       => $request->input('sort_by', 'created_at'),
            'sort_order'    => $request->input('sort_order', 'desc'),
        ];

        $perPage = $request->integer('per_page', 10);
        $assets  = $this->assetService->getFilteredAssets($filters, $request->user(), $perPage);

        $clients = Client::select('id', 'kode_klien', 'nama_klien')
            ->orderBy('nama_klien')
            ->get()
            ->map(fn ($client) => [
                'value' => $client->id,
                'label' => "{$client->kode_klien} - {$client->nama_klien}",
            ]);

        return Inertia::render('assets', [
            'assets'  => $assets,
            'clients' => $clients,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->validationRules());

        $this->assetService->createAsset($validated, $request->user()->id);

        return redirect()->back()->with('success', 'Asset berhasil ditambahkan!');
    }

    public function update(Request $request, Asset $asset): RedirectResponse
    {
        if (! $this->assetService->checkAssetOwnership($asset, $request->user())) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah asset ini.');
        }

        $validated = $request->validate($this->validationRules($asset->id));

        $this->assetService->updateAsset($asset, $validated);

        return redirect()->back()->with('success', 'Asset berhasil diperbarui!');
    }

    public function destroy(Request $request, Asset $asset): RedirectResponse
    {
        if (! $this->assetService->checkAssetOwnership($asset, $request->user())) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus asset ini.');
        }

        $this->assetService->deleteAsset($asset);

        return redirect()->back()->with('success', 'Asset berhasil dihapus!');
    }

    public function download(Asset $asset): Response
    {
        if (! $asset->file_content) {
            abort(404, 'File tidak ditemukan.');
        }

        $fileContent = base64_decode($asset->file_content);

        return response($fileContent)
            ->header('Content-Type', $asset->file_mime)
            ->header('Content-Disposition', 'attachment; filename="' . $asset->file_name . '"')
            ->header('Content-Length', strlen($fileContent));
    }

    public function downloadProposal(Asset $asset): Response
    {
        if (! $asset->proposal_content) {
            abort(404, 'Proposal file tidak ditemukan.');
        }

        $fileContent = base64_decode($asset->proposal_content);

        return response($fileContent)
            ->header('Content-Type', $asset->proposal_mime)
            ->header('Content-Disposition', 'attachment; filename="' . $asset->proposal_name . '"')
            ->header('Content-Length', strlen($fileContent));
    }

    /**
     * Returns the shared validation rules for store and update.
     * Pass the asset ID when updating to ignore the unique constraint on `kode`.
     */
    private function validationRules(?int $assetId = null): array
    {
        $uniqueKode = 'required|string|max:255|unique:assets,kode' . ($assetId ? ",{$assetId}" : '');

        return [
            'client_id'     => 'nullable|exists:clients,id',
            'kode'          => $uniqueKode,
            'judul_laporan' => 'required|string|max:500',
            'abstrak'       => 'required|string',
            'jenis_laporan' => 'required|string|in:penelitian_survey,penelitian,diklat,jurnal,buku,lainnya',
            'grup_kajian'   => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    $jenisLaporan  = request()->input('jenis_laporan');
                    $researchTypes = ['penelitian', 'penelitian_survey'];
                    $validGroups   = ['bc_glove', 'nres', 'gec_rg', 'dtbs', 'mfpe', 'spl', 'sece', 'devpfin', 'mpower', 'trust'];

                    if (in_array($jenisLaporan, $researchTypes) && $value && ! in_array($value, $validGroups)) {
                        $fail('The selected grup kajian is invalid.');
                    }
                },
            ],
            'kepala_proyek' => 'required|string|max:255',
            'staf'          => 'required|array|min:1',
            'staf.*'        => 'required|string|max:255',
            'tahun'         => 'required|integer|min:1900|max:' . (date('Y') + 10),
            'kesimpulan'    => 'nullable|string',
            'rekomendasi'   => 'nullable|string',
            'file_laporan'  => 'nullable|file|mimes:pdf,doc,docx,zip,rar|max:202400',
            'file_proposal' => 'nullable|file|mimes:pdf,doc,docx,zip,rar|max:202400',
            'is_nda'        => 'boolean',
        ];
    }
}
