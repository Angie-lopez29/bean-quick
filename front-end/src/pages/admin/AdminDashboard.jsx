import React from 'react';
import { useNavigate } from 'react-router-dom';
// CAMBIO: FaUsersCog en lugar de FaUsersConfig
import { FaUsersCog, FaStoreAlt, FaUserCheck, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const adminName = localStorage.getItem('USER_NAME') || 'Administrador';

    const modules = [
        {
            id: 1,
            title: 'Solicitudes de Registro',
            description: 'Nuevas empresas que quieren unirse. Aprueba o rechaza sus cuentas.',
            icon: <FaUserCheck size={40} />,
            route: '/admin/solicitudes', 
            color: '#e67e22', 
            badge: 'Pendientes'
        },
        {
            id: 2,
            title: 'Gestión de Empresas',
            description: 'Listado de todos los locales activos. Puedes suspender o editar cuentas.',
            icon: <FaStoreAlt size={40} />,
            route: '/admin/empresas',
            color: '#2980b9',
        },
        {
            id: 3,
            title: 'Usuarios del Sistema',
            description: 'Control de clientes registrados y roles de usuario.',
            icon: <FaUsersCog size={40} />, // Icono corregido aquí
            route: '/admin/usuarios',
            color: '#8e44ad',
        }
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.welcome}>Panel de Administración Global</h1>
                    <p style={styles.roleTag}>Sesión iniciada como: {adminName} • Control Total</p>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <FaSignOutAlt /> Cerrar Sesión
                </button>
            </header>

            <div style={styles.grid}>
                {modules.map((module) => (
                    <div 
                        key={module.id} 
                        style={styles.card} 
                        onClick={() => navigate(module.route)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.borderColor = module.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = '#eee';
                        }}
                    >
                        <div style={{ ...styles.iconWrapper, color: module.color }}>
                            {module.icon}
                        </div>
                        <div style={styles.cardBody}>
                            <h3 style={styles.cardTitle}>{module.title}</h3>
                            <p style={styles.cardDesc}>{module.description}</p>
                            {module.badge && (
                                <span style={{...styles.badge, backgroundColor: module.color}}>
                                    {module.badge}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #ddd', paddingBottom: '20px' },
    welcome: { margin: 0, fontSize: '1.8rem', color: '#1a1a1a' },
    roleTag: { margin: '5px 0 0', color: '#e74c3c', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' },
    logoutBtn: { backgroundColor: '#fff', border: '1px solid #c0392b', color: '#c0392b', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' },
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'flex-start', gap: '20px', border: '1px solid #eee' },
    iconWrapper: { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px' },
    cardBody: { textAlign: 'left' },
    cardTitle: { margin: '0 0 10px 0', fontSize: '1.25rem', color: '#2c3e50' },
    cardDesc: { color: '#7f8c8d', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 },
    badge: { display: 'inline-block', marginTop: '12px', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }
};

export default AdminDashboard;