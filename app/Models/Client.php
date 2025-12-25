<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_klien',
        'nama_klien',
        'alamat',
        'kode_kabupaten',
        'kontak_person',
        'telp',
        'user_id',
    ];

    /**
     * Get the wilayah that the client belongs to.
     */
    public function wilayah()
    {
        return $this->belongsTo(Wilayah::class, 'kode_kabupaten', 'kode_kabupaten');
    }

    /**
     * Get the user that created the client.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
