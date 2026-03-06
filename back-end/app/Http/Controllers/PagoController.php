<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient;

class PagoController extends Controller
{
    public function pagar($id)
    {
        $pedido = Pedido::findOrFail($id);

        if ($pedido->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'No autorizado para pagar este pedido.'
            ], 403);
        }

        if ($pedido->estado_pago === 'aprobado') {
            return response()->json([
                'message' => 'Este pedido ya fue pagado.'
            ], 400);
        }

        // Siempre que vaya a pagar, lo marcamos como pendiente
        $pedido->estado_pago = 'pendiente';
        $pedido->save();

        $token = config('services.mercadopago.access_token');
        MercadoPagoConfig::setAccessToken($token);

        $client = new PreferenceClient();

        $preference = $client->create([
            "items" => [
                [
                    "title" => "Pedido BeanQuick #" . $pedido->id,
                    "quantity" => 1,
                    "unit_price" => (float) $pedido->total
                ]
            ],
            "external_reference" => (string) $pedido->id,
            "notification_url" => env('WEBHOOK_URL'),
            "back_urls" => [
                "success" => env('APP_FRONTEND_URL') . "/pago-exitoso",
                "failure" => env('APP_FRONTEND_URL') . "/pago-fallido",
                "pending" => env('APP_FRONTEND_URL') . "/pago-pendiente"
            ],
            "auto_return" => "approved",
        ]);

        return response()->json([
            "init_point" => $preference->init_point
        ]);
    }

    public function webhook(Request $request)
    {
        \Log::info('WEBHOOK RECIBIDO:', $request->all());

        $topic = $request->input('type') ?? $request->input('topic');

        if ($topic !== 'payment') {
            return response()->json(['ok' => true]);
        }

        $paymentId = $request->input('data.id') 
            ?? $request->input('resource') 
            ?? $request->input('id');

        if (!$paymentId) {
            return response()->json(['ok' => true]);
        }

        $token = config('services.mercadopago.access_token');
        MercadoPagoConfig::setAccessToken($token);

        $client = new PaymentClient();

        try {

            sleep(2); // pequeña espera para sincronización

            $payment = $client->get($paymentId);

            \Log::info('PAYMENT COMPLETO:', [
                'status' => $payment->status,
                'external_reference' => $payment->external_reference
            ]);

            if (!$payment->external_reference) {
                return response()->json(['ok' => true]);
            }

            $pedido = Pedido::with('productos')->find($payment->external_reference);

            if (!$pedido) {
                return response()->json(['ok' => true]);
            }

            $nuevoEstado = null;

            switch ($payment->status) {

                case 'approved':
                    $nuevoEstado = 'aprobado';
                    break;

                case 'pending':
                case 'in_process':
                    $nuevoEstado = 'pendiente';
                    break;

                case 'rejected':
                case 'cancelled':
                    $nuevoEstado = 'rechazado';
                    break;

                case 'refunded':
                case 'charged_back':
                    $nuevoEstado = 'reembolsado';
                    break;

                default:
                    return response()->json(['ok' => true]);
            }

            // 🚨 SOLO PROCESAR SI CAMBIA EL ESTADO (evita duplicados)
            if ($pedido->estado_pago !== $nuevoEstado) {

                \DB::transaction(function () use ($pedido, $nuevoEstado) {

                    $pedido->estado_pago = $nuevoEstado;
                    $pedido->save();

                    // 🔥 SI EL PAGO FUE APROBADO
                    if ($nuevoEstado === 'aprobado') {

                        // Cambiar estado logístico
                        $pedido->estado = 'Pagado';
                        $pedido->save();

                        // Descontar stock
                        foreach ($pedido->productos as $producto) {
                            $cantidad = $producto->pivot->cantidad;
                            $producto->decrement('stock', $cantidad);
                        }

                        // Vaciar carrito completo
                        $carrito = \App\Models\Carrito::where('user_id', $pedido->user_id)->first();
                        if ($carrito) {
                            $carrito->productos()->detach();
                        }

                        \Log::info('PEDIDO PAGADO - STOCK DESCONTADO - CARRITO VACIADO', [
                            'pedido_id' => $pedido->id
                        ]);
                    }
                });

                \Log::info('PEDIDO ACTUALIZADO', [
                    'pedido_id' => $pedido->id,
                    'nuevo_estado' => $nuevoEstado
                ]);
            }

        } catch (\Exception $e) {

            \Log::error('ERROR COMPLETO MP:', [
                'message' => $e->getMessage(),
                'payment_id' => $paymentId
            ]);
        }

        return response()->json(['ok' => true]);
    }
}