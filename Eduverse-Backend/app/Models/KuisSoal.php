<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KuisSoal extends Model
{
    use HasFactory;

    protected $table = 'kuis_soal';

    protected $fillable = [
        'kuis_id',
        'soal_id',
        'urutan',
    ];
}
