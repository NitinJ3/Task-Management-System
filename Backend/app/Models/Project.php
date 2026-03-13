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

    //team leader user
    public function user()
    {
        return $this->belongsTo(User::class, 'team_leader');
    }
    public function creator(){

        return $this->belongsTo(User::class, 'created_by');

    }

    public function tasks(){
        return $this->hasMany(Task::class);

    }
}
