<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class BienvenidaMail extends Mailable
{
    use Queueable, SerializesModels;

    // Estas propiedades públicas estarán disponibles automáticamente en la vista
    public $user;

    /**
     * Crear una nueva instancia del mensaje.
     *
     * @param User $user El objeto con los datos del usuario recién registrado.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Construir el mensaje.
     *
     * Configura el asunto y vincula la plantilla HTML personalizada.
     */
    public function build()
    {
        return $this
            ->subject('¡Bienvenido a BeanQuick!')
            // Se usa view() para cargar el archivo en resources/views/emails/bienvenida.blade.php
            ->view('emails.bienvenida');
    }
}