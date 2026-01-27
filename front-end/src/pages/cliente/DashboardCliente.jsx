import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const DashboardCliente = () => {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userName = localStorage.getItem('USER_NAME');

    useEffect(() => {
        const obtenerEmpresas = async () => {
            try {
                const token = localStorage.getItem('AUTH_TOKEN');

                // Petición a tu ruta de Laravel
                const response = await axios.get('http://127.0.0.1:8000/api/cliente/empresas', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmpresas(response.data);
            } catch (error) {
                console.error("Error al cargar empresas:", error);
                if (error.response?.status === 401) {
                    navigate('/login'); // Si el token expiró, lo mandamos al login
                }
            } finally {
                setLoading(false);
            }
        };

        obtenerEmpresas();
    }, [navigate]);

    return (
        <div className="container" style={{ padding: '20px' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1>Hola, {userName} ☕</h1>
                <p>¿Qué café se te antoja hoy? Elige una cafetería para ver su menú.</p>
            </header>

            {loading ? (
                <p>Cargando cafeterías...</p>
            ) : (
                <div className="grid-empresas" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px'
                }}>
                    {empresas.length > 0 ? (
                        empresas.map((empresa) => (
                            <div key={empresa.id} className="card-empresa" style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                textAlign: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                                {/* Si tienes logos, puedes usar la URL de tu backend */}
                                <img
                                    src={empresa.logo ? `http://127.0.0.1:8000/storage/${empresa.logo}` : 'https://via.placeholder.com/150'}
                                    alt={empresa.nombre}
                                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                                <h3 style={{ marginTop: '10px' }}>{empresa.nombre}</h3>
                                <p style={{ fontSize: '14px', color: '#666' }}>{empresa.descripcion}</p>

                                <button
                                    onClick={() => navigate(`/tienda/${empresa.id}`)} // <-- RUTA CORREGIDA
                                    style={{
                                        marginTop: '15px',
                                        backgroundColor: '#1a1a1a', // Negro para que combine con tu panel de empresa
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 20px',
                                        borderRadius: '25px', // Botón más redondeado y moderno
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        width: '100%',
                                        transition: '0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#1a1a1a'}
                                >
                                    Explorar Menú ☕
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No hay cafeterías disponibles en este momento.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardCliente;