import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaCoffee, FaArrowRight } from 'react-icons/fa';

const API_URL = 'http://127.0.0.1:8000/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, formData);
            const { token, user, status } = response.data;
            if (status === 'success') {
                localStorage.setItem('AUTH_TOKEN', token);
                localStorage.setItem('USER_ROLE', user.rol);
                localStorage.setItem('USER_NAME', user.name);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                const routes = { cliente: '/cliente/dashboard', empresa: '/empresa/panel', admin: '/admin/dashboard' };
                navigate(routes[user.rol] || '/');
                window.location.reload();
            }
        } catch (err) {
            setError(err.response?.data.message || 'Error de conexión');
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
                        <h1 style={styles.brandTitle}>Bean Quick</h1>
                        <p style={styles.brandTagline}>Tu café favorito, a un click de distancia</p>
                    </div>

                    <div style={styles.featuresBox}>
                        <div style={styles.featureItem}>
                            <div style={styles.featureBullet}>✓</div>
                            <span style={styles.featureText}>Entrega en 30 minutos</span>
                        </div>
                        <div style={styles.featureItem}>
                            <div style={styles.featureBullet}>✓</div>
                            <span style={styles.featureText}>Café de especialidad premium</span>
                        </div>
                        <div style={styles.featureItem}>
                            <div style={styles.featureBullet}>✓</div>
                            <span style={styles.featureText}>Programa de recompensas</span>
                        </div>
                    </div>

                    <div style={styles.businessBanner}>
                        <p style={styles.businessQuestion}>¿Eres una empresa?</p>
                        <button style={styles.businessBtn}>
                            Únete ahora →
                        </button>
                    </div>
                </div>

                {/* PANEL DERECHO - FORMULARIO */}
                <div style={styles.rightPanel}>
                    <div style={styles.formWrapper}>
                        <div style={styles.header}>
                            <h2 style={styles.welcomeTitle}>¡Bienvenido de vuelta!</h2>
                            <p style={styles.welcomeSubtitle}>Inicia sesión para continuar</p>
                        </div>

                        {error && (
                            <div style={styles.errorBox}>
                                <span style={styles.errorIcon}>⚠</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Correo electrónico</label>
                                <div style={{
                                    ...styles.inputBox,
                                    ...(focusedInput === 'email' ? styles.inputBoxFocused : {})
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
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Contraseña</label>
                                <div style={{
                                    ...styles.inputBox,
                                    ...(focusedInput === 'password' ? styles.inputBoxFocused : {})
                                }}>
                                    <FaLock style={styles.inputIcon} />
                                    <input
                                        type="password"
                                        name="password"
                                        style={styles.input}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput('')}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={styles.forgotSection}>
                                <a href="#!" style={styles.forgotLink}>
                                    ¿Olvidaste tu contraseña?
                                </a>
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
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        Iniciar sesión
                                        <FaArrowRight style={styles.arrowIcon} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div style={styles.divider}>
                            <span style={styles.dividerLine} />
                            <span style={styles.dividerText}>o</span>
                            <span style={styles.dividerLine} />
                        </div>

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
        minHeight: '700px',
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
        fontSize: '2.8rem',
        fontWeight: '800',
        marginBottom: '15px',
        letterSpacing: '-0.5px'
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
        marginBottom: '20px',
        color: '#FFFFFF'
    },
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
        backgroundColor: '#FFFFFF'
    },
    formWrapper: {
        width: '100%',
        maxWidth: '450px'
    },
    header: {
        marginBottom: '40px'
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
        gap: '24px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
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
    forgotSection: {
        textAlign: 'right',
        marginTop: '-8px'
    },
    forgotLink: {
        color: '#8B5E3C',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'color 0.3s'
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
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        margin: '35px 0'
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: '#E8E0D8'
    },
    dividerText: {
        color: '#A0816C',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    signupSection: {
        textAlign: 'center'
    },
    signupText: {
        color: '#8D6E63',
        fontSize: '0.95rem',
        marginRight: '8px'
    },
    signupLink: {
        color: '#8B5E3C',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '700',
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

// Responsive: ocultar panel izquierdo en móviles
if (typeof window !== 'undefined' && window.innerWidth <= 850) {
    styles.leftPanel.display = 'none';
}

export default Login;