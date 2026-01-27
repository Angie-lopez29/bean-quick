import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ActivarCuenta = () => {
    const { token } = useParams(); 
    const navigate = useNavigate();
    const [datos, setDatos] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const validarToken = async () => {
            try {
                const res = await axios.get(
                    `http://127.0.0.1:8000/api/empresa/validar-token/${token}`,
                );
                setDatos(res.data.solicitud);
            } catch (error) {
                setError("El enlace de activación es inválido o ya fue utilizado."+error);
            }
        };
        validarToken();
    }, [token]);

    const handleRegistroFinal = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            await axios.post(`http://127.0.0.1:8000/api/empresa/activar/${token}`, {
                token,
                password,
                password_confirmation: confirmPassword,
            });

            // --- AQUÍ BORRAMOS LA SESIÓN ---
            localStorage.clear(); // Borra tokens y datos de cualquier usuario logueado
            delete axios.defaults.headers.common['Authorization']; // Limpia el header de Axios

            alert("¡Cuenta activada con éxito! Por seguridad, inicia sesión con tus nuevas credenciales.");
            
            // Redirigimos al login totalmente limpio
            navigate("/login");
            
        } catch (error) {
            alert("Error al finalizar el registro. Inténtalo de nuevo."+error);
        }
    };

    if (error)
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2 style={{ color: 'red' }}>{error}</h2>
                <button onClick={() => navigate('/login')}>Ir al Login</button>
            </div>
        );

    if (!datos)
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                Cargando datos de tu empresa...
            </div>
        );

    return (
        <div style={styles.container}>
            <h2 style={{ textAlign: 'center' }}>Finalizar Registro</h2>
            <h3 style={{ color: '#6f4e37' }}>{datos.nombre_empresa}</h3>
            <p>
                Hola <strong>{datos.nombre_dueno}</strong>, define tu contraseña para
                comenzar.
            </p>

            <form onSubmit={handleRegistroFinal} style={styles.form}>
                <label>Correo Electrónico (Confirmado)</label>
                <input
                    type="text"
                    value={datos.correo}
                    disabled
                    style={styles.inputDisabled}
                />

                <label>Nueva Contraseña</label>
                <input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    style={styles.input}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label>Confirmar Contraseña</label>
                <input
                    type="password"
                    placeholder="Repite tu contraseña"
                    style={styles.input}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" style={styles.button}>
                    Activar mi Cuenta
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
    },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    input: { padding: "12px", borderRadius: "5px", border: "1px solid #ccc" },
    inputDisabled: {
        padding: "12px",
        borderRadius: "5px",
        border: "1px solid #eee",
        backgroundColor: "#f9f9f9",
        color: "#888",
    },
    button: {
        padding: "14px",
        background: "#6f4e37",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px"
    },
};

export default ActivarCuenta;