<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Importación de controladores
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\SolicitudEmpresaController;
use App\Http\Controllers\EmpresaActivacionController;
use App\Http\Controllers\CalificacionController;

/* --- RUTAS TOTALMENTE PÚBLICAS --- */
// Ponemos destacados al principio para que Laravel no la confunda con /productos/{id}
Route::get('/productos/destacados', [ProductoController::class, 'destacados']);

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/solicitud-empresa', [SolicitudEmpresaController::class, 'store']);
Route::get('/empresa/validar-token/{token}', [EmpresaActivacionController::class, 'validarToken']);
Route::post('/empresa/activar/{token}', [EmpresaActivacionController::class, 'store']);

Route::get('/categorias', function () {
    return App\Models\Categoria::all();
});

Route::get('/productos/{id}/calificaciones', [CalificacionController::class, 'porProducto']);

/* --- RUTAS PROTEGIDAS (SANCTUM) --- */
Route::middleware('auth:sanctum')->group(function () {

    // Perfil de Usuario
    Route::get('/user', function (Request $request) {
        return $request->user()->load('empresa');
    });

    Route::prefix('profile')->group(function () {
        Route::patch('/', [ClienteController::class, 'updateProfile']);
    });

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    /* --- ROL: ADMIN --- */
    // Cambia la línea por esta:
Route::group(['prefix' => 'admin', 'middleware' => 'auth:sanctum'], function () {// Opcional: añadir middleware de rol
        Route::get('/solicitudes', [AdminController::class, 'dashboard']);
        Route::post('/aprobar/{id}', [AdminController::class, 'aprobar']);
        Route::post('/rechazar/{id}', [AdminController::class, 'rechazar']);
        Route::post('/categorias', function (Request $request) {
            $data = $request->validate(['nombre' => 'required|unique:categorias']);
            return App\Models\Categoria::create($data);
        });
    });

    /* --- ROL: EMPRESA --- */
    Route::prefix('empresa')->group(function () {
        Route::get('/perfil', [EmpresaController::class, 'show']);
        Route::post('/update', [EmpresaController::class, 'update']);

        // Gestión de Productos (CRUD de la Empresa)
        Route::get('/productos', [ProductoController::class, 'index']);
        Route::get('/productos/{producto}', [ProductoController::class, 'show']);
        Route::post('/productos', [ProductoController::class, 'store']);
        Route::put('/productos/{producto}', [ProductoController::class, 'update']);
        Route::delete('/productos/{producto}', [ProductoController::class, 'destroy']);

        Route::get('/pedidos', [PedidoController::class, 'indexEmpresa']);
        Route::patch('/pedidos/{pedido}/estado', [PedidoController::class, 'actualizarEstado']);
    });

    /* --- ROL: CLIENTE --- */
    Route::prefix('cliente')->group(function () {
        Route::get('/empresas', [ClienteController::class, 'indexEmpresas']);
        Route::get('/empresa/{id}', [ClienteController::class, 'showEmpresa']);
        Route::get('/empresa/{id}/productos', [ClienteController::class, 'productosPorEmpresa']);

        Route::prefix('carrito')->group(function () {
            Route::get('/', [CarritoController::class, 'index']);
            Route::post('/agregar/{productoId}', [CarritoController::class, 'agregar']);
            Route::put('/actualizar/{productoId}', [CarritoController::class, 'actualizar']);
            Route::delete('/eliminar/{productoId}', [CarritoController::class, 'eliminar']);
            Route::post('/vaciar', [CarritoController::class, 'vaciar']);
        });

        Route::post('/pedidos', [PedidoController::class, 'store']);
        Route::get('/mis-pedidos', [PedidoController::class, 'indexCliente']);
        Route::post('/pedidos/{id}/cancelar', [PedidoController::class, 'cancelar']);
        
        // Calificaciones
        Route::post('/calificar', [ClienteController::class, 'calificar']);
        Route::get('/mis-calificaciones', [ClienteController::class, 'misCalificaciones']);
        Route::delete('/calificaciones/{id}', [ClienteController::class, 'eliminarCalificacion']);
        Route::patch('/calificaciones/{id}', [ClienteController::class, 'actualizarCalificacion']);
    });
});