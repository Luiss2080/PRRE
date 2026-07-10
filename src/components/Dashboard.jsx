import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecursos, getEspacios, getReservas, getUsuarios } from '../utils/mockData';
import { 
  Laptop, 
  MapPin, 
  CalendarCheck2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function Dashboard({ setCurrentTab }) {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    recursosCount: 0,
    espaciosCount: 0,
    reservasAprobadas: 0,
    reservasPendientes: 0,
    recentReservations: [],
    usersCount: 0
  });

  useEffect(() => {
    const loadStats = () => {
      const recs = getRecursos();
      const esps = getEspacios();
      const res = getReservas();
      const users = getUsuarios();

      const aprobadas = res.filter(r => r.estado === 'Aprobada').length;
      const pendientes = res.filter(r => r.estado === 'Pendiente').length;

      // Sort recent reservations by date/time (newest first)
      const sortedRes = [...res].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

      setStats({
        recursosCount: recs.length,
        espaciosCount: esps.length,
        reservasAprobadas: aprobadas,
        reservasPendientes: pendientes,
        recentReservations: sortedRes,
        usersCount: users.length
      });
    };

    loadStats();
    // Add event listener to capture custom db updates
    window.addEventListener('prre_db_update', loadStats);
    return () => window.removeEventListener('prre_db_update', loadStats);
  }, []);

  const getStatusBadgeClass = (estado) => {
    switch (estado) {
      case 'Aprobada': return 'badge-success';
      case 'Pendiente': return 'badge-warning';
      case 'Rechazada':
      case 'Cancelada': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <div>
      {/* Greeting Banner */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(0, 180, 216, 0.05) 100%)',
          marginBottom: '2rem',
          padding: '2rem'
        }}
      >
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          ¡Bienvenido de nuevo, <span style={{ color: 'var(--color-brand-cyan)' }}>{currentUser?.nombre}</span>!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '600px' }}>
          Desde aquí puedes gestionar, reservar y revisar los recursos y espacios educativos de la <b>U.E. Germán Busch B</b>.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4">
        <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--color-brand-cyan)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-brand-cyan)' }}>
            <Laptop size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.recursosCount}</span>
            <span className="stat-label">Recursos Totales</span>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--color-brand-gold)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-brand-gold)' }}>
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.espaciosCount}</span>
            <span className="stat-label">Espacios Físicos/Virtuales</span>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <CalendarCheck2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.reservasAprobadas}</span>
            <span className="stat-label">Reservas Aprobadas</span>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.reservasPendientes}</span>
            <span className="stat-label">Reservas Pendientes</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent reservations & Quick Actions */}
      <div className="grid-cols-2">
        {/* Recent Reservations Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between align-center mb-4">
            <h3 style={{ fontSize: '1.125rem' }}>Actividad Reciente</h3>
            <button 
              onClick={() => setCurrentTab('reservas')}
              className="btn btn-secondary" 
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
            >
              Ver todas <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            {stats.recentReservations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No hay actividad reciente en las reservas.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.recentReservations.map(res => (
                  <div 
                    key={res.id} 
                    style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: 'var(--border-radius-sm)', 
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', marginBottom: '0.125rem' }}>{res.itemName}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        Por: {res.usuarioNombre} • {res.fechaInicio}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(res.estado)}`}>
                      {res.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Acceso Rápido</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Realiza las operaciones más comunes de forma inmediata desde aquí.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => setCurrentTab('reservas')}
                className="btn btn-primary w-full" 
                style={{ justifyContent: 'space-between' }}
              >
                <span>Solicitar una nueva reserva</span>
                <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={() => setCurrentTab('recursos')}
                className="btn btn-secondary w-full" 
                style={{ justifyContent: 'space-between' }}
              >
                <span>Explorar Recursos Educativos</span>
                <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={() => setCurrentTab('espacios')}
                className="btn btn-secondary w-full" 
                style={{ justifyContent: 'space-between' }}
              >
                <span>Ver Disponibilidad de Espacios</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Quick Notice Panel */}
          <div 
            style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'var(--color-warning-bg)',
              color: 'var(--color-brand-gold-hover)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              fontSize: '0.8125rem'
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <span style={{ fontWeight: '700' }}>Nota de Reserva:</span> Las reservas de laboratorios de computación deben solicitarse con un mínimo de 24 horas de anticipación.
            </div>
          </div>
        </div>
      </div>

      {/* Administrator Special Overview */}
      {currentUser?.rol === 'Administrador' && (
        <div className="glass-card" style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={20} color="var(--color-brand-cyan)" />
            Panel Administrativo de Control
          </h3>
          <div className="grid-cols-4" style={{ gap: '1rem', marginBottom: 0 }}>
            <div style={adminQuickStatStyle}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Usuarios en el Sistema</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{stats.usersCount} registrados</span>
            </div>
            <div style={adminQuickStatStyle}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Filtro de Seguridad</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-success)' }}>Activo</span>
            </div>
            <div style={adminQuickStatStyle}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rol del Operador</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-brand-gold)' }}>Super-Admin</span>
            </div>
            <div style={adminQuickStatStyle}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Licencia de Software</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Educativa EPDB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const adminQuickStatStyle = {
  border: '1px solid var(--border-color)',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--border-radius-sm)',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0,0,0,0.01)'
};
