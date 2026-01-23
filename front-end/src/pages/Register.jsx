import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaArrowRight, FaCoffee } from 'react-icons/fa';

const API_URL = 'http://127.0.0.1:8000/api'; 

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol: 'cliente' 
    });
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validaciones básicas de cliente
    if (formData.password !== formData.password_confirmation) {
        setErrors({ password: ['Las contraseñas no coinciden.'] });
        return;
    }

    setLoading(true);

    try {
        const response = await axios.post(`${API_URL}/register`, formData);
        
        // Extraemos los datos. Si 'redirectTo' no viene del back, usamos un fallback
        const { token, user, redirectTo } = response.data;
        
        localStorage.setItem('AUTH_TOKEN', token);
        localStorage.setItem('USER_ROLE', user.rol || user.role); // Por si acaso es role
        localStorage.setItem('USER_NAME', user.name);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Redirección inteligente
        if (redirectTo) {
            navigate(redirectTo);
        } else {
            // Fallback manual si el back no manda ruta
            const role = user.rol || user.role;
            if (role === 'admin') navigate('/admin/dashboard');
            else if (role === 'empresa') navigate('/empresa/perfil');
            else navigate('/productos');
        }

    } catch (err) {
        if (err.response && err.response.status === 422) {
            setErrors(err.response.data.errors);
        } else {
            setErrors({ general: 'Error de conexión. Verifica que el servidor Laravel esté corriendo.' });
        }
    } finally {
        setLoading(false);
    }
};

    return (
        <div style={styles.page}>
            {/* Decoraciones de fondo */}
            <div style={styles.bgCircle1} />
            <div style={styles.bgCircle2} />
            <div style={styles.bgCircle3} />

            <div style={styles.container}>
                {/* PANEL IZQUIERDO */}
                <div style={styles.leftPanel}>
                    <div style={styles.brandSection}>
                        <div style={styles.logoCircle}>
                            <FaCoffee style={styles.logoIcon} />
                        </div>
                        <h1 style={styles.brandTitle}>
                            Únete a la<br/>Experiencia
                        </h1>
                        <p style={styles.brandTagline}>
                            Crea tu cuenta en Bean Quick y accede a beneficios exclusivos
                        </p>
                    </div>

                    <div style={styles.featuresBox}>
                        <div style={styles.featureItem}>
                            <FaCheckCircle style={styles.checkIcon} />
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

                    <div style={styles.businessBanner}>
                        <p style={styles.businessQuestion}>¿Ya tienes una cuenta?</p>
                        <button 
                            onClick={() => navigate('/login')} 
                            style={styles.businessBtn}
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

                {/* PANEL DERECHO - FORMULARIO */}
                <div style={styles.rightPanel}>
                    <div style={styles.formWrapper}>
                        <div style={styles.header}>
                            <h2 style={styles.welcomeTitle}>Crear Cuenta</h2>
                            <p style={styles.welcomeSubtitle}>Completa tus datos para empezar</p>
                        </div>

                        {errors.general && (
                            <div style={styles.errorBox}>
                                <span style={styles.errorIcon}>⚠</span>
                                <span>{errors.general}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            {/* NOMBRE */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nombre Completo</label>
                                <div style={{
                                    ...styles.inputBox,
                                    ...(focusedInput === 'name' ? styles.inputBoxFocused : {}),
                                    ...(errors.name ? styles.inputBoxError : {})
                                }}>
                                    <FaUser style={styles.inputIcon} />
                                    <input
                                        type="text"
                                        name="name"
                                        style={styles.input}
                                        placeholder="Tu nombre completo"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('name')}
                                        onBlur={() => setFocusedInput('')}
                                        required
                                    />
                                </div>
                                {errors.name && <small style={styles.errorText}>{errors.name[0]}</small>}
                            </div>

                            {/* EMAIL */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Correo Electrónico</label>
                                <div style={{
                                    ...styles.inputBox,
                                    ...(focusedInput === 'email' ? styles.inputBoxFocused : {}),
                                    ...(errors.email ? styles.inputBoxError : {})
                                }}>
                                    <FaEnvelope style={styles.inputIcon} />
                                    <input
                                        type="email"
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

                            {/* CONTRASEÑA */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Contraseña</label>
                                <div style={{
                                    ...styles.inputBox,
                                    ...(focusedInput === 'password' ? styles.inputBoxFocused : {}),
                                    ...(errors.password ? styles.inputBoxError : {})
                                }}>
                                    <FaLock style={styles.inputIcon} />
                                    <input
                                        type="password"
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

                            {/* CONFIRMAR CONTRASEÑA */}
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

                            <button 
                                type="submit" 
                                style={{
                                    ...styles.submitBtn,
                                    ...(loading ? styles.submitBtnDisabled : {})
                                }}
                                disabled={loading}
                                onMouseEnter={(e) => {
                                    if (!loading) e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span style={styles.spinner} />
                                        Validando seguridad...
                                    </>
                                ) : (
                                    <>
                                        Crear mi cuenta
                                        <FaArrowRight style={styles.arrowIcon} />
                                    </>
                                )}
                            </button>
                        </form>

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

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FBF8F3 0%, #F5EBE0 50%, #EFE1D1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: 'relative',
        overflow: 'hidden'
    },
    bgCircle1: {
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 94, 60, 0.1) 0%, transparent 70%)',
        top: '-150px',
        right: '-150px',
        pointerEvents: 'none'
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
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
    },
    container: {
        width: '100%',
        maxWidth: '1100px',
        minHeight: '750px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        display: 'flex',
        boxShadow: '0 30px 60px rgba(62, 39, 35, 0.12)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
    },
    leftPanel: {
        flex: 1,
        background: 'linear-gradient(165deg, #6F4E37 0%, #8B5E3C 50%, #A0816C 100%)',
        padding: '60px 50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
    },
    brandSection: {
        textAlign: 'center',
        color: '#FFFFFF'
    },
    logoCircle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 25px',
        border: '2px solid rgba(255, 255, 255, 0.2)'
    },
    logoIcon: {
        fontSize: '2.5rem',
        color: '#FFFFFF'
    },
    brandTitle: {
        fontSize: '2.6rem',
        fontWeight: '800',
        marginBottom: '15px',
        letterSpacing: '-0.5px',
        lineHeight: '1.1'
    },
    brandTagline: {
        fontSize: '1.05rem',
        opacity: 0.9,
        fontWeight: '400',
        lineHeight: 1.6
    },
    featuresBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.15)'
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '18px',
        color: '#FFFFFF'
    },
    checkIcon: {
        fontSize: '1.3rem',
        color: '#E0C3A2',
        marginRight: '15px',
        flexShrink: 0
    },
    featureText: {
        fontSize: '0.95rem',
        fontWeight: '500'
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
        backgroundColor: 'transparent',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        color: '#FFFFFF',
        padding: '12px 32px',
        borderRadius: '50px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backdropFilter: 'blur(10px)'
    },
    rightPanel: {
        flex: 1.3,
        padding: '60px 70px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        overflowY: 'auto'
    },
    formWrapper: {
        width: '100%',
        maxWidth: '450px'
    },
    header: {
        marginBottom: '35px'
    },
    welcomeTitle: {
        fontSize: '2.4rem',
        color: '#3E2723',
        fontWeight: '800',
        marginBottom: '8px',
        letterSpacing: '-0.5px'
    },
    welcomeSubtitle: {
        fontSize: '1rem',
        color: '#8D6E63',
        fontWeight: '400'
    },
    errorBox: {
        backgroundColor: '#FEF2F2',
        border: '1px solid #FCA5A5',
        color: '#B91C1C',
        padding: '14px 18px',
        borderRadius: '12px',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    errorIcon: {
        fontSize: '1.1rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#5D4037',
        letterSpacing: '0.3px'
    },
    inputBox: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: '14px',
        border: '2px solid #E8E0D8',
        transition: 'all 0.3s'
    },
    inputBoxFocused: {
        backgroundColor: '#FFFFFF',
        borderColor: '#8B5E3C',
        boxShadow: '0 0 0 4px rgba(139, 94, 60, 0.1)'
    },
    inputBoxError: {
        borderColor: '#FCA5A5',
        backgroundColor: '#FEF2F2'
    },
    inputIcon: {
        position: 'absolute',
        left: '18px',
        color: '#A0816C',
        fontSize: '1.1rem'
    },
    input: {
        width: '100%',
        padding: '16px 18px 16px 52px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '1rem',
        color: '#3E2723',
        outline: 'none',
        fontWeight: '500'
    },
    errorText: {
        color: '#B91C1C',
        fontSize: '0.8rem',
        marginLeft: '5px',
        fontWeight: '500'
    },
    submitBtn: {
        backgroundColor: '#8B5E3C',
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
        boxShadow: '0 12px 24px rgba(139, 94, 60, 0.25)',
        transition: 'all 0.3s',
        marginTop: '10px'
    },
    submitBtnDisabled: {
        backgroundColor: '#A0816C',
        cursor: 'not-allowed',
        boxShadow: '0 8px 16px rgba(139, 94, 60, 0.15)'
    },
    arrowIcon: {
        fontSize: '1rem'
    },
    spinner: {
        width: '18px',
        height: '18px',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderTop: '3px solid #FFFFFF',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
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
        color: '#8B5E3C',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'color 0.3s'
    }
};

// Agregar keyframe para spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default Register;