<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'], // evita duplicados
            [
                'name' => 'Admin',
                'password' => Hash::make('Admin12345'),
                'rol' => 'admin',
            ]
        );
    }
}
