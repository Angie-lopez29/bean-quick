import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

// Configura la URL base de tu API de Laravel
const API_URL = "http://127.0.0.1:8000/api";

const Login = () => {
    // 1. ESTADOS: Solo necesitamos email y password para el login
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // 2. MANEJO DE CAMBIOS: Actualiza el estado cuando el usuario escribe
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 3. MANEJO DEL ENVÍO: Lógica para enviar credenciales y recibir el token
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            // Petición POST a tu endpoint de Laravel /api/login
            const response = await axios.post(`${API_URL}/login`, formData);

            const { token, user, message } = response.data;

            // 4. GUARDAR EL TOKEN: ¡Paso crucial!
            // Guardamos el token en el almacenamiento local del navegador
            localStorage.setItem("AUTH_TOKEN", token);

            setSuccessMessage(message + " Redirigiendo...");

            console.log("Login Exitoso. Usuario:", user.email, "Token:", token);

            // Redirige al usuario a la página principal o al dashboard después de 1 segundo
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            // Manejo de errores de credenciales inválidas (código 401) o de servidor.
            if (err.response && err.response.status === 401) {
                setError("Credenciales inválidas. Verifica tu email y contraseña.");
            } else {
                setError("Error de conexión o de servidor. Inténtalo de nuevo.");
            }
            console.error(err);
        }
    };

    return (
        <>
            <div className="site-header">
                <div className="container container_form">
                    
                    <div className="form">
                        {/* Muestra mensajes de estado */}
                    {successMessage && (
                        <p
                            style={{
                                color: "green",
                                border: "1px solid lightgreen",
                                padding: "10px",
                            }}
                        >
                            {successMessage}
                        </p>
                    )}
                    {error && (
                        <p
                            style={{ color: "red", border: "1px solid red", padding: "10px" }}
                        >
                            {error}
                        </p>
                    )}
                        <form onSubmit={handleSubmit} className="form">
                            <h2>Iniciar Session</h2>
                            <div style={{ marginBottom: "15px" }}>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "100%", padding: "8px" }}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "100%", padding: "8px" }}
                                />
                            </div>

                            <button type="submit" className="submit">
                                iniciar session
                            </button>
                        </form>
                    </div>
                    <div className="information-form">
                    <div className="info_extra">
                        <p>contactanos!</p>
                        <p><strong>3016013816</strong></p>
                        <a href="#">BeanQuick@gmail</a>
                    </div>
                    <div className="info_extra">
                        <p>aun no tienes cuenta?</p>
                        <Link to='/register' className='link'>Login</Link>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
