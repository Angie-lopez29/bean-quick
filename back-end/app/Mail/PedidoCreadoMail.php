<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Pedido;
use App\Models\User;

class PedidoCreadoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pedido;
    public $user;

    /**
     * Create a new message instance.
     *
     * @param Pedido $pedido
     * @param User $user
     */
    public function __construct(Pedido $pedido, User $user)
    {
        $this->pedido = $pedido->load(['empresa', 'productos']); // 👈 carga empresa y productos
        $this->user = $user;
    }
    
    public function build()
    {
        return $this
            ->subject('Resumen de tu pedido en BeanQuick')
            ->view('emails.pedido_creado')
            ->with([
                'pedido' => $this->pedido,
                'user'   => $this->user,
            ]);
    }
}
