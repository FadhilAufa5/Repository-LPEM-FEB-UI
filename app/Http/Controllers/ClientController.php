<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::query()->with(['wilayah', 'user:id,name,email']);

        // Filter by user role - only show user's own clients if not admin
        $user = $request->user();
        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('kode_klien', 'like', "%{$search}%")
                    ->orWhere('nama_klien', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%")
                    ->orWhere('kontak_person', 'like', "%{$search}%")
                    ->orWhere('telp', 'like', "%{$search}%")
                    ->orWhereHas('wilayah', function ($q) use ($search) {
                        $q->where('kabupaten', 'like', "%{$search}%")
                            ->orWhere('provinsi', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by provinsi
        if ($provinsi = $request->input('provinsi')) {
            $query->whereHas('wilayah', function ($q) use ($provinsi) {
                $q->where('provinsi', $provinsi);
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $clients = $query->paginate($perPage);

        // Get list of provinces for filter
        $provinsiList = Wilayah::select('provinsi')
            ->distinct()
            ->orderBy('provinsi')
            ->pluck('provinsi');

        // Get all wilayah for dropdown
        $wilayahList = Wilayah::select('kode_kabupaten', 'kabupaten', 'provinsi')
            ->orderBy('provinsi')
            ->orderBy('kabupaten')
            ->get()
            ->map(function ($wilayah) {
                return [
                    'value' => $wilayah->kode_kabupaten,
                    'label' => "{$wilayah->kabupaten}, {$wilayah->provinsi}",
                    'provinsi' => $wilayah->provinsi,
                    'kabupaten' => $wilayah->kabupaten,
                ];
            });

        return Inertia::render('clients', [
            'clients' => $clients,
            'wilayahList' => $wilayahList,
            'provinsiList' => $provinsiList,
            'filters' => [
                'search' => $search,
                'provinsi' => $provinsi,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_klien' => 'required|string|max:255|unique:clients,kode_klien',
            'nama_klien' => 'required|string|max:255',
            'alamat' => 'required|string',
            'kode_kabupaten' => 'required|string|exists:wilayah,kode_kabupaten',
            'kontak_person' => 'required|string|max:255',
            'telp' => 'required|string|max:20',
        ]);

        // Assign user_id to the client
        $validated['user_id'] = $request->user()->id;

        Client::create($validated);

        return redirect()->back()->with('success', 'Client berhasil ditambahkan!');
    }

    public function update(Request $request, Client $client)
    {
        // Check if user owns this client or is admin
        $user = $request->user();
        if (!$user->hasRole('admin') && $client->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah client ini.');
        }

        $validated = $request->validate([
            'kode_klien' => 'required|string|max:255|unique:clients,kode_klien,' . $client->id,
            'nama_klien' => 'required|string|max:255',
            'alamat' => 'required|string',
            'kode_kabupaten' => 'required|string|exists:wilayah,kode_kabupaten',
            'kontak_person' => 'required|string|max:255',
            'telp' => 'required|string|max:20',
        ]);

        $client->update($validated);

        return redirect()->back()->with('success', 'Client berhasil diperbarui!');
    }

    public function destroy(Request $request, Client $client)
    {
        // Check if user owns this client or is admin
        $user = $request->user();
        if (!$user->hasRole('admin') && $client->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus client ini.');
        }

        $client->delete();

        return redirect()->back()->with('success', 'Client berhasil dihapus!');
    }
}
