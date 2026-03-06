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
}
