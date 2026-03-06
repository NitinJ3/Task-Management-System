<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->text('description')->nullable();

            // created by user
            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();

            //team leader for each project
            $table->foreignId('team_leader')
                  ->nullable()
                  ->constrained('users');
            
            // not FK for now
            $table->string('department')->nullable();

            // useful extras
            $table->enum('status', ['pending', 'active', 'completed'])->default('pending');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
