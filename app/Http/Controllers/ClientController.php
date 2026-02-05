<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Services\ClientService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    protected $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'provinsi' => $request->input('provinsi'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
        ];

        $perPage = $request->input('per_page', 10);
        $clients = $this->clientService->getFilteredClients($filters, $request->user(), $perPage);
        $wilayahList = $this->clientService->getWilayahList();
        $provinsiList = $this->clientService->getProvinsiList();

        return Inertia::render('clients', [
            'clients' => $clients,
            'wilayahList' => $wilayahList,
            'provinsiList' => $provinsiList,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_klien' => 'required|string|max:255|unique:clients,kode_klien',
            'nama_klien' => 'required|string|max:255',
            'type_of_client' => 'required|string|in:Kementerian/Lembaga Pemerintah,Pemerintah Daerah,BUMN/D,Swasta Nasional,Lembaga Asing',
            'alamat' => 'required|string',
            'kode_kabupaten' => 'required|string|exists:wilayah,kode_kabupaten',
            'kontak_person' => 'required|string|max:255',
            'telp' => 'required|string|max:20',
        ]);

        $this->clientService->createClient($validated, $request->user()->id);

        return redirect()->back()->with('success', 'Client berhasil ditambahkan!');
    }

    public function update(Request $request, Client $client)
    {
        if (!$this->clientService->checkClientOwnership($client, $request->user())) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah client ini.');
        }

        $validated = $request->validate([
            'kode_klien' => 'required|string|max:255|unique:clients,kode_klien,' . $client->id,
            'nama_klien' => 'required|string|max:255',
            'type_of_client' => 'required|string|in:Kementerian/Lembaga Pemerintah,Pemerintah Daerah,BUMN/D,Swasta Nasional,Lembaga Asing',
            'alamat' => 'required|string',
            'kode_kabupaten' => 'required|string|exists:wilayah,kode_kabupaten',
            'kontak_person' => 'required|string|max:255',
            'telp' => 'required|string|max:20',
        ]);

        $this->clientService->updateClient($client, $validated);

        return redirect()->back()->with('success', 'Client berhasil diperbarui!');
    }

    public function destroy(Request $request, Client $client)
    {
        if (!$this->clientService->checkClientOwnership($client, $request->user())) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus client ini.');
        }

        $this->clientService->deleteClient($client);

        return redirect()->back()->with('success', 'Client berhasil dihapus!');
    }
}
