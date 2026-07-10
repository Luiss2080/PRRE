import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('Docente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setNombre('');
      setRol('Docente');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        if (!email || !password) {
          throw new Error('Por favor, rellene todos los campos.');
        }
        await login(email, password);
        onClose();
      } else {
        if (!email || !password || !nombre || !confirmPassword) {
          throw new Error('Por favor, rellene todos los campos.');
        }
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden.');
        }
        if (password.length < 4) {
          throw new Error('La contraseña debe tener al menos 4 caracteres.');
        }
        await register(nombre, email, password, rol);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <h2 className="gradient-text" style={{ fontSize: '1.5rem' }}>
            {tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button 
            onClick={onClose} 
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

        <form onSubmit={handleSubmit} className="modal-body" style={{ paddingTop: '1rem' }}>
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

          {tab === 'register' && (
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

          {tab === 'register' && (
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
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rol del Usuario</label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck 
                    size={16} 
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
                  />
                  <select 
                    className="form-select" 
                    value={rol} 
                    onChange={(e) => setRol(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  >
                    <option value="Docente">Docente</option>
                    <option value="Estudiante">Estudiante</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4" 
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="loading-spinner" style={{ width: '16px', height: '16px', borderSize: '2px' }}></span>
                Procesando...
              </span>
            ) : (
              tab === 'login' ? 'Ingresar' : 'Registrarse'
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {tab === 'login' ? (
              <>
                ¿No tienes cuenta institucional?{' '}
                <button 
                  type="button" 
                  onClick={() => { setTab('register'); setError(''); }} 
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
                  onClick={() => { setTab('login'); setError(''); }} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-brand-cyan)', fontWeight: '600', cursor: 'pointer' }}
                >
                  Inicia sesión
                </button>
              </>
            )}
          </div>
        </form>

        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Acceso exclusivo para personal y estudiantes de la <b>U.E. Germán Busch B</b>.
        </div>
      </div>
    </div>
  );
}
