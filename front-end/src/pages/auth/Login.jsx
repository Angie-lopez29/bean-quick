// ========================================
// IMPORTACIONES - Traemos las herramientas que necesitamos
// ========================================

// React y useState: nos permite crear componentes y manejar datos que cambian
import React, { useState } from 'react';

// axios: herramienta para comunicarnos con el servidor (como hacer llamadas telefónicas a la base de datos)
import axios from 'axios';

// useNavigate: nos permite cambiar de página dentro de la aplicación
import { useNavigate } from 'react-router-dom';

// Iconos bonitos para decorar el formulario (sobre, candado, café, flecha)
import { FaEnvelope, FaLock, FaCoffee, FaArrowRight } from 'react-icons/fa';

// ========================================
// CONFIGURACIÓN
// ========================================

// La dirección del servidor donde está nuestra base de datos
// Es como la dirección de una casa: sabemos dónde ir a buscar la información
const API_URL = 'http://127.0.0.1:8000/api';

// ========================================
// COMPONENTE PRINCIPAL - Login
// ========================================
const Login = () => {
    // ========================================
    // ESTADOS - Variables que pueden cambiar
    // ========================================
    
    // formData: guarda lo que el usuario escribe (email y contraseña)
    // Al inicio está vacío: { email: '', password: '' }
    const [formData, setFormData] = useState({ email: '', password: '' });
    
    // error: guarda mensajes de error si algo sale mal (ej: "contraseña incorrecta")
    // Al inicio está vacío
    const [error, setError] = useState('');
    
    // loading: indica si estamos esperando respuesta del servidor
    // Es como una luz de "cargando..." - empieza en false (apagada)
    const [loading, setLoading] = useState(false);
    
    // focusedInput: recuerda qué campo está activo (email o password)
    // Esto nos ayuda a cambiar el color del borde cuando alguien está escribiendo
    const [focusedInput, setFocusedInput] = useState('');
    
    // navigate: función para cambiar de página
    const navigate = useNavigate();

    // ========================================
    // FUNCIÓN 1: Cuando el usuario escribe algo
    // ========================================
    const handleChange = (e) => {
        // e.target.name: es el nombre del campo (email o password)
        // e.target.value: es lo que el usuario escribió
        
        // Actualizamos formData manteniendo los datos anteriores (...)
        // y cambiando solo el campo que se está editando
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ========================================
    // FUNCIÓN 2: Cuando el usuario envía el formulario
    // ========================================
    const handleSubmit = async (e) => {
        // Evitamos que la página se recargue (comportamiento por defecto)
        e.preventDefault();
        
        // Limpiamos cualquier error anterior
        setError('');
        
        // Activamos el estado de "cargando" (loading = true)
        setLoading(true);
        
        try {
            // Intentamos enviar los datos al servidor
            // Es como tocar la puerta del servidor y darle el email y contraseña
            const response = await axios.post(`${API_URL}/login`, formData);
            
            // Extraemos la información que nos devuelve el servidor
            const { token, user, status } = response.data;
            
            // Si el servidor dice "success" (éxito)
            if (status === 'success') {
                // Guardamos el token (como una llave de acceso) en el navegador
                localStorage.setItem('AUTH_TOKEN', token);
                
                // Guardamos el rol del usuario (cliente, empresa o admin)
                localStorage.setItem('USER_ROLE', user.rol);
                
                // Guardamos el nombre del usuario
                localStorage.setItem('USER_NAME', user.name);
                
                // Configuramos axios para que siempre envíe el token en futuras peticiones
                // Es como mostrar tu credencial cada vez que pides algo
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Creamos un mapa de rutas: cada tipo de usuario va a su página
                const routes = { 
                    cliente: '/cliente/dashboard',  // Clientes van aquí
                    empresa: '/empresa/panel',      // Empresas van aquí
                    admin: '/admin/dashboard'       // Administradores van aquí
                };
                
                // Enviamos al usuario a su página correspondiente según su rol
                // Si el rol no existe, lo enviamos a la página principal '/'
                navigate(routes[user.rol] || '/');
                
                // Recargamos la página para que los cambios se apliquen
                window.location.reload();
            }
        } catch (err) {
            // Si algo sale mal (contraseña incorrecta, sin internet, etc.)
            // Mostramos el mensaje de error que nos envió el servidor
            // Si no hay mensaje específico, mostramos "Error de conexión"
            setError(err.response?.data.message || 'Error de conexión');
        } finally {
            // Pase lo que pase (éxito o error), apagamos el estado de "cargando"
            setLoading(false);
        }
    };

    // ========================================
    // PARTE VISUAL - Lo que se muestra en pantalla
    // ========================================
    return (
        <div style={styles.page}>
            {/* ========================================
                DECORACIONES DE FONDO - Círculos decorativos
                ======================================== */}
            <div style={styles.bgCircle1} /> {/* Círculo grande arriba-derecha */}
            <div style={styles.bgCircle2} /> {/* Círculo mediano abajo-izquierda */}
            <div style={styles.bgCircle3} /> {/* Círculo pequeño en el centro */}

            <div style={styles.container}>
                {/* ========================================
                    PANEL IZQUIERDO - Información de la marca
                    ======================================== */}
                <div style={styles.leftPanel}>
                    {/* Sección del logo y nombre de la marca */}
                    <div style={styles.brandSection}>
                        {/* Círculo con el ícono de café */}
                        <div style={styles.logoCircle}>
                            <FaCoffee style={styles.logoIcon} />
                        </div>
                        {/* Nombre de la aplicación */}
                        <h1 style={styles.brandTitle}>Bean Quick</h1>
                        {/* Frase descriptiva */}
                        <p style={styles.brandTagline}>Tu café favorito, a un click de distancia</p>
                    </div>

                    {/* Caja con las características del servicio */}
                    <div style={styles.featuresBox}>
                        {/* Característica 1 */}
                        <div style={styles.featureItem}>
                            <div style={styles.featureBullet}>✓</div>
                            <span style={styles.featureText}>Entrega en 30 minutos</span>
                        </div>
                        {/* Característica 2 */}
                        <div style={styles.featureItem}>
                            <div style={styles.featureBullet}>✓</div>
                            <span style={styles.featureText}>Café de especialidad premium</span>
                        </div>
                        {/* Característica 3 */}
                        <div style={styles.featureItem}>
                            <div style={styles.featureBullet}>✓</div>
                            <span style={styles.featureText}>Programa de recompensas</span>
                        </div>
                    </div>

                    {/* Banner promocional para empresas */}
                    <div style={styles.businessBanner}>
                        <p style={styles.businessQuestion}>¿Eres una empresa?</p>
                        <button style={styles.businessBtn}>
                            Únete ahora →
                        </button>
                    </div>
                </div>

                {/* ========================================
                    PANEL DERECHO - FORMULARIO DE LOGIN
                    ======================================== */}
                <div style={styles.rightPanel}>
                    <div style={styles.formWrapper}>
                        {/* Encabezado de bienvenida */}
                        <div style={styles.header}>
                            <h2 style={styles.welcomeTitle}>¡Bienvenido de vuelta!</h2>
                            <p style={styles.welcomeSubtitle}>Inicia sesión para continuar</p>
                        </div>

                        {/* Caja de error - solo se muestra si hay un error */}
                        {error && (
                            <div style={styles.errorBox}>
                                <span style={styles.errorIcon}>⚠</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* FORMULARIO PRINCIPAL */}
                        <form onSubmit={handleSubmit} style={styles.form}>
                            {/* ========================================
                                CAMPO DE EMAIL
                                ======================================== */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Correo electrónico</label>
                                <div style={{
                                    ...styles.inputBox,
                                    // Si este campo está enfocado, aplicamos estilos especiales
                                    ...(focusedInput === 'email' ? styles.inputBoxFocused : {})
                                }}>
                                    {/* Ícono de sobre */}
                                    <FaEnvelope style={styles.inputIcon} />
                                    <input
                                        type="email"
                                        name="email"
                                        style={styles.input}
                                        placeholder="tu@correo.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        // Cuando el usuario hace clic aquí
                                        onFocus={() => setFocusedInput('email')}
                                        // Cuando el usuario sale del campo
                                        onBlur={() => setFocusedInput('')}
                                        required // Este campo es obligatorio
                                    />
                                </div>
                            </div>

                            {/* ========================================
                                CAMPO DE CONTRASEÑA
                                ======================================== */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Contraseña</label>
                                <div style={{
                                    ...styles.inputBox,
                                    // Si este campo está enfocado, aplicamos estilos especiales
                                    ...(focusedInput === 'password' ? styles.inputBoxFocused : {})
                                }}>
                                    {/* Ícono de candado */}
                                    <FaLock style={styles.inputIcon} />
                                    <input
                                        type="password"
                                        name="password"
                                        style={styles.input}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        // Cuando el usuario hace clic aquí
                                        onFocus={() => setFocusedInput('password')}
                                        // Cuando el usuario sale del campo
                                        onBlur={() => setFocusedInput('')}
                                        required // Este campo es obligatorio
                                    />
                                </div>
                            </div>

                            {/* Link de "¿Olvidaste tu contraseña?" */}
                            <div style={styles.forgotSection}>
                                <a href="#!" style={styles.forgotLink}>
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>

                            {/* ========================================
                                BOTÓN DE ENVIAR
                                ======================================== */}
                            <button 
                                type="submit" 
                                style={{
                                    ...styles.submitBtn,
                                    // Si está cargando, aplicamos estilos de deshabilitado
                                    ...(loading ? styles.submitBtnDisabled : {})
                                }}
                                disabled={loading} // Deshabilitamos el botón mientras carga
                                // Efecto hover: cuando el mouse pasa por encima
                                onMouseEnter={(e) => {
                                    if (!loading) e.target.style.transform = 'translateY(-2px)';
                                }}
                                // Cuando el mouse sale del botón
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Si está cargando, mostramos un spinner y texto "Procesando..." */}
                                {loading ? (
                                    <>
                                        <span style={styles.spinner} />
                                        Procesando...
                                    </>
                                ) : (
                                    // Si no está cargando, mostramos el texto normal y una flecha
                                    <>
                                        Iniciar sesión
                                        <FaArrowRight style={styles.arrowIcon} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* ========================================
                            DIVISOR CON TEXTO "o"
                            ======================================== */}
                        <div style={styles.divider}>
                            <span style={styles.dividerLine} /> {/* Línea izquierda */}
                            <span style={styles.dividerText}>o</span> {/* Texto */}
                            <span style={styles.dividerLine} /> {/* Línea derecha */}
                        </div>

                        {/* ========================================
                            SECCIÓN DE REGISTRO
                            ======================================== */}
                        <div style={styles.signupSection}>
                            <span style={styles.signupText}>¿No tienes cuenta?</span>
                            <a href="#!" style={styles.signupLink}>Regístrate gratis</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========================================
// ESTILOS - Toda la apariencia visual
// ========================================
const styles = {
    // Contenedor de toda la página
    page: {
        minHeight: '100vh', // Ocupa toda la altura de la pantalla
        background: 'linear-gradient(135deg, #FBF8F3 0%, #F5EBE0 50%, #EFE1D1 100%)', // Degradado de colores beige
        display: 'flex', // Usar flexbox para centrar
        alignItems: 'center', // Centrar verticalmente
        justifyContent: 'center', // Centrar horizontalmente
        padding: '20px', // Espacio alrededor
        fontFamily: "'Inter', -apple-system, sans-serif", // Tipo de letra
        position: 'relative', // Para posicionar elementos hijos
        overflow: 'hidden' // Ocultar lo que salga de los bordes
    },
    
    // Círculo decorativo 1 (arriba-derecha)
    bgCircle1: {
        position: 'absolute', // Posición fija
        width: '500px',
        height: '500px',
        borderRadius: '50%', // Hacerlo circular
        background: 'radial-gradient(circle, rgba(139, 94, 60, 0.1) 0%, transparent 70%)', // Degradado radial
        top: '-150px', // Posición desde arriba (negativo = fuera de vista parcialmente)
        right: '-150px', // Posición desde la derecha
        pointerEvents: 'none' // No interfiere con clics del mouse
    },
    
    // Círculo decorativo 2 (abajo-izquierda)
    bgCircle2: {
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(111, 78, 55, 0.08) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-100px',
        pointerEvents: 'none'
    },
    
    // Círculo decorativo 3 (centro)
    bgCircle3: {
        position: 'absolute',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(160, 129, 108, 0.06) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Centrar perfectamente
        pointerEvents: 'none'
    },
    
    // Contenedor principal blanco
    container: {
        width: '100%',
        maxWidth: '1100px', // Ancho máximo
        minHeight: '700px', // Altura mínima
        backgroundColor: '#FFFFFF', // Fondo blanco
        borderRadius: '24px', // Esquinas redondeadas
        display: 'flex', // Dividir en dos paneles
        boxShadow: '0 30px 60px rgba(62, 39, 35, 0.12)', // Sombra suave
        overflow: 'hidden', // Ocultar lo que salga
        position: 'relative',
        zIndex: 1 // Aparecer encima de los círculos decorativos
    },
    
    // Panel izquierdo (café/marrón)
    leftPanel: {
        flex: 1, // Ocupa 1 parte del espacio
        background: 'linear-gradient(165deg, #6F4E37 0%, #8B5E3C 50%, #A0816C 100%)', // Degradado marrón
        padding: '60px 50px',
        display: 'flex',
        flexDirection: 'column', // Elementos en columna
        justifyContent: 'space-between', // Espaciar elementos
        position: 'relative',
        overflow: 'hidden'
    },
    
    // Sección de la marca (logo + nombre)
    brandSection: {
        textAlign: 'center',
        color: '#FFFFFF' // Texto blanco
    },
    
    // Círculo que contiene el logo
    logoCircle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%', // Circular
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Blanco semi-transparente
        backdropFilter: 'blur(10px)', // Efecto de desenfoque
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 25px', // Centrado con margen abajo
        border: '2px solid rgba(255, 255, 255, 0.2)' // Borde blanco suave
    },
    
    // Ícono del café dentro del círculo
    logoIcon: {
        fontSize: '2.5rem',
        color: '#FFFFFF'
    },
    
    // Título "Bean Quick"
    brandTitle: {
        fontSize: '2.8rem',
        fontWeight: '800', // Muy negrita
        marginBottom: '15px',
        letterSpacing: '-0.5px' // Letras más juntas
    },
    
    // Subtítulo "Tu café favorito..."
    brandTagline: {
        fontSize: '1.05rem',
        opacity: 0.9, // Ligeramente transparente
        fontWeight: '400',
        lineHeight: 1.6
    },
    
    // Caja con las características
    featuresBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Blanco semi-transparente
        backdropFilter: 'blur(10px)', // Efecto vidrio esmerilado
        borderRadius: '16px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.15)'
    },
    
    // Cada elemento de característica
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        color: '#FFFFFF'
    },
    
    // Círculo con el check (✓)
    featureBullet: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '15px',
        fontSize: '0.85rem',
        fontWeight: 'bold'
    },
    
    // Texto de la característica
    featureText: {
        fontSize: '0.95rem',
        fontWeight: '500'
    },
    
    // Banner "¿Eres una empresa?"
    businessBanner: {
        textAlign: 'center',
        color: '#FFFFFF'
    },
    
    // Pregunta del banner
    businessQuestion: {
        fontSize: '0.95rem',
        marginBottom: '15px',
        opacity: 0.9
    },
    
    // Botón "Únete ahora"
    businessBtn: {
        backgroundColor: 'transparent', // Sin fondo
        border: '2px solid rgba(255, 255, 255, 0.3)', // Borde blanco
        color: '#FFFFFF',
        padding: '12px 32px',
        borderRadius: '50px', // Muy redondeado
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer', // Manita al pasar el mouse
        transition: 'all 0.3s', // Animación suave
        backdropFilter: 'blur(10px)'
    },
    
    // Panel derecho (formulario)
    rightPanel: {
        flex: 1.3, // Ocupa 1.3 partes del espacio (más grande que el izquierdo)
        padding: '60px 70px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    
    // Envoltorio del formulario
    formWrapper: {
        width: '100%',
        maxWidth: '450px'
    },
    
    // Encabezado del formulario
    header: {
        marginBottom: '40px'
    },
    
    // Título "¡Bienvenido de vuelta!"
    welcomeTitle: {
        fontSize: '2.4rem',
        color: '#3E2723', // Marrón oscuro
        fontWeight: '800',
        marginBottom: '8px',
        letterSpacing: '-0.5px'
    },
    
    // Subtítulo "Inicia sesión para continuar"
    welcomeSubtitle: {
        fontSize: '1rem',
        color: '#8D6E63', // Marrón claro
        fontWeight: '400'
    },
    
    // Caja de error (cuando hay un error)
    errorBox: {
        backgroundColor: '#FEF2F2', // Fondo rojo suave
        border: '1px solid #FCA5A5', // Borde rojo
        color: '#B91C1C', // Texto rojo oscuro
        padding: '14px 18px',
        borderRadius: '12px',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    
    // Ícono de advertencia en la caja de error
    errorIcon: {
        fontSize: '1.1rem'
    },
    
    // Formulario completo
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px' // Espacio entre elementos
    },
    
    // Grupo de input (label + input)
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    
    // Etiqueta del input (ej: "Correo electrónico")
    label: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#5D4037',
        letterSpacing: '0.3px'
    },
    
    // Caja que contiene el input
    inputBox: {
        position: 'relative', // Para posicionar el ícono
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FAFAFA', // Gris muy claro
        borderRadius: '14px',
        border: '2px solid #E8E0D8', // Borde beige
        transition: 'all 0.3s' // Animación suave
    },
    
    // Estilos cuando el input está enfocado (activo)
    inputBoxFocused: {
        backgroundColor: '#FFFFFF', // Blanco puro
        borderColor: '#8B5E3C', // Borde marrón
        boxShadow: '0 0 0 4px rgba(139, 94, 60, 0.1)' // Sombra suave alrededor
    },
    
    // Ícono dentro del input (sobre o candado)
    inputIcon: {
        position: 'absolute',
        left: '18px', // Posición desde la izquierda
        color: '#A0816C',
        fontSize: '1.1rem'
    },
    
    // Campo de texto del input
    input: {
        width: '100%',
        padding: '16px 18px 16px 52px', // Más padding izquierdo para dejar espacio al ícono
        border: 'none', // Sin borde (lo tiene el inputBox)
        backgroundColor: 'transparent', // Transparente
        fontSize: '1rem',
        color: '#3E2723',
        outline: 'none', // Sin borde al hacer foco
        fontWeight: '500'
    },
    
    // Sección de "¿Olvidaste tu contraseña?"
    forgotSection: {
        textAlign: 'right', // Alineado a la derecha
        marginTop: '-8px' // Subir un poco
    },
    
    // Link "¿Olvidaste tu contraseña?"
    forgotLink: {
        color: '#8B5E3C',
        textDecoration: 'none', // Sin subrayado
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'color 0.3s'
    },
    
    // Botón principal "Iniciar sesión"
    submitBtn: {
        backgroundColor: '#8B5E3C', // Marrón
        color: '#FFFFFF',
        padding: '18px',
        border: 'none',
        borderRadius: '14px',
        fontSize: '1.05rem',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px', // Espacio entre texto e ícono
        boxShadow: '0 12px 24px rgba(139, 94, 60, 0.25)', // Sombra grande
        transition: 'all 0.3s',
        marginTop: '10px'
    },
    
    // Botón deshabilitado (cuando está cargando)
    submitBtnDisabled: {
        backgroundColor: '#A0816C', // Marrón más claro
        cursor: 'not-allowed', // Cursor de prohibido
        boxShadow: '0 8px 16px rgba(139, 94, 60, 0.15)' // Sombra más pequeña
    },
    
    // Ícono de flecha en el botón
    arrowIcon: {
        fontSize: '1rem'
    },
    
    // Spinner (círculo girando) cuando está cargando
    spinner: {
        width: '18px',
        height: '18px',
        border: '3px solid rgba(255, 255, 255, 0.3)', // Borde gris
        borderTop: '3px solid #FFFFFF', // Borde blanco arriba
        borderRadius: '50%', // Circular
        animation: 'spin 0.8s linear infinite' // Animación de giro infinito
    },
    
    // Divisor con líneas y texto "o"
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        margin: '35px 0'
    },
    
    // Línea del divisor
    dividerLine: {
        flex: 1, // Ocupa todo el espacio disponible
        height: '1px',
        backgroundColor: '#E8E0D8'
    },
    
    // Texto "o" en el divisor
    dividerText: {
        color: '#A0816C',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    
    // Sección de registro
    signupSection: {
        textAlign: 'center'
    },
    
    // Texto "¿No tienes cuenta?"
    signupText: {
        color: '#8D6E63',
        fontSize: '0.95rem',
        marginRight: '8px'
    },
    
    // Link "Regístrate gratis"
    signupLink: {
        color: '#8B5E3C',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '700',
        transition: 'color 0.3s'
    }
};

// ========================================
// ANIMACIÓN DEL SPINNER
// ========================================
// Creamos una hoja de estilos en el documento
const styleSheet = document.createElement('style');
// Definimos la animación de giro (de 0° a 360°)
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }    /* Inicio: 0 grados */
        100% { transform: rotate(360deg); } /* Fin: 360 grados (vuelta completa) */
    }
`;
// Agregamos la animación al documento HTML
document.head.appendChild(styleSheet);

// ========================================
// RESPONSIVO - Para pantallas pequeñas (móviles)
// ========================================
// Si la ventana tiene menos de 850px de ancho
if (typeof window !== 'undefined' && window.innerWidth <= 850) {
    // Ocultamos el panel izquierdo para ahorrar espacio
    styles.leftPanel.display = 'none';
}

// Exportamos el componente para usarlo en otras partes de la aplicación
export default Login;