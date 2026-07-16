import React, { useState, useEffect } from 'react';
import { useAutenticacion } from '../context/ContextoAutenticacion';
import { X, Mail, Lock, User } from 'lucide-react';

/**
 * ModalAutenticacion
 * Componente modal que maneja el inicio de sesión y registro de usuarios escolares.
 */
export default function ModalAutenticacion({ estaAbierto, alCerrar, pestañaInicial = 'login' }) {
  const { iniciarSesion, registrar } = useAutenticacion();
  const [pestaña, setPestaña] = useState(pestañaInicial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('Docente');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarMensajeBusch, setMostrarMensajeBusch] = useState(true);

  // Sincroniza y limpia los campos del formulario cada vez que el modal se abre/cierra
  useEffect(() => {
    if (estaAbierto) {
      setPestaña(pestañaInicial);
      setError('');
      setEmail('');
      setPassword('');
      setConfirmarPassword('');
      setNombre('');
      setRol('Docente');
      setMostrarMensajeBusch(true);
    }
  }, [estaAbierto, pestañaInicial]);

  if (!estaAbierto) return null;

  // Maneja el envío del formulario de login y registro
  const alEnviar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (pestaña === 'login') {
        if (!email || !password) {
          throw new Error('Por favor, rellene todos los campos.');
        }
        await iniciarSesion(email, password);
        alCerrar();
      } else {
        if (!email || !password || !nombre || !confirmarPassword) {
          throw new Error('Por favor, rellene todos los campos.');
        }
        if (password !== confirmarPassword) {
          throw new Error('Las contraseñas no coinciden.');
        }
        if (password.length < 4) {
          throw new Error('La contraseña debe tener al menos 4 caracteres.');
        }
        await registrar(nombre, email, password, rol);
        alCerrar();
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        {/* Banner de marca del LogoInstitucional.png dentro del modal */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1.5rem', gap: '0.35rem' }}>
          <img 
            src="/LogoInstitucional.png" 
            alt="Logo PRRE" 
            style={{ width: '56px', height: 'auto', display: 'block', filter: 'drop-shadow(0 2px 8px rgba(0, 229, 255, 0.2))' }} 
          />
          <span style={{ fontSize: '0.625rem', fontWeight: '800', color: 'var(--color-brand-cyan-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Portal de Reserva • U.E. Germán Busch B
          </span>
        </div>

        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0, paddingTop: '0.5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.35rem' }}>
            {pestaña === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button 
            onClick={alCerrar} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={alEnviar} className="modal-body" style={{ paddingTop: '1rem' }}>
          {error && (
            <div 
              style={{ 
                backgroundColor: 'var(--color-danger-bg)', 
                color: 'var(--color-danger)', 
                padding: '0.75rem', 
                borderRadius: 'var(--border-radius-sm)', 
                fontSize: '0.8125rem',
                marginBottom: '1rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontWeight: '500'
              }}
            >
              {error}
            </div>
          )}

          {pestaña === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <div style={{ position: 'relative' }}>
                  <User 
                    size={16} 
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. Juan Pérez" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Cuenta (Rol)</label>
                <select 
                  className="form-select" 
                  value={rol} 
                  onChange={(e) => setRol(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Docente">Docente</option>
                  <option value="Estudiante">Estudiante</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Correo Institucional</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={16} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input 
                type="email" 
                className="form-input" 
                placeholder="ejemplo@colegio.edu.bo" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={16} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {pestaña === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Confirmar Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <Lock 
                    size={16} 
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
                  />
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={confirmarPassword} 
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4" 
            disabled={cargando}
          >
            {cargando ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="loading-spinner" style={{ width: '16px', height: '16px', borderSize: '2px' }}></span>
                Procesando...
              </span>
            ) : (
              pestaña === 'login' ? 'Ingresar' : 'Registrarse'
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {pestaña === 'login' ? (
              <>
                ¿No tienes cuenta institucional?{' '}
                <button 
                  type="button" 
                  onClick={() => { setPestaña('register'); setError(''); }} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-brand-cyan)', fontWeight: '600', cursor: 'pointer' }}
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{' '}
                <button 
                  type="button" 
                  onClick={() => { setPestaña('login'); setError(''); }} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-brand-cyan)', fontWeight: '600', cursor: 'pointer' }}
                >
                  Inicia sesión
                </button>
              </>
            )}
          </div>
        </form>

        {mostrarMensajeBusch && (
          <div 
            onMouseEnter={() => setMostrarMensajeBusch(false)}
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              padding: '1rem', 
              textAlign: 'center', 
              borderTop: '1px solid var(--border-color)', 
              fontSize: '0.75rem', 
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease'
            }}
          >
            Acceso exclusivo para personal y estudiantes de la <b>U.E. Germán Busch B</b>.
          </div>
        )}
      </div>
    </div>
  );
}
