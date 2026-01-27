import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaClock, FaCheck, FaArrowLeft, FaBox, FaUser, FaChevronDown, FaChevronUp, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GestionPedidosEmpresa = () => {
    const [pedidos, setPedidos] = useState([]);
    // CAMBIO: Estado inicial con Mayúscula para coincidir con el ENUM
    const [filtro, setFiltro] = useState('Pendiente'); 
    const [loading, setLoading] = useState(true);
    const [expandido, setExpandido] = useState({}); 
    const navigate = useNavigate();

    // CAMBIO: Lista de estados con Mayúscula inicial
    const estados = ['Pendiente', 'Preparando', 'Listo', 'Entregado'];

    useEffect(() => {
        fetchPedidos();
        const intervalo = setInterval(fetchPedidos, 30000);
        return () => clearInterval(intervalo);
    }, []);

    const fetchPedidos = async () => {
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/empresa/pedidos', {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
            });
            setPedidos(res.data);
        } catch (error) {
            console.error("Error al cargar pedidos", error);
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        const token = localStorage.getItem('AUTH_TOKEN');
        if (!token) {
            alert("Sesión expirada. Por favor inicia sesión nuevamente.");
            return;
        }

        try {
            const res = await axios.patch(`http://127.0.0.1:8000/api/empresa/pedidos/${id}/estado`, 
                { estado: nuevoEstado }, // Enviará 'Preparando', 'Listo', etc.
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    } 
                }
            );
            console.log(res)
            setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
        } catch (error) {
            console.error("Error detallado:", error.response?.data || error.message);
            alert(`No se pudo actualizar: ${error.response?.data?.message || "Error de servidor"}`);
        }
    };

    const togglePedido = (id) => {
        setExpandido(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Filtrado exacto (sensible a mayúsculas)
    const pedidosFiltrados = pedidos.filter(p => p.estado === filtro);

    if (loading) return <div style={styles.center}>Cargando pedidos...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}>
                    <FaArrowLeft /> Volver
                </button>
                <h2 style={styles.title}>Panel de Gestión (Cola de pedidos)</h2>
            </header>

            <div style={styles.filterBar}>
                {estados.map(e => (
                    <button key={e} onClick={() => setFiltro(e)}
                        style={{...styles.filterTab, ...(filtro === e ? styles.activeTab : {})}}>
                        {e} ({pedidos.filter(p => p.estado === e).length})
                    </button>
                ))}
            </div>

            <div style={styles.listContainer}>
                {pedidosFiltrados.length === 0 ? (
                    <div style={styles.empty}>
                        <FaBox size={40} color="#ccc" />
                        <p>Sin pedidos en estado {filtro}</p>
                    </div>
                ) : (
                    pedidosFiltrados.map((pedido, index) => {
                        const esExpandido = expandido[pedido.id];
                        return (
                            <div key={pedido.id} style={styles.card}>
                                <div style={styles.mainRow}>
                                    <div style={styles.infoCol}>
                                        <div style={styles.cardHeader}>
                                            <span style={styles.badgeIndex}>{index + 1}º en cola</span>
                                            <span style={styles.orderId}>Orden #{pedido.id}</span>
                                            <span style={styles.time}><FaClock /> {pedido.hora_recogida}</span>
                                        </div>
                                        <div style={styles.clientName}><FaUser size={12}/> {pedido.cliente?.name}</div>
                                        <button onClick={() => togglePedido(pedido.id)} style={styles.toggleBtn}>
                                            {pedido.productos?.length || 0} items {esExpandido ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    </div>

                                    <div style={styles.actionCol}>
                                        <div style={styles.totalPrice}>${parseFloat(pedido.total).toLocaleString()}</div>
                                        {/* Lógica de botones con estados en Mayúscula */}
                                        {pedido.estado === 'Pendiente' && <button style={styles.btnPrep} onClick={() => cambiarEstado(pedido.id, 'Preparando')}>Cocinar ahora</button>}
                                        {pedido.estado === 'Preparando' && <button style={styles.btnListo} onClick={() => cambiarEstado(pedido.id, 'Listo')}>Listo</button>}
                                        {pedido.estado === 'Listo' && <button style={styles.btnEntregar} onClick={() => cambiarEstado(pedido.id, 'Entregado')}>Entregar</button>}
                                        {pedido.estado === 'Entregado' && <span style={styles.completed}><FaCheck /> Entregado</span>}
                                    </div>
                                </div>

                                {esExpandido && (
                                    <div style={styles.dropdown}>
                                        {pedido.productos.map(prod => (
                                            <div key={prod.id} style={styles.productRow}>
                                                <div style={styles.imgWrapper}>
                                                    {prod.imagen ? (
                                                        <img src={`http://127.0.0.1:8000/storage/${prod.imagen}`} alt={prod.nombre} style={styles.productImg} />
                                                    ) : (
                                                        <div style={styles.noImg}><FaImage /></div>
                                                    )}
                                                </div>
                                                <div style={styles.productDetails}>
                                                    <span style={styles.productName}><strong>{prod.pivot.cantidad}x</strong> {prod.nombre}</span>
                                                    <span style={styles.productPrice}>Subtotal: ${(prod.pivot.precio_unitario * prod.pivot.cantidad).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// ... Tus estilos se mantienen iguales ...
const styles = {
    container: { padding: '15px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
    backBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6f4e37', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' },
    title: { margin: 0, fontSize: '20px', color: '#333' },
    filterBar: { display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' },
    filterTab: { padding: '8px 16px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', borderRadius: '20px', fontSize: '13px', whiteSpace: 'nowrap' },
    activeTab: { background: '#6f4e37', color: 'white', borderColor: '#6f4e37' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
    card: { background: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', overflow: 'hidden' },
    mainRow: { display: 'flex', padding: '15px', alignItems: 'center', justifyContent: 'space-between' },
    infoCol: { flex: 1 },
    cardHeader: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' },
    badgeIndex: { backgroundColor: '#e8f4fd', color: '#2980b9', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
    orderId: { fontWeight: 'bold', fontSize: '16px' },
    time: { color: '#d35400', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' },
    clientName: { fontSize: '14px', color: '#777', marginBottom: '8px' },
    toggleBtn: { background: '#eee', border: 'none', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    actionCol: { textAlign: 'right', minWidth: '130px' },
    totalPrice: { marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#2c3e50' },
    btnPrep: { background: '#3498db', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', width: '100%' },
    btnListo: { background: '#27ae60', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', width: '100%' },
    btnEntregar: { background: '#95a5a6', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', width: '100%' },
    completed: { color: '#27ae60', fontWeight: 'bold', fontSize: '14px' },
    dropdown: { backgroundColor: '#fcfcfc', borderTop: '1px solid #eee', padding: '10px' },
    productRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid #f0f0f0' },
    imgWrapper: { width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#eee' },
    productImg: { width: '100%', height: '100%', objectFit: 'cover' },
    noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' },
    productDetails: { display: 'flex', flexDirection: 'column', flex: 1 },
    productName: { fontSize: '14px', color: '#333' },
    productPrice: { fontSize: '12px', color: '#999' },
    center: { textAlign: 'center', marginTop: '50px' },
    empty: { textAlign: 'center', padding: '40px', color: '#aaa' }
};

export default GestionPedidosEmpresa;