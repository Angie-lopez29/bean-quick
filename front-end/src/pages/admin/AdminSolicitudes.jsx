import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTimes, FaSpinner, FaEye } from 'react-icons/fa';

const AdminSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [procesandoId, setProcesandoId] = useState(null);
    const [solicitudExpandida, setSolicitudExpandida] = useState(null); // Para mostrar/ocultar detalles
    const navigate = useNavigate();
    const token = localStorage.getItem('AUTH_TOKEN');

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const fetchSolicitudes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/solicitudes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.solicitudes) {
                setSolicitudes(response.data.solicitudes);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener solicitudes:", error);
            setLoading(false);
        }
    };

    const handleAprobar = async (id) => {
        if (!window.confirm("¿Aprobar esta empresa? Se enviará el correo de activación.")) return;
        setProcesandoId(id);
        try {
            await axios.post(`http://127.0.0.1:8000/api/admin/aprobar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("¡Empresa aprobada!");
            setSolicitudes(solicitudes.filter(s => s.id !== id));
        } catch (error) {
            alert("Error al aprobar."+error);
        } finally {
            setProcesandoId(null);
        }
    };

    // --- NUEVA FUNCIÓN: RECHAZAR ---
    const handleRechazar = async (id) => {
        if (!window.confirm("¿Estás seguro de rechazar esta solicitud?")) return;
        setProcesandoId(id);
        try {
            await axios.post(`http://127.0.0.1:8000/api/admin/rechazar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Solicitud rechazada correctamente.");
            setSolicitudes(solicitudes.filter(s => s.id !== id));
        } catch (error) {
            alert("Error al rechazar la solicitud."+error);
        } finally {
            setProcesandoId(null);
        }
    };

    if (loading) return <div style={styles.loader}><FaSpinner className="spin" /> Cargando solicitudes...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate('/admin/dashboard')} style={styles.backBtn}>
                    <FaArrowLeft /> Volver al Panel
                </button>
                <h1>Gestión de Solicitudes</h1>
            </div>

            <div style={styles.cardContainer}>
                {solicitudes.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Empresa</th>
                                <th>Correo</th>
                                <th>NIT</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((s) => (
                                <React.Fragment key={s.id}>
                                    <tr>
                                        <td style={styles.bold}>{s.nombre}</td>
                                        <td>{s.correo}</td>
                                        <td>{s.nit}</td>
                                        <td style={styles.actions}>
                                            <button 
                                                onClick={() => setSolicitudExpandida(solicitudExpandida === s.id ? null : s.id)}
                                                style={styles.btnDetail}
                                            >
                                                <FaEye /> {solicitudExpandida === s.id ? 'Cerrar' : 'Ver todo'}
                                            </button>
                                            <button 
                                                onClick={() => handleAprobar(s.id)} 
                                                style={styles.btnApprove}
                                                disabled={procesandoId === s.id}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button 
                                                onClick={() => handleRechazar(s.id)} 
                                                style={styles.btnReject}
                                                disabled={procesandoId === s.id}
                                            >
                                                <FaTimes />
                                            </button>
                                        </td>
                                    </tr>
                                    {/* SECCIÓN DETALLADA EXPANDIBLE */}
                                    {solicitudExpandida === s.id && (
                                        <tr style={styles.expandRow}>
                                            <td colSpan="4">
                                                <div style={styles.detailGrid}>
                                                    <div>
                                                        <p><strong>Teléfono:</strong> {s.telefono}</p>
                                                        <p><strong>Dirección:</strong> {s.direccion}</p>
                                                        <p><strong>Descripción:</strong> {s.descripcion}</p>
                                                    </div>
                                                    <div style={styles.imageBox}>
                                                        <div>
                                                            <p><strong>Logo:</strong></p>
                                                            <img src={s.logo_url} alt="Logo" style={styles.previewImg} />
                                                        </div>
                                                        <div>
                                                            <p><strong>Local:</strong></p>
                                                            <img src={s.foto_local_url} alt="Local" style={styles.previewImg} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={styles.noData}><p>No hay solicitudes pendientes.</p></div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
    backBtn: { background: '#6f4e37', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    cardContainer: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    bold: { fontWeight: 'bold' },
    actions: { display: 'flex', gap: '8px', padding: '10px' },
    btnDetail: { backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    btnApprove: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
    btnReject: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
    expandRow: { backgroundColor: '#f9f9f9', borderBottom: '2px solid #6f4e37' },
    detailGrid: { padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    imageBox: { display: 'flex', gap: '20px' },
    previewImg: { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' },
    noData: { padding: '40px', textAlign: 'center', color: '#888' },
    loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem' }
};

export default AdminSolicitudes;