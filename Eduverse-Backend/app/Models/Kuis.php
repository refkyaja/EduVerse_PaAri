<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kuis extends Model
{
    use HasFactory;

    protected $table = 'kuis';

    protected $fillable = [
        'kelas_id',
        'judul',
        'deskripsi',
        'batas_waktu',
        'jumlah_soal',
        'acak_soal',
        'acak_opsi',
        'status_aktif',
        'dibuat_oleh',
    ];

    protected $casts = [
        'acak_soal' => 'boolean',
        'acak_opsi' => 'boolean',
        'status_aktif' => 'boolean',
    ];

    public function classModel()
    {
        return $this->belongsTo(ClassModel::class, 'kelas_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function soal()
    {
        return $this->belongsToMany(Soal::class, 'kuis_soal', 'kuis_id', 'soal_id')
                    ->withPivot('urutan')
                    ->withTimestamps();
    }

    public function percobaan()
    {
        return $this->hasMany(PercobaanKuis::class, 'kuis_id');
    }
}
