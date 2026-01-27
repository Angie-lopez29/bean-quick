// Importamos las herramientas que necesitamos de React y otras bibliotecas
import React, { useState } from 'react'; // React y useState nos permiten crear componentes y manejar datos que cambian
import axios from 'axios'; // axios es como un mensajero que envía y recibe información del servidor
import { useNavigate } from 'react-router-dom'; // useNavigate nos permite cambiar de página dentro de la aplicación
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaArrowRight, FaCoffee } from 'react-icons/fa'; // Iconos bonitos para decorar la interfaz

// Esta es la dirección donde vive nuestro servidor (backend)
const API_URL = 'http://127.0.0.1:8000/api'; 

// Este es nuestro componente principal de Registro
const Register = () => {
    // useState es como una caja donde guardamos información que puede cambiar
    // formData guarda toda la información del formulario (nombre, email, contraseñas)
    const [formData, setFormData] = useState({
        name: '', // Nombre del usuario (empieza vacío)
        email: '', // Correo electrónico (empieza vacío)
        password: '', // Contraseña (empieza vacía)
        password_confirmation: '', // Confirmación de contraseña (empieza vacía)
        rol: 'cliente' // El tipo de usuario, por defecto es 'cliente'
    });
    
    const [errors, setErrors] = useState({}); // Aquí guardamos los mensajes de error si algo sale mal
    const [loading, setLoading] = useState(false); // Indica si estamos esperando respuesta del servidor (true/false)
    const [focusedInput, setFocusedInput] = useState(''); // Guarda cuál campo está siendo usado en este momento
    const navigate = useNavigate(); // Herramienta para cambiar de página

    // Esta función se ejecuta cada vez que el usuario escribe en algún campo del formulario
    const handleChange = (e) => {
        // Actualizamos formData: copiamos todo lo que ya teníamos (...formData)
        // y cambiamos solo el campo que el usuario está editando
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Esta función se ejecuta cuando el usuario presiona el botón "Crear mi cuenta"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de los formularios)
        setErrors({}); // Limpiamos cualquier error anterior

        // Validación: verificamos que las dos contraseñas sean iguales
        if (formData.password !== formData.password_confirmation) {
            setErrors({ password: ['Las contraseñas no coinciden.'] }); // Mostramos un mensaje de error
            return; // Detenemos aquí, no enviamos nada al servidor
        }

        setLoading(true); // Indicamos que estamos cargando (para mostrar el spinner)

        try {
            // Intentamos enviar los datos al servidor para crear la cuenta
            const response = await axios.post(`${API_URL}/register`, formData);
            
            // Si todo sale bien, el servidor nos devuelve: token, información del usuario, y hacia dónde redirigir
            const { token, user, redirectTo } = response.data;
            
            // Guardamos el token (como una llave digital) en el navegador
            localStorage.setItem('AUTH_TOKEN', token);
            // Guardamos el rol del usuario (admin, empresa, o cliente)
            localStorage.setItem('USER_ROLE', user.rol || user.role); // Usamos rol o role por si el servidor envía cualquiera
            // Guardamos el nombre del usuario
            localStorage.setItem('USER_NAME', user.name);

            // Configuramos axios para que incluya el token en todas las futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Decidimos a qué página enviar al usuario según su rol
            if (redirectTo) {
                // Si el servidor nos dice exactamente a dónde ir, vamos ahí
                navigate(redirectTo);
            } else {
                // Si no, decidimos nosotros según el rol del usuario
                const role = user.rol || user.role;
                if (role === 'admin') navigate('/admin/dashboard'); // Los admin van al dashboard
                else if (role === 'empresa') navigate('/empresa/perfil'); // Las empresas van a su perfil
                else navigate('/productos'); // Los clientes van a ver productos
            }

        } catch (err) {
            // Si algo sale mal, manejamos el error
            if (err.response && err.response.status === 422) {
                // Error 422 significa que los datos no son válidos (ej: email ya existe)
                setErrors(err.response.data.errors); // Mostramos los errores que nos envía el servidor
            } else {
                // Cualquier otro error (ej: servidor apagado)
                setErrors({ general: 'Error de conexión. Verifica que el servidor Laravel esté corriendo.' });
            }
        } finally {
            // Siempre ejecutamos esto al final, haya funcionado o no
            setLoading(false); // Dejamos de mostrar el estado de "cargando"
        }
    };

    // Aquí empieza la parte visual (lo que el usuario ve)
    return (
        <div style={styles.page}>
            {/* Círculos decorativos de fondo (solo estética) */}
            <div style={styles.bgCircle1} />
            <div style={styles.bgCircle2} />
            <div style={styles.bgCircle3} />

            <div style={styles.container}>
                {/* ========== PANEL IZQUIERDO (café, con el logo y beneficios) ========== */}
                <div style={styles.leftPanel}>
                    {/* Sección de marca/logo */}
                    <div style={styles.brandSection}>
                        <div style={styles.logoCircle}>
                            <FaCoffee style={styles.logoIcon} /> {/* Icono de taza de café */}
                        </div>
                        <h1 style={styles.brandTitle}>
                            Únete a la<br/>Experiencia
                        </h1>
                        <p style={styles.brandTagline}>
                            Crea tu cuenta en Bean Quick y accede a beneficios exclusivos
                        </p>
                    </div>

                    {/* Caja con lista de beneficios */}
                    <div style={styles.featuresBox}>
                        <div style={styles.featureItem}>
                            <FaCheckCircle style={styles.checkIcon} /> {/* Icono de check ✓ */}
                            <span style={styles.featureText}>Reservas rápidas y sencillas</span>
                        </div>
                        <div style={styles.featureItem}>
                            <FaCheckCircle style={styles.checkIcon} />
                            <span style={styles.featureText}>Productos destacados premium</span>
                        </div>
                        <div style={styles.featureItem}>
                            <FaCheckCircle style={styles.checkIcon} />
                            <span style={styles.featureText}>Ofertas y promociones locales</span>
                        </div>
                        <div style={styles.featureItem}>
                            <FaCheckCircle style={styles.checkIcon} />
                            <span style={styles.featureText}>Programa de lealtad</span>
                        </div>
                    </div>

                    {/* Banner para usuarios que ya tienen cuenta */}
                    <div style={styles.businessBanner}>
                        <p style={styles.businessQuestion}>¿Ya tienes una cuenta?</p>
                        <button 
                            onClick={() => navigate('/login')} // Al hacer clic, vamos a la página de login
                            style={styles.businessBtn}
                            // Efectos cuando el mouse pasa por encima del botón
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            Iniciar sesión →
                        </button>
                    </div>
                </div>

                {/* ========== PANEL DERECHO (blanco, con el formulario) ========== */}
                <div style={styles.rightPanel}>
                    <div style={styles.formWrapper}>
                        {/* Encabezado del formulario */}
                        <div style={styles.header}>
                            <h2 style={styles.welcomeTitle}>Crear Cuenta</h2>
                            <p style={styles.welcomeSubtitle}>Completa tus datos para empezar</p>
                        </div>

                        {/* Si hay un error general, lo mostramos aquí */}
                        {errors.general && (
                            <div style={styles.errorBox}>
                                <span style={styles.errorIcon}>⚠</span>
                                <span>{errors.general}</span>
                            </div>
                        )}

                        {/* El formulario comienza aquí */}
                        <form onSubmit={handleSubmit} style={styles.form}>
                            {/* ========== CAMPO DE NOMBRE ========== */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nombre Completo</label>
                                <div style={{
                                    ...styles.inputBox, // Estilo base
                                    ...(focusedInput === 'name' ? styles.inputBoxFocused : {}), // Si está enfocado, cambia color
                                    ...(errors.name ? styles.inputBoxError : {}) // Si hay error, se pone rojo
                                }}>
                                    <FaUser style={styles.inputIcon} /> {/* Icono de persona */}
                                    <input
                                        type="text"
                                        name="name"
                                        style={styles.input}
                                        placeholder="Tu nombre completo"
                                        value={formData.name} // Muestra el valor actual
                                        onChange={handleChange} // Se ejecuta al escribir
                                        onFocus={() => setFocusedInput('name')} // Marca este campo como enfocado
                                        onBlur={() => setFocusedInput('')} // Desmarca cuando sales del campo
                                        required // Este campo es obligatorio
                                    />
                                </div>
                                {/* Si hay error en el nombre, mostramos el mensaje */}
                                {errors.name && <small style={styles.errorText}>{errors.name[0]}</small>}
                            </div>

                            {/* ========== CAMPO DE EMAIL ========== */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Correo Electrónico</label>
                                <div style={{
                                    ...styles.inputBox,
                                    ...(focusedInput === 'email' ? styles.inputBoxFocused : {}),
                                    ...(errors.email ? styles.inputBoxError : {})
                                }}>
                                    <FaEnvelope style={styles.inputIcon} /> {/* Icono de sobre */}
                                    <input
                                        type="email" // Solo acepta formato de email
                                        name="email"
                                        style={styles.input}
                                        placeholder="tu@correo.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('email')}
                                        onBlur={() => setFocusedInput('')}
                                        required
                                    />
                                </div>
                                {errors.email && <small style={styles.errorText}>{errors.email[0]}</small>}
                            </div>

                            {/* ========== CAMPO DE CONTRASEÑA ========== */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Contraseña</label>
                                <div style={{
                                    ...styles.inputBox,
                                    ...(focusedInput === 'password' ? styles.inputBoxFocused : {}),
                                    ...(errors.password ? styles.inputBoxError : {})
                                }}>
                                    <FaLock style={styles.inputIcon} /> {/* Icono de candado */}
                                    <input
                                        type="password" // Oculta lo que escribes (muestra ••••)
                                        name="password"
                                        style={styles.input}
                                        placeholder="Mín. 8 caracteres, mayús. y núm."
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput('')}
                                        required
                                    />
                                </div>
                                {errors.password && <small style={styles.errorText}>{errors.password[0]}</small>}
                            </div>

                            {/* ========== CAMPO DE CONFIRMAR CONTRASEÑA ========== */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Confirmar Contraseña</label>
                                <div style={{
                                    ...styles.inputBox,
                                    ...(focusedInput === 'password_confirmation' ? styles.inputBoxFocused : {})
                                }}>
                                    <FaLock style={styles.inputIcon} />
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        style={styles.input}
                                        placeholder="Repite tu contraseña"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('password_confirmation')}
                                        onBlur={() => setFocusedInput('')}
                                        required
                                    />
                                </div>
                            </div>

                            {/* ========== BOTÓN DE ENVIAR ========== */}
                            <button 
                                type="submit" // Al hacer clic, ejecuta handleSubmit
                                style={{
                                    ...styles.submitBtn,
                                    ...(loading ? styles.submitBtnDisabled : {}) // Si está cargando, cambia el estilo
                                }}
                                disabled={loading} // Si está cargando, deshabilitamos el botón
                                // Efectos cuando el mouse pasa por encima
                                onMouseEnter={(e) => {
                                    if (!loading) e.target.style.transform = 'translateY(-2px)'; // Sube un poquito
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)'; // Vuelve a su posición
                                }}
                            >
                                {loading ? (
                                    // Si está cargando, mostramos un spinner giratorio y texto diferente
                                    <>
                                        <span style={styles.spinner} />
                                        Validando seguridad...
                                    </>
                                ) : (
                                    // Si no está cargando, mostramos el texto normal
                                    <>
                                        Crear mi cuenta
                                        <FaArrowRight style={styles.arrowIcon} /> {/* Flecha → */}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sección de términos y condiciones */}
                        <div style={styles.termsSection}>
                            <p style={styles.termsText}>
                                Al registrarte, aceptas nuestros{' '}
                                <a href="#!" style={styles.termsLink}>Términos de Servicio</a>
                                {' '}y{' '}
                                <a href="#!" style={styles.termsLink}>Política de Privacidad</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========== ESTILOS (CSS en JavaScript) ==========
// Aquí definimos cómo se ve cada elemento
const styles = {
    page: {
        minHeight: '100vh', // Ocupa al menos toda la altura de la pantalla
        background: 'linear-gradient(135deg, #FBF8F3 0%, #F5EBE0 50%, #EFE1D1 100%)', // Degradado de colores suaves
        display: 'flex', // Usamos flexbox para centrar contenido
        alignItems: 'center', // Centra verticalmente
        justifyContent: 'center', // Centra horizontalmente
        padding: '20px',
        fontFamily: "'Inter', -apple-system, sans-serif", // Fuente moderna
        position: 'relative',
        overflow: 'hidden' // Oculta lo que se salga de los bordes
    },
    // Círculos decorativos de fondo (solo estética)
    bgCircle1: {
        position: 'absolute', // Se posiciona sobre otros elementos
        width: '500px',
        height: '500px',
        borderRadius: '50%', // Lo hace circular
        background: 'radial-gradient(circle, rgba(139, 94, 60, 0.1) 0%, transparent 70%)', // Degradado radial
        top: '-150px', // Posición desde arriba
        right: '-150px', // Posición desde la derecha
        pointerEvents: 'none' // No interfiere con clics del mouse
    },
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
    bgCircle3: {
        position: 'absolute',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(160, 129, 108, 0.06) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Centra el círculo
        pointerEvents: 'none'
    },
    container: {
        width: '100%',
        maxWidth: '1100px', // Ancho máximo
        minHeight: '750px', // Altura mínima
        backgroundColor: '#FFFFFF', // Fondo blanco
        borderRadius: '24px', // Esquinas redondeadas
        display: 'flex', // Divide en dos paneles
        boxShadow: '0 30px 60px rgba(62, 39, 35, 0.12)', // Sombra suave
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1 // Se muestra por encima de los círculos de fondo
    },
    leftPanel: {
        flex: 1, // Ocupa 1 parte del espacio disponible
        background: 'linear-gradient(165deg, #6F4E37 0%, #8B5E3C 50%, #A0816C 100%)', // Degradado café
        padding: '60px 50px',
        display: 'flex',
        flexDirection: 'column', // Elementos apilados verticalmente
        justifyContent: 'space-between', // Distribuye el espacio
        position: 'relative',
        overflow: 'hidden'
    },
    brandSection: {
        textAlign: 'center', // Texto centrado
        color: '#FFFFFF' // Texto blanco
    },
    logoCircle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%', // Círculo
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Blanco semi-transparente
        backdropFilter: 'blur(10px)', // Efecto de desenfoque
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 25px', // Centrado horizontalmente
        border: '2px solid rgba(255, 255, 255, 0.2)' // Borde blanco suave
    },
    logoIcon: {
        fontSize: '2.5rem', // Tamaño grande
        color: '#FFFFFF'
    },
    brandTitle: {
        fontSize: '2.6rem',
        fontWeight: '800', // Muy grueso (bold)
        marginBottom: '15px',
        letterSpacing: '-0.5px', // Letras un poco más juntas
        lineHeight: '1.1' // Espaciado entre líneas
    },
    brandTagline: {
        fontSize: '1.05rem',
        opacity: 0.9, // Ligeramente transparente
        fontWeight: '400', // Peso normal
        lineHeight: 1.6
    },
    featuresBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo blanco semi-transparente
        backdropFilter: 'blur(10px)', // Efecto vidrio esmerilado
        borderRadius: '16px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.15)'
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center', // Icono y texto alineados verticalmente
        marginBottom: '18px',
        color: '#FFFFFF'
    },
    checkIcon: {
        fontSize: '1.3rem',
        color: '#E0C3A2', // Color beige claro
        marginRight: '15px', // Espacio entre icono y texto
        flexShrink: 0 // No se encoge si falta espacio
    },
    featureText: {
        fontSize: '0.95rem',
        fontWeight: '500' // Peso medio
    },
    businessBanner: {
        textAlign: 'center',
        color: '#FFFFFF'
    },
    businessQuestion: {
        fontSize: '0.95rem',
        marginBottom: '15px',
        opacity: 0.9
    },
    businessBtn: {
        backgroundColor: 'transparent', // Fondo transparente
        border: '2px solid rgba(255, 255, 255, 0.3)', // Borde blanco suave
        color: '#FFFFFF',
        padding: '12px 32px',
        borderRadius: '50px', // Muy redondeado (píldora)
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer', // Manita al pasar el mouse
        transition: 'all 0.3s', // Transiciones suaves
        backdropFilter: 'blur(10px)'
    },
    rightPanel: {
        flex: 1.3, // Ocupa 1.3 partes (más grande que el izquierdo)
        padding: '60px 70px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        overflowY: 'auto' // Si el contenido es muy largo, permite scroll
    },
    formWrapper: {
        width: '100%',
        maxWidth: '450px' // Ancho máximo del formulario
    },
    header: {
        marginBottom: '35px'
    },
    welcomeTitle: {
        fontSize: '2.4rem',
        color: '#3E2723', // Café oscuro
        fontWeight: '800',
        marginBottom: '8px',
        letterSpacing: '-0.5px'
    },
    welcomeSubtitle: {
        fontSize: '1rem',
        color: '#8D6E63', // Café medio
        fontWeight: '400'
    },
    errorBox: {
        backgroundColor: '#FEF2F2', // Rojo muy claro
        border: '1px solid #FCA5A5', // Borde rojo
        color: '#B91C1C', // Texto rojo oscuro
        padding: '14px 18px',
        borderRadius: '12px',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px', // Espacio entre elementos
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    errorIcon: {
        fontSize: '1.1rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column', // Campos apilados verticalmente
        gap: '20px' // Espacio entre campos
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#5D4037', // Café oscuro
        letterSpacing: '0.3px' // Letras ligeramente separadas
    },
    inputBox: {
        position: 'relative', // Para posicionar el icono dentro
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FAFAFA', // Gris muy claro
        borderRadius: '14px',
        border: '2px solid #E8E0D8', // Borde beige
        transition: 'all 0.3s' // Transiciones suaves
    },
    inputBoxFocused: {
        backgroundColor: '#FFFFFF', // Fondo blanco cuando está activo
        borderColor: '#8B5E3C', // Borde café
        boxShadow: '0 0 0 4px rgba(139, 94, 60, 0.1)' // Sombra suave alrededor
    },
    inputBoxError: {
        borderColor: '#FCA5A5', // Borde rojo si hay error
        backgroundColor: '#FEF2F2' // Fondo rojo muy claro
    },
    inputIcon: {
        position: 'absolute', // Posicionado dentro del campo
        left: '18px', // 18px desde la izquierda
        color: '#A0816C', // Color café claro
        fontSize: '1.1rem'
    },
    input: {
        width: '100%',
        padding: '16px 18px 16px 52px', // Espacio extra a la izquierda para el icono
        border: 'none', // Sin borde (ya lo tiene el contenedor)
        backgroundColor: 'transparent', // Fondo transparente
        fontSize: '1rem',
        color: '#3E2723',
        outline: 'none', // Quita el borde azul por defecto
        fontWeight: '500'
    },
    errorText: {
        color: '#B91C1C', // Rojo oscuro
        fontSize: '0.8rem',
        marginLeft: '5px',
        fontWeight: '500'
    },
    submitBtn: {
        backgroundColor: '#8B5E3C', // Café
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
        gap: '10px',
        boxShadow: '0 12px 24px rgba(139, 94, 60, 0.25)', // Sombra pronunciada
        transition: 'all 0.3s',
        marginTop: '10px'
    },
    submitBtnDisabled: {
        backgroundColor: '#A0816C', // Café más claro cuando está deshabilitado
        cursor: 'not-allowed', // Cursor de "no permitido"
        boxShadow: '0 8px 16px rgba(139, 94, 60, 0.15)' // Sombra más suave
    },
    arrowIcon: {
        fontSize: '1rem'
    },
    spinner: {
        width: '18px',
        height: '18px',
        border: '3px solid rgba(255, 255, 255, 0.3)', // Borde gris claro
        borderTop: '3px solid #FFFFFF', // Parte superior blanca (crea el efecto de giro)
        borderRadius: '50%', // Circular
        animation: 'spin 0.8s linear infinite' // Animación de giro infinita
    },
    termsSection: {
        marginTop: '30px',
        textAlign: 'center'
    },
    termsText: {
        fontSize: '0.85rem',
        color: '#8D6E63',
        lineHeight: 1.6
    },
    termsLink: {
        color: '#8B5E3C', // Café
        textDecoration: 'none', // Sin subrayado
        fontWeight: '600',
        transition: 'color 0.3s' // Transición suave al cambiar de color
    }
};

// Creamos una animación CSS para el spinner giratorio
const styleSheet = document.createElement('style'); // Creamos un elemento <style>
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }    /* Al inicio: 0 grados */
        100% { transform: rotate(360deg); } /* Al final: 360 grados (una vuelta completa) */
    }
`;
document.head.appendChild(styleSheet); // Lo agregamos al <head> del documento

export default Register; // Exportamos el componente para usarlo en otras partes de la aplicación