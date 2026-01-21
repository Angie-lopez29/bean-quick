<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            'Comidas Rápidas',
            'Panadería',
            'Bebidas Frías',
            'Jugos Naturales',
            'Desayunos',
            'Cafetería',
            'Repostería',
            'Almuerzos',
            'Saludable',
            'Postres',
            'Fritos y Snacks',
            'Malteadas'
        ];

        foreach ($categorias as $nombre) {
            Categoria::updateOrCreate(
                ['nombre' => $nombre], // Busca si ya existe por nombre
                ['nombre' => $nombre]  // Si no existe, lo crea
            );
        }
    }
}