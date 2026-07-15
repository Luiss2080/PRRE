import React, { useEffect, useState } from 'react';
import { useAutenticacion } from '../context/ContextoAutenticacion';
import { getRecursos, getEspacios, getReservas, getUsuarios } from '../utils/datosSimulados';
import { 
  Laptop, 
  MapPin, 
  CalendarCheck2, 
  Clock, 
  ArrowRight,
  AlertTriangle,
  UserCheck,
  Layers,
  BookOpen
} from 'lucide-react';

// Componente interno para renderizar los anillos de progreso circulares de forma vectorial y moderna
const CirculoProgreso = ({ porcentaje, color, etiqueta, valor }) => {
  const radio = 28;
  const circunferencia = 2 * Math.PI * radio;
  const strokeDashoffset = circunferencia - (porcentaje / 100) * circunferencia;
  
  return (
    <div 
      className="progress-circle-container" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '0.4rem', 
        flex: '1 1 20%', 
        minWidth: '85px',
        cursor: 'pointer'
      }}
    >
      <div style={{ position: 'relative', width: '70px', height: '70px' }} className="circle-hover">
        <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
          {/* Círculo trasero */}
          <circle 
            cx="35" 
            cy="35" 
            r={radio} 
            fill="transparent" 
            stroke="var(--border-color)" 
            strokeWidth="4" 
          />
          {/* Círculo delantero animado con brillo */}
          <circle 
            cx="35" 
            cy="35" 
            r={radio} 
            fill="transparent" 
            stroke={color} 
            strokeWidth="4" 
            strokeDasharray={circunferencia} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            style={{ 
              transition: 'stroke-dashoffset 0.6s ease-in-out', 
              filter: `drop-shadow(0 0 3px ${color})` 
            }}
          />
        </svg>
        {/* Porcentaje en el centro */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            fontWeight: '800', 
            fontSize: '0.8rem',
            color: 'var(--text-primary)'
          }}
        >
          {porcentaje}%
        </div>
      </div>
      <span style={{ fontSize: '0.72rem', fontWeight: '750', color: 'var(--text-secondary)', textAlign: 'center' }}>{etiqueta}</span>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>({valor} sol.)</span>
    </div>
  );
};

/**
 * PanelControl
 * Componente que representa el panel principal (Dashboard) de la aplicación,
 * mostrando estadísticas globales, gráficos rápidos y accesos directos.
 */
export default function PanelControl({ establecerPestañaActiva }) {
  const { usuarioActual } = useAutenticacion();
  const [estadisticas, setEstadisticas] = useState({
    cantidadRecursos: 0,
    cantidadEspacios: 0,
    reservasAprobadas: 0,
    reservasPendientes: 0,
    reservasRecientes: [],
    misReservasActivas: [],
    cantidadUsuarios: 0,
    todasLasReservas: []
  });

  useEffect(() => {
    // Carga los datos estadísticos desde la base de datos simulada en LocalStorage
    const cargarEstadisticas = () => {
      const recursos = getRecursos();
      const espacios = getEspacios();
      const reservas = getReservas();
      const usuarios = getUsuarios();

      const aprobadas = reservas.filter(r => r.estado === 'Aprobada').length;
      const pendientes = reservas.filter(r => r.estado === 'Pendiente').length;

      // Ordenar las reservas por fecha/id (más recientes primero)
      const ordenadas = [...reservas].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4);

      // Obtener reservas activas/pendientes del usuario actual
      const misReservas = reservas
        .filter(r => r.usuarioId === usuarioActual?.id && (r.estado === 'Aprobada' || r.estado === 'Pendiente'))
        .slice(0, 3);

      setEstadisticas({
        cantidadRecursos: recursos.length,
        cantidadEspacios: espacios.length,
        reservasAprobadas: aprobadas,
        reservasPendientes: pendientes,
        reservasRecientes: ordenadas,
        misReservasActivas: misReservas,
        cantidadUsuarios: usuarios.length,
        todasLasReservas: reservas
      });
    };

    cargarEstadisticas();
    // Escucha eventos de actualización de la BD simulada
    window.addEventListener('prre_db_update', cargarEstadisticas);
    return () => window.removeEventListener('prre_db_update', cargarEstadisticas);
  }, [usuarioActual]);

  // Retorna la clase CSS adecuada según el estado de la reserva
  const obtenerClaseInsigniaEstado = (estado) => {
    switch (estado) {
      case 'Aprobada': return 'badge-success';
      case 'Pendiente': return 'badge-warning';
      case 'Rechazada':
      case 'Cancelada': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  // Datos simulados para el gráfico de frecuencia semanal de reservas
  const datosGrafico = [
    { dia: 'Lun', valor: 8, altura: '45%' },
    { dia: 'Mar', valor: 12, altura: '65%' },
    { dia: 'Mié', valor: 19, altura: '90%' },
    { dia: 'Jue', valor: 10, altura: '55%' },
    { dia: 'Vie', valor: 15, altura: '80%' },
    { dia: 'Sáb', valor: 4, altura: '25%' },
    { dia: 'Dom', valor: 1, altura: '10%' },
  ];

  // Cálculos dinámicos para gráficos interactivos
  const todasLasReservas = estadisticas.todasLasReservas || [];
  
  // Gráfico 1: Recursos más solicitados (Top 5)
  const conteoRecursos = {};
  todasLasReservas.forEach(r => {
    conteoRecursos[r.itemName] = (conteoRecursos[r.itemName] || 0) + 1;
  });
  const recursosMasSolicitados = Object.entries(conteoRecursos)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  
  const maxConteo = recursosMasSolicitados.length > 0 ? Math.max(...recursosMasSolicitados.map(r => r.total)) : 1;

  // Gráfico 2: Distribución por Estado de Reservas
  const totalRes = todasLasReservas.length || 1;
  const cantAprobadas = todasLasReservas.filter(r => r.estado === 'Aprobada').length;
  const cantPendientes = todasLasReservas.filter(r => r.estado === 'Pendiente').length;
  const cantFinalizadas = todasLasReservas.filter(r => r.estado === 'Finalizada').length;
  const cantRechazadasCanceladas = todasLasReservas.filter(r => r.estado === 'Rechazada' || r.estado === 'Cancelada').length;
  
  const porcAprobadas = Math.round((cantAprobadas / totalRes) * 100);
  const porcPendientes = Math.round((cantPendientes / totalRes) * 100);
  const porcFinalizadas = Math.round((cantFinalizadas / totalRes) * 100);
  const porcRechazadasCanceladas = Math.round((cantRechazadasCanceladas / totalRes) * 100);

  return (
    <div>
      {/* Inyección de estilos dinámicos para los efectos hover del gráfico */}
      <style dangerouslySetInnerHTML={{__html: `
        .chart-bar-container:hover .chart-tooltip {
          opacity: 1 !important;
          transform: translateY(-8px) scale(1) !important;
        }
        .chart-bar:hover {
          filter: brightness(1.15) !important;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.4) !important;
        }
        .progress-circle-container:hover .circle-hover {
          transform: scale(1.08) !important;
          filter: brightness(1.1) !important;
        }
        .circle-hover {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .horizontal-bar-row:hover {
          background-color: rgba(255, 255, 255, 0.03) !important;
        }
        .horizontal-bar-row:hover .h-bar {
          filter: brightness(1.2) !important;
          box-shadow: 0 0 10px var(--bar-color-glow) !important;
          transform: scaleX(1.02);
        }
        .h-bar {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: left;
        }
      `}} />

      {/* Banner de Bienvenida */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(0, 229, 255, 0.04) 100%)',
          marginBottom: '2rem',
          padding: '1.75rem 2rem',
          borderLeft: '5px solid var(--color-brand-cyan-muted)'
        }}
      >
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          ¡Bienvenido de nuevo, <span style={{ color: 'var(--color-brand-cyan-muted)' }}>{usuarioActual?.nombre}</span>!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '700px' }}>
          Monitorea y solicita equipos interactivos y laboratorios escolares de la <b>U.E. Germán Busch B</b>.
        </p>
      </div>

      {/* Tarjetas de Estadísticas Rápidas */}
      <div className="grid-cols-4">
        <div className="glass-card stat-card glow-card-cyan" style={{ borderLeft: '4px solid var(--color-brand-cyan-muted)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-brand-cyan-muted)' }}>
            <Laptop size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{estadisticas.cantidadRecursos}</span>
            <span className="stat-label">Recursos Totales</span>
          </div>
        </div>

        <div className="glass-card stat-card glow-card-gold" style={{ borderLeft: '4px solid var(--color-brand-gold)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-brand-gold)' }}>
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{estadisticas.cantidadEspacios}</span>
            <span className="stat-label">Aulas / Laboratorios</span>
          </div>
        </div>

        <div className="glass-card stat-card glow-card-cyan" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <CalendarCheck2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{estadisticas.reservasAprobadas}</span>
            <span className="stat-label">Aprobadas Activas</span>
          </div>
        </div>

        <div className="glass-card stat-card glow-card-gold" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{estadisticas.reservasPendientes}</span>
            <span className="stat-label">Pendientes de Aprobación</span>
          </div>
        </div>
      </div>

      {/* Grid Principal: Columna Izquierda (Actividad) | Columna Derecha (Gráfico y Acciones) */}
      <div className="grid-cols-2" style={{ gap: '2rem' }}>
        
        {/* Pila de Columna Izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Panel de Reservas Recientes */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
            <div className="flex justify-between align-center mb-4">
              <h3 style={{ fontSize: '1.125rem', fontWeight: '800' }}>Actividad Reciente</h3>
              <button 
                onClick={() => establecerPestañaActiva('reservas')}
                className="btn btn-secondary" 
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
              >
                Ver todas <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              {estadisticas.reservasRecientes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  No hay actividad de préstamos registrada.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {estadisticas.reservasRecientes.map(res => (
                    <div 
                      key={res.id} 
                      style={{ 
                        padding: '0.85rem 1rem', 
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
                      <span className={`badge ${obtenerClaseInsigniaEstado(res.estado)}`}>
                        {res.estado}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Consola resumida de administración si aplica */}
          {usuarioActual?.rol === 'Administrador' && (
            <div className="glass-card" style={{ borderLeft: '4px solid var(--color-brand-cyan-muted)' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}>
                <UserCheck size={20} color="var(--color-brand-cyan-muted)" />
                Consola del Administrador
              </h3>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '0.75rem' 
                }}
              >
                <div style={estiloMiniDatoAdmin}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Usuarios Registrados</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: '800' }}>{estadisticas.cantidadUsuarios} cuentas</span>
                </div>
                <div style={estiloMiniDatoAdmin}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Licencia Escolar</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--color-success)' }}>EPDB Convenio</span>
                </div>
              </div>
            </div>
          )}

          {/* Panel de Mis Reservas Activas (Solo Docente) */}
          {usuarioActual?.rol !== 'Administrador' && (
            <div className="glass-card" style={{ borderLeft: '4px solid var(--color-brand-cyan-muted)' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}>
                <CalendarCheck2 size={20} color="var(--color-brand-cyan-muted)" />
                Mis Solicitudes Activas
              </h3>
              {estadisticas.misReservasActivas.length === 0 ? (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                  No tienes reservas pendientes ni aprobadas en este momento.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {estadisticas.misReservasActivas.map(res => (
                    <div 
                      key={res.id} 
                      style={{ 
                        padding: '0.65rem 0.85rem', 
                        borderRadius: 'var(--border-radius-sm)', 
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: '700' }}>{res.itemName}</span>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.6875rem', marginTop: '0.125rem' }}>
                          Horario: {res.fechaInicio} • {res.horaInicio} - {res.horaFin}
                        </div>
                      </div>
                      <span className={`badge ${obtenerClaseInsigniaEstado(res.estado)}`} style={{ fontSize: '0.625rem', padding: '0.15rem 0.4rem' }}>
                        {res.estado}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pila de Columna Derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Gráfico semanal */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', fontWeight: '800' }}>Frecuencia de Reservas Semanal</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '0 0.5rem', gap: '0.75rem', marginTop: 'auto' }}>
              {datosGrafico.map((data, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <div className="chart-bar-container" style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    {/* Tooltip de valor */}
                    <div style={estiloTooltip} className="chart-tooltip">{data.valor} reservas</div>
                    <div 
                      className="chart-bar"
                      style={{ 
                        ...estiloBarra, 
                        height: data.altura, 
                        background: index % 2 === 0 
                          ? 'linear-gradient(to top, var(--color-brand-blue-light), var(--color-brand-cyan))' 
                          : 'linear-gradient(to top, var(--color-brand-gold-hover), var(--color-brand-gold))' 
                      }} 
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{data.dia}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel de Acciones Rápidas */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '800' }}>Panel de Acciones</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => establecerPestañaActiva('reservas')}
                className="btn btn-primary w-full" 
                style={{ justifyContent: 'space-between' }}
              >
                <span>Nueva Solicitud de Reserva</span>
                <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={() => establecerPestañaActiva('recursos')}
                className="btn btn-secondary w-full" 
                style={{ justifyContent: 'space-between' }}
              >
                <span>Explorar Catálogo de Recursos</span>
                <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={() => establecerPestañaActiva('espacios')}
                className="btn btn-secondary w-full" 
                style={{ justifyContent: 'space-between' }}
              >
                <span>Aulas y Laboratorios Libres</span>
                <ArrowRight size={16} />
              </button>
            </div>
            
            {/* Panel de Advertencia */}
            <div 
              style={{ 
                padding: '0.85rem 1rem',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'var(--color-warning-bg)',
                color: 'var(--color-brand-gold-hover)',
                border: '1px solid rgba(255, 159, 28, 0.2)',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start',
                fontSize: '0.8125rem',
                marginTop: '0.5rem'
              }}
            >
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ fontWeight: '700' }}>Importante:</span> Recuerda entregar los proyectores y laptops a tiempo para evitar sanciones y retrasos a otros cursos.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const estiloMiniDatoAdmin = {
  border: '1px solid var(--border-color)',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--border-radius-sm)',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0,0,0,0.01)'
};

const estiloTooltip = {
  position: 'absolute',
  top: '-35px',
  backgroundColor: 'var(--bg-sidebar)',
  border: '1px solid var(--border-color)',
  color: 'white',
  padding: '0.35rem 0.65rem',
  borderRadius: '4px',
  fontSize: '0.6875rem',
  fontWeight: '800',
  opacity: 0,
  transform: 'translateY(0) scale(0.9)',
  transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  boxShadow: 'var(--shadow-md)',
  zIndex: 10
};

const estiloBarra = {
  width: '100%',
  borderRadius: '6px 6px 0 0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
};
