<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soal extends Model
{
    use HasFactory;

    protected $table = 'soal';

    protected $fillable = [
        'kelas_id',
        'materi_id',
        'pertanyaan',
        'jenis_soal',
        'pembahasan',
        'tingkat_kesulitan',
        'dibuat_oleh',
    ];

    public function classModel()
    {
        return $this->belongsTo(ClassModel::class, 'kelas_id');
    }

    public function materi()
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function opsi()
    {
        return $this->hasMany(OpsiSoal::class, 'soal_id')->orderBy('urutan', 'asc');
    }
}
