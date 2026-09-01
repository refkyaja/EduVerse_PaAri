<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PercobaanKuis extends Model
{
    use HasFactory;

    protected $table = 'percobaan_kuis';

    protected $fillable = [
        'kuis_id',
        'user_id',
        'percobaan_ke',
        'skor',
        'xp_didapat',
        'mulai_pada',
        'selesai_pada',
    ];

    protected $casts = [
        'mulai_pada' => 'datetime',
        'selesai_pada' => 'datetime',
    ];

    public function kuis()
    {
        return $this->belongsTo(Kuis::class, 'kuis_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function jawaban()
    {
        return $this->hasMany(JawabanPercobaan::class, 'percobaan_id');
    }
}
