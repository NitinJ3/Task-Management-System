<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'project_id',
        'title',
        'description',
        'assigned_to',
        'status',
        'priority',
        'due_date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
   
    public function project()
    {

       return $this->belongsTo(Project::class, 'project_id');

    }
}
