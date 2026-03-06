<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'description',
        'department',
        'created_by',
        'team_leader',
        'status',
        'start_date',
        'end_date',
    ];

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'team_leader');
    }
}
