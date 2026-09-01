<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    use HasFactory;

    protected $table = 'log_aktivitas';

    protected $fillable = [
        'kelas_id',
        'user_id',
        'peran_user',
        'deskripsi_aksi',
    ];

    public function classModel()
    {
        return $this->belongsTo(ClassModel::class, 'kelas_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
