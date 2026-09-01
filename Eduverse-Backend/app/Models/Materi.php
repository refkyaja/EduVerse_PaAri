<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materi extends Model
{
    use HasFactory;

    protected $table = 'materi';

    protected $fillable = [
        'kelas_id',
        'mapel_id',
        'judul',
        'ringkasan',
        'versi_aktif_id',
        'dibuat_oleh',
    ];

    public function classModel()
    {
        return $this->belongsTo(ClassModel::class, 'kelas_id');
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function versi()
    {
        return $this->hasMany(MateriVersi::class, 'materi_id');
    }

    public function versiAktif()
    {
        return $this->belongsTo(MateriVersi::class, 'versi_aktif_id');
    }
}
