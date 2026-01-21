<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrito;
use App\Models\Producto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class CarritoController extends Controller
{
    /**
     * Mostrar el carrito del usuario autenticado.
     */
    public function index()
    {
        $user = Auth::user();
        $carrito = Carrito::firstOrCreate(['user_id' => $user->id]);

        $productos = $carrito->productos()
            ->with('empresa') // Carga la empresa
            ->withPivot('cantidad')
            ->get()
            ->map(function ($producto) {
                $producto->precio = (float) $producto->precio;
                return $producto;
            });

        return response()->json($productos);
    }

    /**
     * Agregar un producto al carrito.
     */
    public function agregar(Request $request, $productoId): JsonResponse
    {
        $request->validate([
            'cantidad' => 'required|integer|min:1'
        ]);
    
        $user = Auth::user();
        $carrito = Carrito::firstOrCreate(['user_id' => $user->id]);
        
        $carritoProducto = $carrito->productos()->where('producto_id', $productoId)->first();
    
        if ($carritoProducto) {
            $nuevaCantidad = $carritoProducto->pivot->cantidad + $request->cantidad;
            $carrito->productos()->updateExistingPivot($productoId, ['cantidad' => $nuevaCantidad]);
        } else {
            $carrito->productos()->attach($productoId, ['cantidad' => $request->cantidad]);
        }
    
        return response()->json([
            'message' => 'Producto agregado al carrito correctamente.',
            // CORRECCIÓN: Agregamos with('empresa')
            'productos' => $carrito->productos()->with(['empresa'])->withPivot('cantidad')->get()
        ]);
    }

    /**
     * Actualizar cantidad de un producto.
     */
    public function actualizar(Request $request, $productoId): JsonResponse
    {
        $request->validate(['cantidad' => 'required|integer|min:1']);

        $carrito = Carrito::where('user_id', Auth::id())->first();

        if ($carrito) {
            $carrito->productos()->updateExistingPivot($productoId, [
                'cantidad' => $request->cantidad,
            ]);
        }

        return response()->json([
            'message' => 'Cantidad actualizada correctamente.',
            // CORRECCIÓN: Agregamos with('empresa')
            'productos' => $carrito->productos()->with(['empresa'])->withPivot('cantidad')->get()
        ]);
    }

    /**
     * Eliminar un producto del carrito.
     */
    public function eliminar($productoId): JsonResponse
    {
        $carrito = Carrito::where('user_id', Auth::id())->first();

        if ($carrito) {
            $carrito->productos()->detach($productoId);
        }

        return response()->json([
            'message' => 'Producto eliminado del carrito.',
            // CORRECCIÓN: Agregamos with('empresa')
            'productos' => $carrito->productos()->with(['empresa'])->withPivot('cantidad')->get()
        ]);
    }

    /**
     * Vaciar completamente el carrito.
     */
    public function vaciar(): JsonResponse
    {
        $carrito = Carrito::where('user_id', Auth::id())->first();

        if ($carrito) {
            $carrito->productos()->detach();
        }

        return response()->json([
            'message' => 'Carrito vaciado correctamente.',
            'productos' => []
        ]);
    }
}