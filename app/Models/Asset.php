<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'kode',
        'judul_laporan',
        'abstrak',
        'jenis_laporan',
        'grup_kajian',
        'kepala_proyek',
        'staf',
        'tahun',
        'file_laporan',
    ];

    protected $casts = [
        'tahun' => 'integer',
    ];

    // Accessor for staf to ensure it's always an array
    public function getStafAttribute($value)
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        return is_array($value) ? $value : [];
    }

    // Mutator for staf to ensure it's saved as JSON string
    public function setStafAttribute($value)
    {
        $this->attributes['staf'] = is_array($value) ? json_encode($value) : $value;
    }

    // Jenis Laporan constants
    const JENIS_PENELITIAN_SURVEY = 'penelitian_survey';
    const JENIS_PENELITIAN = 'penelitian';
    const JENIS_DIKLAT = 'diklat';
    const JENIS_JURNAL = 'jurnal';
    const JENIS_BUKU = 'buku';
    const JENIS_LAINNYA = 'lainnya';

    // Grup Kajian constants
    const GRUP_BC_GLOVE = 'bc_glove';
    const GRUP_NRES = 'nres';
    const GRUP_GEC_RG = 'gec_rg';
    const GRUP_DTBS = 'dtbs';
    const GRUP_MFPE = 'mfpe';
    const GRUP_SPL = 'spl';
    const GRUP_SECE = 'sece';
    const GRUP_DEVPFIN = 'devpfin';
    const GRUP_MPOWER = 'mpower';
    const GRUP_TRUST = 'trust';

    public static function getJenisLaporanOptions()
    {
        return [
            self::JENIS_PENELITIAN_SURVEY => 'Penelitian + Survey',
            self::JENIS_PENELITIAN => 'Penelitian',
            self::JENIS_DIKLAT => 'Diklat',
            self::JENIS_JURNAL => 'Jurnal',
            self::JENIS_BUKU => 'Buku',
            self::JENIS_LAINNYA => 'Lainnya',
        ];
    }

    public static function getGrupKajianOptions()
    {
        return [
            self::GRUP_BC_GLOVE => 'Business Climate and Global Value Chain (BC-GLOVE)',
            self::GRUP_NRES => 'Natural Resources and Energy Studies (NRES)',
            self::GRUP_GEC_RG => 'Green Economy and Climate - Research Group (GEC-RG)',
            self::GRUP_DTBS => 'Digital Transformation and Behavioral Studies (DTBS)',
            self::GRUP_MFPE => 'Macro, Finance, and Political Economy (MFPE)',
            self::GRUP_SPL => 'Social Protection and Labor (SPL)',
            self::GRUP_SECE => 'Social Engineering and Community Empowerment (SECE)',
            self::GRUP_DEVPFIN => 'Public Finance and Development Planning (DEVPFIN)',
            self::GRUP_MPOWER => 'Multidimensional Poverty and Well Being Research Group (MPOWER)',
            self::GRUP_TRUST => 'Transport, Real Estate, and Urban Studies (TRUST)',
        ];
    }

    public function getJenisLaporanLabelAttribute()
    {
        return self::getJenisLaporanOptions()[$this->jenis_laporan] ?? $this->jenis_laporan;
    }

    public function getGrupKajianLabelAttribute()
    {
        return self::getGrupKajianOptions()[$this->grup_kajian] ?? $this->grup_kajian;
    }

    /**
     * Get the user that owns the asset.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
