import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronUp, FaCoffee, FaClock, FaMapMarkerAlt, FaTimesCircle } from 'react-icons/fa';

const MisPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [abierto, setAbierto] = useState(null);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/cliente/mis-pedidos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPedidos(res.data);
        } catch (error) {
            console.error("Error al cargar pedidos", error);
        }
    };

    // --- NUEVA FUNCIÓN PARA CANCELAR ---
    const cancelarPedido = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) return;

        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            await axios.post(`http://127.0.0.1:8000/api/cliente/pedidos/${id}/cancelar`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Opción 1: Quitarlo de la lista inmediatamente
            setPedidos(pedidos.filter(p => p.id !== id));
            alert("Pedido cancelado con éxito.");
        } catch (error) {
            console.error("Error al cancelar", error);
            alert(error.response?.data?.message || "No se pudo cancelar el pedido.");
        }
    };

    const pedidosFiltrados = filtro === 'todos' 
        ? pedidos 
        : pedidos.filter(p => p.estado.toLowerCase() === filtro.toLowerCase());

    const togglePedido = (id) => {
        setAbierto(abierto === id ? null : id);
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'pendiente': return { color: '#f39c12', background: '#fdf5e6' };
            case 'preparando': return { color: '#3498db', background: '#ebf5fb' };
            case 'listo': return { color: '#27ae60', background: '#eafaf1' };
            case 'entregado': return { color: '#7f8c8d', background: '#f4f6f7' };
            case 'cancelado': return { color: '#e74c3c', background: '#f9ebea' };
            default: return { color: '#333', background: '#eee' };
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}><FaCoffee /> Mis Pedidos</h2>

            <div style={styles.filterMenu}>
                {['todos', 'pendiente', 'preparando', 'listo', 'entregado', 'cancelado'].map((estado) => (
                    <button
                        key={estado}
                        onClick={() => setFiltro(estado)}
                        style={{
                            ...styles.filterBtn,
                            ...(filtro === estado ? styles.filterBtnActive : {})
                        }}
                    >
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </button>
                ))}
            </div>
            
            {pedidosFiltrados.length === 0 ? (
                <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
                    No tienes pedidos en estado <strong>{filtro}</strong>.
                </p>
            ) : (
                <div style={styles.list}>
                    {pedidosFiltrados.map((pedido) => (
                        <div key={pedido.id} style={styles.card}>
                            <div style={styles.cardHeader} onClick={() => togglePedido(pedido.id)}>
                                <div style={styles.headerMain}>
                                    <div style={styles.brandContainer}>
                                        <img 
                                            src={pedido.empresa?.logo_url || 'https://via.placeholder.com/30'} 
                                            alt="Logo" 
                                            style={styles.brandLogo} 
                                        />
                                        <div style={styles.brandInfo}>
                                            <span style={styles.brandName}>{pedido.empresa?.nombre || 'Establecimiento'}</span>
                                            <span style={styles.orderId}>Pedido #{pedido.id}</span>
                                        </div>
                                    </div>
                                    <span style={{...styles.statusBadge, ...getStatusStyle(pedido.estado)}}>
                                        {pedido.estado}
                                    </span>
                                </div>
                                <div style={styles.headerSub}>
                                    <span><FaClock /> {pedido.hora_recogida}</span>
                                    <span>${parseFloat(pedido.total).toLocaleString()}</span>
                                    {abierto === pedido.id ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </div>

                            {abierto === pedido.id && (
                                <div style={styles.details}>
                                    <p style={styles.detailInfo}>
                                        <FaMapMarkerAlt style={{color: '#6f4e37'}} /> 
                                        <strong>Lugar:</strong> {pedido.empresa?.direccion}
                                    </p>
                                    
                                    {/* --- BOTÓN DE CANCELAR: Solo si está pendiente --- */}
                                    {pedido.estado.toLowerCase() === 'pendiente' && (
                                        <button 
                                            onClick={() => cancelarPedido(pedido.id)}
                                            style={styles.cancelBtn}
                                        >
                                            <FaTimesCircle /> Cancelar Pedido
                                        </button>
                                    )}

                                    <hr style={styles.divider} />
                                    <div style={styles.prodList}>
                                        {pedido.productos.map((prod) => (
                                            <div key={prod.id} style={styles.prodItem}>
                                                <div style={styles.prodLeft}>
                                                    <img src={prod.imagen_url} alt="" style={styles.miniImg} />
                                                    <div style={styles.prodText}>
                                                        <span style={styles.prodName}>{prod.nombre}</span>
                                                        <span style={styles.prodQty}>Cant: {prod.pivot.cantidad}</span>
                                                    </div>
                                                </div>
                                                <span style={styles.prodSubtotal}>
                                                    ${(prod.precio * prod.pivot.cantidad).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- ESTILOS ADICIONALES ---
const styles = {
    // ... mantén tus estilos anteriores y agrega/modifica estos:
    container: { maxWidth: '600px', margin: '20px auto', padding: '0 20px', paddingBottom: '80px' },
    title: { textAlign: 'center', color: '#6f4e37', marginBottom: '20px' },
    filterMenu: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px' },
    filterBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '14px', color: '#666' },
    filterBtnActive: { background: '#6f4e37', color: 'white', borderColor: '#6f4e37', fontWeight: 'bold' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: { background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #eee' },
    cardHeader: { padding: '15px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' },
    headerMain: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    brandContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
    brandLogo: { width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' },
    brandInfo: { display: 'flex', flexDirection: 'column' },
    brandName: { fontSize: '12px', fontWeight: 'bold', color: '#6f4e37', textTransform: 'uppercase' },
    orderId: { fontWeight: 'bold', fontSize: '15px' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' },
    headerSub: { display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '14px', alignItems: 'center' },
    details: { padding: '15px', background: '#f9f9f9', borderTop: '1px solid #eee' },
    detailInfo: { fontSize: '13px', color: '#555', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' },
    
    // Estilo para el botón de cancelar
    cancelBtn: {
        width: '100%',
        padding: '10px',
        background: '#f9ebea',
        color: '#e74c3c',
        border: '1px solid #e74c3c',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '10px',
        transition: '0.3s'
    },
    
    divider: { border: '0', borderTop: '1px solid #eee', margin: '15px 0' },
    prodItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    prodLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
    miniImg: { width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' },
    prodText: { display: 'flex', flexDirection: 'column' },
    prodName: { fontSize: '14px', fontWeight: '500' },
    prodQty: { fontSize: '12px', color: '#888' },
    prodSubtotal: { fontSize: '14px', fontWeight: 'bold' }
};

export default MisPedidos;