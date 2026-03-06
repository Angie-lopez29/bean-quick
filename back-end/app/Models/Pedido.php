<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',      // Usamos user_id para ser consistentes
        'empresa_id',
        'estado',       // 'pendiente', 'pagado', 'preparando', 'listo', 'entregado', 'cancelado'
        'estado_pago',     // 'pendiente', 'aprobado', 'rechazado'
        'hora_recogida',
        'total'
    ];

    /**
     * Asegura que los datos salgan en el formato correcto para React
     */
    protected $casts = [
        'total' => 'float',
        'hora_recogida' => 'datetime:H:i', // Solo hora y minutos
        'created_at' => 'datetime:d/m/Y H:i',
    ];

    // --- Relaciones ---

    /**
     * El cliente que hizo el pedido
     */
    public function cliente()
    {
        // Apuntamos a user_id que es la FK real en tu tabla
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * La empresa que recibe el pedido
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    /**
     * Detalle de productos comprados
     * Importante: withPivot permite que React vea cuánto costó cada cosa en ese momento
     */
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_productos')
                    ->withPivot('cantidad', 'precio_unitario')
                    ->withTimestamps();
    }
}