<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    use HasFactory;

    protected $table = 'mapel';

    protected $fillable = [
        'kelas_id',
        'kode',
        'nama',
        'warna',
    ];

    public function classModel()
    {
        return $this->belongsTo(ClassModel::class, 'kelas_id');
    }

    public function materi()
    {
        return $this->hasMany(Materi::class, 'mapel_id');
    }
}
