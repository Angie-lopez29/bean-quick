<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>BeanQuick</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
        @media only screen and (max-width: 600px) {
            .inner-body { width: 100% !important; }
            .footer { width: 100% !important; }
            .products-table td { padding: 8px 4px !important; font-size: 13px !important; }
        }
    </style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #edf2f7; color: #718096; margin: 0; padding: 0; width: 100%;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #edf2f7; width: 100%; margin: 0; padding: 0;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">

                    {{-- Header --}}
                    <tr>
                        <td style="padding: 25px 0; text-align: center;">
                            <a href="http://localhost" style="color: #3d4852; font-size: 19px; font-weight: bold; text-decoration: none;">
                                BeanQuick ☕
                            </a>
                        </td>
                    </tr>

                    {{-- Body --}}
                    <tr>
                        <td width="100%" style="background-color: #edf2f7;">
                            <table align="center" width="570" cellpadding="0" cellspacing="0" role="presentation"
                                style="background-color: #ffffff; border-radius: 6px; box-shadow: 0 2px 0 rgba(0,0,150,0.025); margin: 0 auto; width: 570px;">
                                <tr>
                                    <td style="padding: 32px;">

                                        {{-- Saludo --}}
                                        <h1 style="color: #3d4852; font-size: 20px; font-weight: bold; margin-top: 0;">
                                            ¡Gracias por tu pedido, {{ $user->name }}! 🎉
                                        </h1>
                                        <p style="font-size: 15px; line-height: 1.6em; margin-top: 0;">
                                            Tu pedido <strong>#{{ $pedido->id }}</strong> fue creado exitosamente y está <strong>pendiente de pago</strong>.
                                        </p>

                                        {{-- Info general --}}
                                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; border-radius: 4px; margin-bottom: 24px;">
                                            <tr>
                                                <td style="padding: 16px;">
                                                    <p style="margin: 0 0 6px 0; font-size: 14px;">
                                                        🏪 <strong>Empresa:</strong> {{ $pedido->empresa->nombre ?? 'N/A' }}
                                                    </p>
                                                    <p style="margin: 0 0 6px 0; font-size: 14px;">
                                                        🕐 <strong>Hora de recogida:</strong> {{ $pedido->hora_recogida }}
                                                    </p>
                                                    <p style="margin: 0; font-size: 14px;">
                                                        📅 <strong>Fecha:</strong> {{ $pedido->created_at }}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>

                                        {{-- Tabla de productos --}}
                                        <p style="font-size: 15px; font-weight: bold; color: #3d4852; margin-bottom: 8px;">
                                            📦 Detalle de tu pedido
                                        </p>
                                        <table class="products-table" width="100%" cellpadding="0" cellspacing="0"
                                            style="border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
                                            {{-- Encabezados --}}
                                            <tr style="background-color: #744210; color: #ffffff;">
                                                <td style="padding: 10px 12px; text-align: left; border-radius: 4px 0 0 0;">Producto</td>
                                                <td style="padding: 10px 12px; text-align: center;">Cantidad</td>
                                                <td style="padding: 10px 12px; text-align: right;">Precio unit.</td>
                                                <td style="padding: 10px 12px; text-align: right; border-radius: 0 4px 0 0;">Subtotal</td>
                                            </tr>

                                            {{-- Filas de productos --}}
                                            @foreach($pedido->productos as $index => $producto)
                                            <tr style="background-color: {{ $index % 2 === 0 ? '#fffbeb' : '#ffffff' }};">
                                                <td style="padding: 10px 12px; color: #3d4852; font-weight: 500;">
                                                    {{ $producto->nombre }}
                                                </td>
                                                <td style="padding: 10px 12px; text-align: center; color: #3d4852;">
                                                    {{ $producto->pivot->cantidad }}
                                                </td>
                                                <td style="padding: 10px 12px; text-align: right; color: #3d4852;">
                                                    ${{ number_format($producto->pivot->precio_unitario, 2) }}
                                                </td>
                                                <td style="padding: 10px 12px; text-align: right; color: #3d4852;">
                                                    ${{ number_format($producto->pivot->cantidad * $producto->pivot->precio_unitario, 2) }}
                                                </td>
                                            </tr>
                                            @endforeach

                                            {{-- Total --}}
                                            <tr style="background-color: #744210;">
                                                <td colspan="3" style="padding: 12px; text-align: right; color: #ffffff; font-weight: bold;">
                                                    Total
                                                </td>
                                                <td style="padding: 12px; text-align: right; color: #ffffff; font-weight: bold; font-size: 16px;">
                                                    ${{ number_format($pedido->total, 2) }}
                                                </td>
                                            </tr>
                                        </table>

                                        {{-- CTA --}}
                                        <p style="font-size: 14px; line-height: 1.6em; color: #718096;">
                                            Puedes consultar el estado de tu pedido en cualquier momento desde la plataforma.
                                        </p>
                                        <p style="font-size: 14px; line-height: 1.6em; color: #718096; margin-bottom: 0;">
                                            ¡Gracias por confiar en <strong>BeanQuick</strong>! ☕
                                        </p>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td>
                            <table align="center" width="570" cellpadding="0" cellspacing="0" role="presentation"
                                style="margin: 0 auto; text-align: center; width: 570px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="color: #b0adc5; font-size: 12px; margin: 0;">
                                            © {{ date('Y') }} BeanQuick. Todos los derechos reservados.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>