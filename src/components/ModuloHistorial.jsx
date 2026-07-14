import React, { useState, useEffect } from 'react';
import { getReservas } from '../utils/datosSimulados';
import { 
  Search, 
  Calendar, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle, 
  BarChart2,
  Table,
  CalendarDays,
  Laptop,
  MapPin,
  Info,
  Layers
} from 'lucide-react';

/**
 * ModuloHistorial
 * Componente que muestra la bitácora histórica de todas las reservas de recursos y espacios.
 * Muestra estadísticas rápidas y provee dos vistas principales:
 * 1. Vista Tabla: Historial paginado tradicional con filtros y búsqueda.
 * 2. Vista Cronograma: Agenda visual interactiva para ver quién reservó qué, en qué tiempos y qué está ocupado.
 */
export default function ModuloHistorial() {


  const [reservas, setReservas] = useState([]);
  
  // Pestaña de visualización activa: 'tabla' o 'cronograma'
  const [vistaHistorial, setVistaHistorial] = useState('tabla');

  // Estados para filtros
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [fechaFiltro, setFechaFiltro] = useState('');

  // Estado para la paginación
  const [paginaActual, setPaginaActual] = useState(1);

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

  // Reinicia la paginación cuando cambia cualquier filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [terminoBusqueda, filtroEstado, filtroTipo, fechaFiltro, vistaHistorial]);

  // Todos los usuarios ven todas las reservas para coordinar tiempos y evitar choques
  const reservasVisibles = reservas;

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

  // Paginación
  const itemsPorPagina = 6;
  const totalPaginas = Math.ceil(reservasFiltradas.length / itemsPorPagina);
  const reservasPaginadas = reservasFiltradas.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  // Cálculo de estadísticas globales
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

  // Simulación de la exportación de reportes
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
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Reservas Totales</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <CheckCircle size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{tasaAprobacion}%</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Aprobación Escolar</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <Clock size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{cantidadPendientes}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>En Espera</span>
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

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', width: '100%', alignItems: 'start' }}>
        {/* Columna Izquierda (70% de ancho) */}
        <div style={{ flex: '1 1 70%', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
          {/* Selector de Vistas de Historial */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '0.75rem 1.25rem', 
              marginBottom: '1rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setVistaHistorial('tabla')} 
                className={`btn ${vistaHistorial === 'tabla' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Table size={14} />
                <span>Vista Tabla</span>
              </button>
              <button 
                onClick={() => setVistaHistorial('cronograma')} 
                className={`btn ${vistaHistorial === 'cronograma' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <CalendarDays size={14} />
                <span>Cronograma de Uso</span>
              </button>
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
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 1fr', 
            gap: '1rem' 
          }}
          className="grid-cols-4"
        >
          {/* Barra de búsqueda */}
          <div className="search-container" style={{ maxWidth: 'none' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por recurso, docente, motivo..." 
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
              disabled={vistaHistorial === 'cronograma'} // En el cronograma vemos reservas activas/concluidas por defecto
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Aprobada">Aprobadas</option>
              <option value="Rechazada">Rechazadas</option>
              <option value="Finalizada">Finalizadas</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>

          {/* Filtro por tipo */}
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

          {/* Filtro por fecha */}
          <div style={{ position: 'relative' }}>
            <input 
              type="date" 
              className="form-input" 
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              title="Filtrar por fecha"
            />
          </div>
        </div>
      </div>

      {/* Renderizado de Vistas */}
      {vistaHistorial === 'tabla' ? (
        /* VISTA TABLA HISTÓRICA */
        <div className="table-container">
          {reservasFiltradas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No se encontraron registros históricos con los filtros aplicados.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Recurso/Espacio</th>
                  <th>Solicitado por</th>
                  <th>Tipo</th>
                  <th style={{ textAlign: 'center' }}>Cantidad</th>
                  <th>Fecha de Reserva</th>
                  <th>Horario</th>
                  <th>Estado</th>
                  <th>Justificación</th>
                </tr>
              </thead>
              <tbody>
                {reservasPaginadas.map(res => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: '700' }}>{res.itemName}</td>
                    <td style={{ fontWeight: '600' }}>{res.usuarioNombre}</td>
                    <td>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '700', 
                          textTransform: 'uppercase',
                          color: res.tipoRecurso === 'recurso' ? 'var(--color-brand-cyan-muted)' : 'var(--color-brand-gold)'
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
                    <td style={{ fontWeight: '600' }}>{res.horaInicio} - {res.horaFin}</td>
                    <td>{obtenerInsigniaEstado(res.estado)}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={res.motivo}>
                      {res.motivo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* VISTA CRONOGRAMA VISUAL (SOLO APROBADAS Y FINALIZADAS) */
        <div>
          {reservasFiltradas.filter(r => r.estado === 'Aprobada' || r.estado === 'Finalizada').length === 0 ? (
            <div className="glass-card text-center" style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No hay reservas activas en el cronograma escolar para los filtros seleccionados.
            </div>
          ) : (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '1.25rem',
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              {reservasFiltradas
                .filter(r => r.estado === 'Aprobada' || r.estado === 'Finalizada')
                .slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina)
                .map(res => (
                  <div 
                    key={res.id} 
                    className={`glass-card ${res.tipoRecurso === 'recurso' ? 'glow-card-cyan' : 'glow-card-gold'}`} 
                    style={{ 
                      padding: '1.25rem', 
                      display: 'flex', 
                      gap: '1rem', 
                      alignItems: 'flex-start',
                      borderLeft: `4px solid ${res.tipoRecurso === 'recurso' ? 'var(--color-brand-cyan-muted)' : 'var(--color-brand-gold)'}`
                    }}
                  >
                    <div 
                      style={{ 
                        padding: '0.6rem', 
                        backgroundColor: res.tipoRecurso === 'recurso' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 159, 28, 0.1)', 
                        borderRadius: 'var(--border-radius-sm)', 
                        color: res.tipoRecurso === 'recurso' ? 'var(--color-brand-cyan-muted)' : 'var(--color-brand-gold)',
                        flexShrink: 0 
                      }}
                    >
                      {res.tipoRecurso === 'recurso' ? <Laptop size={20} /> : <MapPin size={20} />}
                    </div>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <h4 style={{ fontWeight: '850', fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={res.itemName}>
                        {res.itemName}
                      </h4>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {res.tipoRecurso === 'recurso' ? `Cantidad prestada: ${res.cantidad} unidades` : 'Espacio Escolar'}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontWeight: '600' }}>{res.fechaInicio}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontWeight: '800', color: 'var(--color-brand-cyan-muted)' }}>{res.horaInicio} - {res.horaFin}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8125rem' }}>
                        <User size={13} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Docente:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '750' }}>{res.usuarioNombre}</span>
                      </div>

                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Info size={12} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={res.motivo}>
                          {res.motivo || 'Uso pedagógico.'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          )}

          {/* Controles de Paginación */}
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem', marginBottom: '1rem' }}>
              <button 
                disabled={paginaActual === 1} 
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.8125rem' }}
              >
                &larr; Anterior
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button 
                disabled={paginaActual === totalPaginas} 
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.8125rem' }}
              >
                Siguiente &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Columna Derecha (28% de ancho) - Reportes e Indicadores */}
        <div style={{ flex: '1 1 28%', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: 'calc(var(--header-height) + 1.5rem)' }}>
          {/* Panel de Descargas */}
          <div className="glass-card glow-card-gold" style={{ borderLeft: '4px solid var(--color-brand-gold)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} color="var(--color-brand-gold)" />
              Reportes en PDF
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Genere un documento detallado con todas las solicitudes de préstamo filtradas según el estado de aprobación y rango de fechas establecido.
            </p>

            <button 
              onClick={alExportarReporte} 
              className="btn btn-primary w-full" 
              style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem', gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              disabled={descargando || reservasFiltradas.length === 0}
            >
              {descargando ? (
                <>
                  <span className="loading-spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></span>
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Descargar PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Frecuencia de Solicitudes */}
          <div className="glass-card glow-card-cyan" style={{ borderLeft: '4px solid var(--color-brand-cyan-muted)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--color-brand-cyan-muted)" />
              Uso por Categorías
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                  <span>Equipos de Computación</span>
                  <span>70%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '70%', backgroundColor: 'var(--color-brand-cyan)', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                  <span>Proyectores HDMI</span>
                  <span>20%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '20%', backgroundColor: 'var(--color-brand-gold)', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                  <span>Aulas y Auditorios</span>
                  <span>10%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '10%', backgroundColor: 'var(--color-success)', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
