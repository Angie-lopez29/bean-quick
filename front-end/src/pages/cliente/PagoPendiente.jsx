import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PagoPendiente = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pedido = location.state?.pedido;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Pago Pendiente ⏳</h2>
      <p>Tu pago está siendo procesado. Por favor, revisa el estado en unos minutos.</p>
      {pedido && (
        <div style={styles.resumen}>
          <h4>Resumen del Pedido</h4>
          <p><strong>ID Pedido:</strong> {pedido.id}</p>
          <p><strong>Total:</strong> ${pedido.total}</p>
          <p><strong>Estado:</strong> {pedido.estado}</p>
        </div>
      )}
      <button style={styles.btn} onClick={() => navigate('/cliente/mis-pedidos')}>Ir a Mis Pedidos</button>
    </div>
  );
};

const styles = {
  container: { maxWidth: 400, margin: '40px auto', padding: 30, background: '#fff', borderRadius: 16, boxShadow: '0 2px 10px #eee', textAlign: 'center' },
  title: { color: '#f1c40f', marginBottom: 20 },
  resumen: { background: '#f9f9f9', padding: 15, borderRadius: 8, margin: '20px 0' },
  btn: { padding: '12px 24px', background: '#6f4e37', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', marginTop: 20 }
};

export default PagoPendiente;
