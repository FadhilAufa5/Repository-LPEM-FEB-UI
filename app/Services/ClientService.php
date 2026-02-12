<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Wilayah;
use Illuminate\Database\Eloquent\Builder;

class ClientService
{
    public function getFilteredClients(array $filters, $user, int $perPage = 10)
    {
        $query = Client::query()->with(['wilayah', 'user:id,name,email']);

        $this->applyUserFilter($query, $user);
        $this->applySearchFilter($query, $filters['search'] ?? null);
        $this->applyProvinsiFilter($query, $filters['provinsi'] ?? null);
        $this->applySorting($query, $filters['sort_by'] ?? 'created_at', $filters['sort_order'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function getProvinsiList()
    {
        return Wilayah::select('provinsi')
            ->distinct()
            ->orderBy('provinsi')
            ->pluck('provinsi');
    }

    public function getWilayahList()
    {
        return Wilayah::select('kode_kabupaten', 'kabupaten', 'provinsi')
            ->orderBy('provinsi')
            ->orderBy('kabupaten')
            ->get()
            ->map(fn($wilayah) => [
                'value' => $wilayah->kode_kabupaten,
                'label' => "{$wilayah->kabupaten}, {$wilayah->provinsi}",
                'provinsi' => $wilayah->provinsi,
                'kabupaten' => $wilayah->kabupaten,
            ]);
    }

    public function createClient(array $data, $userId)
    {
        $data['user_id'] = $userId;
        return Client::create($data);
    }

    public function updateClient(Client $client, array $data)
    {
        $client->update($data);
        return $client;
    }

    public function deleteClient(Client $client)
    {
        return $client->delete();
    }

    public function checkClientOwnership(Client $client, $user): bool
    {
        return $user->hasRole('admin') || $client->user_id === $user->id;
    }

    private function applyUserFilter(Builder $query, $user): void
    {
        // Allow all users to view all clients
        // No filtering based on user_id
    }

    private function applySearchFilter(Builder $query, ?string $search): void
    {
        if ($search) {
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
    }

    private function applyProvinsiFilter(Builder $query, ?string $provinsi): void
    {
        if ($provinsi) {
            $query->whereHas('wilayah', fn($q) => $q->where('provinsi', $provinsi));
        }
    }

    private function applySorting(Builder $query, string $sortBy, string $sortOrder): void
    {
        $query->orderBy($sortBy, $sortOrder);
    }
}
