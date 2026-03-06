<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE pedidos 
            MODIFY estado ENUM(
                'Pendiente',
                'Pagado',
                'Preparando',
                'Listo',
                'Entregado',
                'Cancelado'
            ) NOT NULL DEFAULT 'Pendiente'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE pedidos 
            MODIFY estado ENUM(
                'Pendiente',
                'Preparando',
                'Listo',
                'Entregado',
                'Cancelado'
            ) NOT NULL DEFAULT 'Pendiente'
        ");
    }
};