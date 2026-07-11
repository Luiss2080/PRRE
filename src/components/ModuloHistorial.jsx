import React, { useState, useEffect } from 'react';
import { useAutenticacion } from '../context/ContextoAutenticacion';
import { getReservas } from '../utils/datosSimulados';
import { Search, Calendar, Download, CheckCircle, Clock, XCircle, BarChart2 } from 'lucide-react';

/**
 * ModuloHistorial
 * Componente que muestra la bitácora histórica de todas las reservas de recursos y espacios.
 * Los usuarios docentes y estudiantes ven solo su historial, mientras que los administradores
 * pueden ver y exportar los reportes de todas las reservas registradas en el colegio.
 */
export default function ModuloHistorial() {
  const { usuarioActual } = useAutenticacion();
  const esAdmin = usuarioActual?.rol === 'Administrador';

  const [reservas, setReservas] = useState([]);
  
  // Estados para filtros
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [fechaFiltro, setFechaFiltro] = useState('');

  // Estado para la simulación de descarga de reportes
  const [descargando, setDescargando] = useState(false);

  const cargarReservas = () => {
    setReservas(getReservas());
  };

  useEffect(() => {
    cargarReservas();
    window.addEventListener('prre_db_update', cargarReservas);
    return () => window.removeEventListener('prre_db_update', cargarReservas);
  }, []);

  // Lógica de visibilidad de datos: Los usuarios normales solo ven sus propios préstamos
  const reservasVisibles = reservas.filter(res => {
    if (esAdmin) return true;
    return res.usuarioId === usuarioActual?.id;
  });

  // Filtra los datos según la barra de búsqueda y selectores
  const reservasFiltradas = reservasVisibles.filter(res => {
    const coincideBusqueda = res.itemName.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                            res.usuarioNombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                            res.motivo.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todos' || res.estado === filtroEstado;
    const coincideTipo = filtroTipo === 'Todos' || res.tipoRecurso === filtroTipo;
    const coincideFecha = !fechaFiltro || res.fechaInicio === fechaFiltro;

    return coincideBusqueda && coincideEstado && coincideTipo && coincideFecha;
  });

  // Cálculo de estadísticas basadas en la lista visible actual
  const totalReservas = reservasVisibles.length;
  const cantidadAprobadas = reservasVisibles.filter(r => r.estado === 'Aprobada').length;
  const cantidadFinalizadas = reservasVisibles.filter(r => r.estado === 'Finalizada').length;
  const cantidadRechazadas = reservasVisibles.filter(r => r.estado === 'Rechazada').length;
  const cantidadPendientes = reservasVisibles.filter(r => r.estado === 'Pendiente').length;

  const tasaAprobacion = totalReservas > 0 
    ? Math.round(((cantidadAprobadas + cantidadFinalizadas) / totalReservas) * 100) 
    : 0;

  // Retorna la insignia de estado correspondiente
  const obtenerInsigniaEstado = (estado) => {
    switch (estado) {
      case 'Aprobada': return <span className="badge badge-success">Aprobada</span>;
      case 'Pendiente': return <span className="badge badge-warning">Pendiente</span>;
      case 'Rechazada': return <span className="badge badge-danger">Rechazada</span>;
      case 'Finalizada': return <span className="badge badge-info">Finalizada</span>;
      case 'Cancelada': return <span className="badge" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-muted)' }}>Cancelada</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  // Simulación de la exportación de reportes institucionales
  const alExportarReporte = () => {
    setDescargando(true);
    setTimeout(() => {
      setDescargando(false);
      alert(`Reporte PDF generado exitosamente.\nRegistros incluidos: ${reservasFiltradas.length}\nFiltro actual: ${filtroEstado} / ${filtroTipo}\nDestino: Descargas/Reporte_PRRE_${new Date().toISOString().substring(0,10)}.pdf`);
    }, 1500);
  };

  return (
    <div>
      {/* Panel de Estadísticas Rápidas del Historial */}
      <div className="grid-cols-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
            <BarChart2 size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{totalReservas}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Reservas Históricas</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <CheckCircle size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{tasaAprobacion}%</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tasa de Aprobación</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <Clock size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{cantidadPendientes}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>En Cola de Espera</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
            <XCircle size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{cantidadRechazadas}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Rechazadas</span>
          </div>
        </div>
      </div>

      {/* Caja de Herramientas de Filtros */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <h3 style={{ fontSize: '0.9375rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Filtros de Búsqueda
          </h3>
          <button 
            onClick={alExportarReporte} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', gap: '0.375rem' }}
            disabled={descargando || reservasFiltradas.length === 0}
          >
            {descargando ? (
              <>
                <span className="loading-spinner" style={{ width: '12px', height: '12px', borderSize: '2px' }}></span>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Exportar Reporte</span>
              </>
            )}
          </button>
        </div>

        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 1fr', 
            gap: '1rem' 
          }}
          className="grid-cols-4"
        >
          {/* Barra de búsqueda integrada */}
          <div className="search-container" style={{ maxWidth: 'none' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por recurso, justificación, usuario..." 
              className="search-input"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <select 
              className="form-select" 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Aprobada">Aprobadas</option>
              <option value="Rechazada">Rechazadas</option>
              <option value="Finalizada">Finalizadas</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>

          {/* Filtro por tipo de préstamo */}
          <div>
            <select 
              className="form-select" 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="Todos">Todos los tipos</option>
              <option value="recurso">Recursos</option>
              <option value="espacio">Espacios</option>
            </select>
          </div>

          {/* Filtro por fecha de préstamo */}
          <div style={{ position: 'relative' }}>
            <input 
              type="date" 
              className="form-input" 
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              title="Filtrar por fecha de inicio"
            />
          </div>
        </div>
      </div>

      {/* Tabla del Log Histórico */}
      <div className="table-container">
        {reservasFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No se encontraron registros históricos con los filtros aplicados.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Recurso/Espacio</th>
                <th>Solicitado por</th>
                <th>Tipo</th>
                <th style={{ textAlign: 'center' }}>Cantidad</th>
                <th>Fecha de Reserva</th>
                <th>Horario</th>
                <th>Estado Final</th>
                <th>Justificación</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map(res => (
                <tr key={res.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {res.id}
                  </td>
                  <td style={{ fontWeight: '700' }}>{res.itemName}</td>
                  <td>{res.usuarioNombre}</td>
                  <td>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '600', 
                        textTransform: 'uppercase',
                        color: res.tipoRecurso === 'recurso' ? 'var(--color-brand-cyan)' : 'var(--color-brand-gold)'
                      }}
                    >
                      {res.tipoRecurso === 'recurso' ? 'Recurso' : 'Espacio'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '600' }}>
                    {res.tipoRecurso === 'recurso' ? `${res.cantidad} ud.` : '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                      <Calendar size={14} className="text-muted" />
                      <span>{res.fechaInicio}</span>
                    </div>
                  </td>
                  <td>{res.horaInicio} - {res.horaFin}</td>
                  <td>{obtenerInsigniaEstado(res.estado)}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={res.motivo}>
                    {res.motivo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
