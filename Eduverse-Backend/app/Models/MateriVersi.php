<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MateriVersi extends Model
{
    use HasFactory;

    protected $table = 'materi_versi';

    protected $fillable = [
        'materi_id',
        'nomor_versi',
        'isi',
        'file_path',
        'status',
        'dibuat_oleh',
        'ditinjau_oleh',
        'ditinjau_pada',
        'catatan_review',
    ];

    protected $casts = [
        'ditinjau_pada' => 'datetime',
    ];

    public function materi()
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'ditinjau_oleh');
    }
}
