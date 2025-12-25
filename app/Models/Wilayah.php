<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wilayah extends Model
{
    use HasFactory;

    protected $table = 'wilayah';

    protected $fillable = [
        'kode_provinsi',
        'kode_kabupaten',
        'provinsi',
        'kabupaten',
    ];

    /**
     * Get the clients for this wilayah.
     */
    public function clients()
    {
        return $this->hasMany(Client::class, 'kode_kabupaten', 'kode_kabupaten');
    }

    /**
     * Get full location label
     */
    public function getFullLocationAttribute()
    {
        return "{$this->kabupaten}, {$this->provinsi}";
    }
}
