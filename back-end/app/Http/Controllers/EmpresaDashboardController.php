<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use App\Models\Empresa;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Calificacion;

use Barryvdh\DomPDF\Facade\Pdf;

class EmpresaDashboardController extends Controller
{
    private function obtenerDatosDashboard($user, string $periodo = 'semana'): array
    {
        $empresa = Empresa::where('user_id', $user->id)->first();

        if (!$empresa) {
            throw new \Exception('No tienes una empresa asociada');
        }

        $estadosExitosos = ['entregado', 'Entregado', 'ENTREGADO'];

        // RANGO DE FECHAS SEGÚN PERIODO
        switch ($periodo) {
            case 'dia':
                $fechaInicio = Carbon::today()->startOfDay();
                $fechaFin    = Carbon::today()->endOfDay();
                break;
            case 'mes':
                $fechaInicio = Carbon::now()->startOfMonth();
                $fechaFin    = Carbon::now()->endOfMonth();
                break;
            case 'anio':
                $fechaInicio = Carbon::now()->startOfYear();
                $fechaFin    = Carbon::now()->endOfYear();
                break;
            case 'semana':
            default:
                $fechaInicio = Carbon::now()->subDays(6)->startOfDay();
                $fechaFin    = Carbon::now()->endOfDay();
                break;
        }

        // VENTAS EN EL PERIODO (mismo nombre ventas_hoy para no romper el frontend)
        $ventasHoy = Pedido::where('empresa_id', $empresa->id)
            ->whereIn('estado', $estadosExitosos)
            ->whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->sum('total') ?? 0;

        // CALIFICACIONES (igual que el original, sin filtro de fecha)
        $statsCalificaciones = Calificacion::whereHas('producto', function ($q) use ($empresa) {
            $q->where('empresa_id', $empresa->id);
        })
        ->selectRaw('COUNT(*) as total, AVG(estrellas) as promedio')
        ->first();

        // GRÁFICO SEGÚN PERIODO
        $ventasGrafico = [];

        if ($periodo === 'dia') {
            $labels = [];
            for ($h = 0; $h < 24; $h++) {
                $labels[str_pad($h, 2, '0', STR_PAD_LEFT) . 'h'] = 0;
            }
            $ventasReales = Pedido::where('empresa_id', $empresa->id)
                ->whereIn('estado', $estadosExitosos)
                ->whereBetween('created_at', [$fechaInicio, $fechaFin])
                ->selectRaw('DATE_FORMAT(created_at, "%Hh") as label, SUM(total) as total')
                ->groupBy('label')
                ->get();
            foreach ($ventasReales as $v) {
                if (isset($labels[$v->label])) {
                    $labels[$v->label] = round((float)$v->total, 2);
                }
            }
            foreach ($labels as $label => $total) {
                $ventasGrafico[] = ['label' => $label, 'total' => $total];
            }

        } elseif ($periodo === 'semana') {
            // IGUAL QUE EL ORIGINAL
            $labels = [];
            for ($i = 6; $i >= 0; $i--) {
                $labels[now()->subDays($i)->format('d/m')] = 0;
            }
            $ventasReales = Pedido::where('empresa_id', $empresa->id)
                ->whereIn('estado', $estadosExitosos)
                ->where('created_at', '>=', now()->subDays(6)->startOfDay())
                ->selectRaw('DATE_FORMAT(created_at, "%d/%m") as label, SUM(total) as total')
                ->groupBy('label')
                ->get();
            foreach ($ventasReales as $v) {
                if (isset($labels[$v->label])) {
                    $labels[$v->label] = round((float)$v->total, 2);
                }
            }
            foreach ($labels as $label => $total) {
                $ventasGrafico[] = ['label' => $label, 'total' => $total];
            }

        } elseif ($periodo === 'mes') {
            $diasEnMes = Carbon::now()->daysInMonth;
            $labels = [];
            for ($d = 1; $d <= $diasEnMes; $d++) {
                $labels[str_pad($d, 2, '0', STR_PAD_LEFT)] = 0;
            }
            $ventasReales = Pedido::where('empresa_id', $empresa->id)
                ->whereIn('estado', $estadosExitosos)
                ->whereBetween('created_at', [$fechaInicio, $fechaFin])
                ->selectRaw('DATE_FORMAT(created_at, "%d") as label, SUM(total) as total')
                ->groupBy('label')
                ->get();
            foreach ($ventasReales as $v) {
                if (isset($labels[$v->label])) {
                    $labels[$v->label] = round((float)$v->total, 2);
                }
            }
            foreach ($labels as $label => $total) {
                $ventasGrafico[] = ['label' => $label, 'total' => $total];
            }

        } elseif ($periodo === 'anio') {
            // IGUAL QUE EL ORIGINAL ventas_anuales
            $ventasReales = Pedido::where('empresa_id', $empresa->id)
                ->whereIn('estado', $estadosExitosos)
                ->whereYear('created_at', date('Y'))
                ->selectRaw('MONTHNAME(created_at) as label, SUM(total) as total')
                ->groupBy('label')
                ->orderByRaw('MIN(created_at)')
                ->get();
            foreach ($ventasReales as $v) {
                $ventasGrafico[] = ['label' => $v->label, 'total' => round((float)$v->total, 2)];
            }
        }

        // TOP PRODUCTOS (igual que el original)
        $topProductos = Producto::where('empresa_id', $empresa->id)
            ->withSum(['pedidos as total_unidades' => function ($query) use ($estadosExitosos) {
                $query->whereIn('estado', $estadosExitosos);
            }], 'pedido_productos.cantidad')
            ->orderBy('total_unidades', 'desc')
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'nombre' => $p->nombre,
                    'ventas' => (int)($p->total_unidades ?? 0),
                    'imagen' => $p->imagen_url,
                    'precio' => $p->precio
                ];
            });

        // ÚLTIMOS PEDIDOS (igual que el original)
        $ultimosPedidos = Pedido::where('empresa_id', $empresa->id)
            ->with('cliente:id,name')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($pedido) {
                return [
                    'id'      => $pedido->id,
                    'cliente' => $pedido->cliente->name ?? 'Cliente Anónimo',
                    'total'   => $pedido->total,
                    'estado'  => $pedido->estado,
                    'hora'    => $pedido->created_at->diffForHumans()
                ];
            });

        return [
            'empresa'     => $empresa,
            'periodo'     => $periodo,
            'stats_cards' => [
                'ventas_hoy'            => round((float)$ventasHoy, 2), // mismo nombre que el original
                'promedio_calificacion' => round($statsCalificaciones->promedio ?? 0, 1),
                'total_calificaciones'  => $statsCalificaciones->total ?? 0,
            ],
            'charts' => [
                'ventas_semanales' => $ventasGrafico, // mismo nombre que el original
                'ventas_anuales'   => $ventasGrafico, // mismo nombre que el original
            ],
            'top_productos'   => $topProductos,
            'ultimos_pedidos' => $ultimosPedidos
        ];
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $periodo = $request->query('periodo', 'semana');
            $periodosValidos = ['dia', 'semana', 'mes', 'anio'];

            if (!in_array($periodo, $periodosValidos)) {
                $periodo = 'semana';
            }

            $data = $this->obtenerDatosDashboard(Auth::user(), $periodo);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Error en el servidor',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }

    public function descargarReporte(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'No autenticado');
        }

        $periodo = $request->query('periodo', 'semana');
        $data    = $this->obtenerDatosDashboard($user, $periodo);

        $pdf = Pdf::loadView('pdf.dashboard_empresa', [
            'data' => $data
        ])->setPaper('a4', 'portrait');

        return $pdf->download('reporte-dashboard-empresa.pdf');
    }

    public function calificaciones(Request $request): JsonResponse
    {
        try {
            $user    = $request->user();
            $empresa = Empresa::where('user_id', $user->id)->first();

            if (!$empresa) {
                return response()->json([
                    'error' => 'No se encontró una empresa vinculada a este usuario.'
                ], 404);
            }

            $calificaciones = Calificacion::whereHas('producto', function ($query) use ($empresa) {
                $query->where('empresa_id', $empresa->id);
            })
            ->with([
                'usuario:id,name',
                'producto:id,nombre'
            ])
            ->latest()
            ->get();

            return response()->json($calificaciones);

        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Error interno al obtener calificaciones',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }
}