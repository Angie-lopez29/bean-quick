import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaEnvelope, FaIdCard, FaPhone, FaMapMarkerAlt, FaFileAlt, FaImage, FaCoffee, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const RegistroEmpresa = () => {
  const navigate = useNavigate();
  const estadoInicial = {
    nombre: '',
    correo: '',
    nit: '',
    telefono: '',
    direccion: '',
    descripcion: '',
    logo: null,
    foto_local: null
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [focusedInput, setFocusedInput] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (errores[name]) setErrores({ ...errores, [name]: null });

    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'logo') {
          setLogoPreview(reader.result);
        } else if (name === 'foto_local') {
          setFotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    
    // Sanitización básica de caracteres peligrosos
    const dangerousChars = /[<>{}[\]\\/]/;
    if (dangerousChars.test(formData.nombre) || dangerousChars.test(formData.descripcion)) {
        setErrores({ general: 'No se permiten caracteres especiales como < > { } [ ]' });
        return;
    }

    setLoading(true);

    // Preparar FormData para envío de archivos
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem('AUTH_TOKEN');
      const response = await axios.post('http://127.0.0.1:8000/api/solicitud-empresa', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Respuesta exitosa:", response.data);
      alert('¡Solicitud enviada con éxito! Espera la aprobación del administrador.');
      
      // Limpiar todo tras el éxito
      setFormData(estadoInicial);
      setLogoPreview(null);
      setFotoPreview(null);
      setResetKey(prev => prev + 1);
      navigate('/');

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrores(error.response.data.errors);
      } else {
        setErrores({ general: 'Hubo un error al enviar.' });
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

      <div style={styles.container}>
        {/* HEADER CON BRANDING */}
        <div style={styles.header}>
          <div style={styles.brandSection}>
            <div style={styles.logoCircle}>
              <FaCoffee style={styles.logoIcon} />
            </div>
            <div>
              <h1 style={styles.brandTitle}>Únete a Bean Quick Business</h1>
              <p style={styles.brandSubtitle}>Registra tu cafetería y comienza a recibir pedidos</p>
            </div>
          </div>

          <div style={styles.benefitsRow}>
            <div style={styles.benefitBadge}>
              <FaCheckCircle style={styles.badgeIcon} />
              <span>Sin comisiones el primer mes</span>
            </div>
            <div style={styles.benefitBadge}>
              <FaCheckCircle style={styles.badgeIcon} />
              <span>Alcance local garantizado</span>
            </div>
            <div style={styles.benefitBadge}>
              <FaCheckCircle style={styles.badgeIcon} />
              <span>Panel de administración</span>
            </div>
          </div>
        </div>

        {/* FORMULARIO */}
        <div style={styles.formCard}>
          {errores.general && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠</span>
              <span>{errores.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* NOMBRE Y CORREO */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nombre de la Empresa *</label>
                <div style={{
                  ...styles.inputBox,
                  ...(focusedInput === 'nombre' ? styles.inputBoxFocused : {}),
                  ...(errores.nombre ? styles.inputBoxError : {})
                }}>
                  <FaBuilding style={styles.inputIcon} />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('nombre')}
                    onBlur={() => setFocusedInput('')}
                    style={styles.input}
                    placeholder="Ej: Café Aroma Central"
                  />
                </div>
                {errores.nombre && <small style={styles.errorText}>{errores.nombre[0]}</small>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Correo Corporativo *</label>
                <div style={{
                  ...styles.inputBox,
                  ...(focusedInput === 'correo' ? styles.inputBoxFocused : {}),
                  ...(errores.correo ? styles.inputBoxError : {})
                }}>
                  <FaEnvelope style={styles.inputIcon} />
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('correo')}
                    onBlur={() => setFocusedInput('')}
                    style={styles.input}
                    placeholder="empresa@correo.com"
                  />
                </div>
                {errores.correo && <small style={styles.errorText}>{errores.correo[0]}</small>}
              </div>
            </div>

            {/* NIT Y TELÉFONO */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>NIT / Identificación</label>
                <div style={{
                  ...styles.inputBox,
                  ...(focusedInput === 'nit' ? styles.inputBoxFocused : {})
                }}>
                  <FaIdCard style={styles.inputIcon} />
                  <input
                    type="text"
                    name="nit"
                    value={formData.nit}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('nit')}
                    onBlur={() => setFocusedInput('')}
                    style={styles.input}
                    placeholder="123456789-0"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Teléfono de Contacto *</label>
                <div style={{
                  ...styles.inputBox,
                  ...(focusedInput === 'telefono' ? styles.inputBoxFocused : {}),
                  ...(errores.telefono ? styles.inputBoxError : {})
                }}>
                  <FaPhone style={styles.inputIcon} />
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('telefono')}
                    onBlur={() => setFocusedInput('')}
                    style={styles.input}
                    placeholder="+57 300 123 4567"
                  />
                </div>
                {errores.telefono && <small style={styles.errorText}>{errores.telefono[0]}</small>}
              </div>
            </div>

            {/* DIRECCIÓN */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Dirección Física *</label>
              <div style={{
                ...styles.inputBox,
                ...(focusedInput === 'direccion' ? styles.inputBoxFocused : {}),
                ...(errores.direccion ? styles.inputBoxError : {})
              }}>
                <FaMapMarkerAlt style={styles.inputIcon} />
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('direccion')}
                  onBlur={() => setFocusedInput('')}
                  style={styles.input}
                  placeholder="Calle 123 #45-67, Barrio"
                />
              </div>
              {errores.direccion && <small style={styles.errorText}>{errores.direccion[0]}</small>}
            </div>

            {/* DESCRIPCIÓN */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Descripción de la Empresa *</label>
              <div style={{
                ...styles.textareaBox,
                ...(focusedInput === 'descripcion' ? styles.inputBoxFocused : {}),
                ...(errores.descripcion ? styles.inputBoxError : {})
              }}>
                <FaFileAlt style={styles.textareaIcon} />
                <textarea
                  name="descripcion"
                  rows="4"
                  value={formData.descripcion}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('descripcion')}
                  onBlur={() => setFocusedInput('')}
                  style={styles.textarea}
                  placeholder="Describe brevemente tu cafetería, especialidades, ambiente..."
                />
              </div>
              {errores.descripcion && <small style={styles.errorText}>{errores.descripcion[0]}</small>}
            </div>

            {/* ARCHIVOS */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Logo Corporativo *</label>
                <div style={styles.fileUploadBox}>
                  <input
                    type="file"
                    name="logo"
                    key={`logo-${resetKey}`}
                    onChange={handleChange}
                    accept="image/*"
                    style={styles.fileInput}
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" style={styles.fileLabel}>
                    {logoPreview ? (
                      <div style={styles.previewContainer}>
                        <img src={logoPreview} alt="Logo preview" style={styles.previewImage} />
                        <span style={styles.changeText}>Cambiar imagen</span>
                      </div>
                    ) : (
                      <div style={styles.uploadPlaceholder}>
                        <FaImage style={styles.uploadIcon} />
                        <span style={styles.uploadText}>Subir logo</span>
                        <span style={styles.uploadHint}>PNG, JPG (max 2MB)</span>
                      </div>
                    )}
                  </label>
                  {errores.logo && <small style={styles.errorText}>{errores.logo[0]}</small>}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Foto del Local</label>
                <div style={styles.fileUploadBox}>
                  <input
                    type="file"
                    name="foto_local"
                    key={`foto-${resetKey}`}
                    onChange={handleChange}
                    accept="image/*"
                    style={styles.fileInput}
                    id="foto-upload"
                  />
                  <label htmlFor="foto-upload" style={styles.fileLabel}>
                    {fotoPreview ? (
                      <div style={styles.previewContainer}>
                        <img src={fotoPreview} alt="Foto preview" style={styles.previewImage} />
                        <span style={styles.changeText}>Cambiar imagen</span>
                      </div>
                    ) : (
                      <div style={styles.uploadPlaceholder}>
                        <FaImage style={styles.uploadIcon} />
                        <span style={styles.uploadText}>Subir foto</span>
                        <span style={styles.uploadHint}>PNG, JPG (max 2MB)</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* BOTÓN DE ENVÍO */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {})
              }}
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
                  Enviando solicitud segura...
                </>
              ) : (
                <>
                  Enviar Registro
                  <FaArrowRight style={styles.arrowIcon} />
                </>
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Al enviar este formulario, aceptas los términos y condiciones de Bean Quick Business.
              Un administrador revisará tu solicitud en las próximas 24-48 horas.
            </p>
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
    padding: '40px 20px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  bgCircle1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 94, 60, 0.08) 0%, transparent 70%)',
    top: '-200px',
    right: '-200px',
    pointerEvents: 'none'
  },
  bgCircle2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(111, 78, 55, 0.06) 0%, transparent 70%)',
    bottom: '-150px',
    left: '-150px',
    pointerEvents: 'none'
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '40px',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(62, 39, 35, 0.08)'
  },
  brandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    marginBottom: '30px'
  },
  logoCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'linear-gradient(165deg, #6F4E37 0%, #8B5E3C 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  logoIcon: {
    fontSize: '2rem',
    color: '#FFFFFF'
  },
  brandTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#3E2723',
    marginBottom: '5px',
    letterSpacing: '-0.5px'
  },
  brandSubtitle: {
    fontSize: '1.05rem',
    color: '#8D6E63'
  },
  benefitsRow: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  benefitBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#F5EBE0',
    padding: '10px 18px',
    borderRadius: '50px',
    fontSize: '0.9rem',
    color: '#5D4037',
    fontWeight: '600'
  },
  badgeIcon: {
    color: '#8B5E3C',
    fontSize: '1rem'
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '50px',
    boxShadow: '0 10px 30px rgba(62, 39, 35, 0.08)'
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    color: '#B91C1C',
    padding: '14px 18px',
    borderRadius: '12px',
    marginBottom: '30px',
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
    gap: '25px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px'
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
    fontSize: '1.05rem'
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
  textareaBox: {
    position: 'relative',
    backgroundColor: '#FAFAFA',
    borderRadius: '14px',
    border: '2px solid #E8E0D8',
    transition: 'all 0.3s'
  },
  textareaIcon: {
    position: 'absolute',
    left: '18px',
    top: '18px',
    color: '#A0816C',
    fontSize: '1.05rem'
  },
  textarea: {
    width: '100%',
    padding: '16px 18px 16px 52px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '1rem',
    color: '#3E2723',
    outline: 'none',
    fontWeight: '500',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  fileUploadBox: {
    position: 'relative'
  },
  fileInput: {
    display: 'none'
  },
  fileLabel: {
    display: 'block',
    cursor: 'pointer'
  },
  uploadPlaceholder: {
    backgroundColor: '#FAFAFA',
    border: '2px dashed #E8E0D8',
    borderRadius: '14px',
    padding: '30px 20px',
    textAlign: 'center',
    transition: 'all 0.3s',
    ':hover': {
      borderColor: '#8B5E3C',
      backgroundColor: '#FFFFFF'
    }
  },
  uploadIcon: {
    fontSize: '2.5rem',
    color: '#A0816C',
    marginBottom: '10px',
    display: 'block',
    margin: '0 auto 10px'
  },
  uploadText: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: '5px'
  },
  uploadHint: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#8D6E63'
  },
  previewContainer: {
    position: 'relative',
    borderRadius: '14px',
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
    border: '2px solid #E8E0D8'
  },
  previewImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    display: 'block'
  },
  changeText: {
    display: 'block',
    padding: '10px',
    textAlign: 'center',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#8B5E3C',
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
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
    marginTop: '15px'
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
  footer: {
    marginTop: '30px',
    paddingTop: '25px',
    borderTop: '1px solid #E8E0D8'
  },
  footerText: {
    fontSize: '0.85rem',
    color: '#8D6E63',
    lineHeight: 1.6,
    textAlign: 'center'
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

export default RegistroEmpresa;