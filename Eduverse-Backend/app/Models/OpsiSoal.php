<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpsiSoal extends Model
{
    use HasFactory;

    protected $table = 'opsi_soal';

    protected $fillable = [
        'soal_id',
        'teks_opsi',
        'benar',
        'urutan',
    ];

    protected $casts = [
        'benar' => 'boolean',
    ];

    public function soal()
    {
        return $this->belongsTo(Soal::class, 'soal_id');
    }
}
