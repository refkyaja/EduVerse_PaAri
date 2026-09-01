<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JawabanPercobaan extends Model
{
    use HasFactory;

    protected $table = 'jawaban_percobaan';

    protected $fillable = [
        'percobaan_id',
        'soal_id',
        'opsi_dipilih_id',
        'benar',
    ];

    protected $casts = [
        'benar' => 'boolean',
    ];

    public function percobaan()
    {
        return $this->belongsTo(PercobaanKuis::class, 'percobaan_id');
    }

    public function soal()
    {
        return $this->belongsTo(Soal::class, 'soal_id');
    }

    public function opsiDipilih()
    {
        return $this->belongsTo(OpsiSoal::class, 'opsi_dipilih_id');
    }
}
