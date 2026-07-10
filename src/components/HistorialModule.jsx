import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReservas } from '../utils/mockData';
import { Search, Calendar, FileText, Download, CheckCircle, Clock, XCircle, BarChart2 } from 'lucide-react';

export default function HistorialModule() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.rol === 'Administrador';

  const [reservas, setReservas] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [fechaFiltro, setFechaFiltro] = useState('');

  // Simulated download state
  const [downloading, setDownloading] = useState(false);

  const loadReservas = () => {
    setReservas(getReservas());
  };

  useEffect(() => {
    loadReservas();
    window.addEventListener('prre_db_update', loadReservas);
    return () => window.removeEventListener('prre_db_update', loadReservas);
  }, []);

  // Filter logic: Users see only their own history unless Admin
  const visibleReservas = reservas.filter(res => {
    if (isAdmin) return true;
    return res.usuarioId === currentUser?.id;
  });

  const filteredReservas = visibleReservas.filter(res => {
    const matchesSearch = res.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'Todos' || res.estado === filterEstado;
    const matchesTipo = filterTipo === 'Todos' || res.tipoRecurso === filterTipo;
    const matchesFecha = !fechaFiltro || res.fechaInicio === fechaFiltro;

    return matchesSearch && matchesEstado && matchesTipo && matchesFecha;
  });

  // Calculate statistics from visible list
  const totalCount = visibleReservas.length;
  const aprobadasCount = visibleReservas.filter(r => r.estado === 'Aprobada').length;
  const finalizadasCount = visibleReservas.filter(r => r.estado === 'Finalizada').length;
  const rechazadasCount = visibleReservas.filter(r => r.estado === 'Rechazada').length;
  const pendientesCount = visibleReservas.filter(r => r.estado === 'Pendiente').length;

  const successRate = totalCount > 0 
    ? Math.round(((aprobadasCount + finalizadasCount) / totalCount) * 100) 
    : 0;

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Aprobada': return <span className="badge badge-success">Aprobada</span>;
      case 'Pendiente': return <span className="badge badge-warning">Pendiente</span>;
      case 'Rechazada': return <span className="badge badge-danger">Rechazada</span>;
      case 'Finalizada': return <span className="badge badge-info">Finalizada</span>;
      case 'Cancelada': return <span className="badge" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-muted)' }}>Cancelada</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  const handleExportReport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Reporte PDF generado exitosamente.\nRegistros incluidos: ${filteredReservas.length}\nFiltro actual: ${filterEstado} / ${filterTipo}\nDestino: Descargas/Reporte_PRRE_${new Date().toISOString().substring(0,10)}.pdf`);
    }, 1500);
  };

  return (
    <div>
      {/* Mini Stats Panel inside History */}
      <div className="grid-cols-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
            <BarChart2 size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{totalCount}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Reservas Históricas</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <CheckCircle size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{successRate}%</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tasa de Aprobación</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <Clock size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{pendientesCount}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>En Cola de Espera</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
            <XCircle size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{rechazadasCount}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Rechazadas</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
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
            onClick={handleExportReport} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', gap: '0.375rem' }}
            disabled={downloading || filteredReservas.length === 0}
          >
            {downloading ? (
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
          className="grid-cols-4" /* Responsive fallback styling class */
        >
          {/* Search bar */}
          <div className="search-container" style={{ maxWidth: 'none' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por recurso, justificación, usuario..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div>
            <select 
              className="form-select" 
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Aprobada">Aprobadas</option>
              <option value="Rechazada">Rechazadas</option>
              <option value="Finalizada">Finalizadas</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>

          {/* Type filter */}
          <div>
            <select 
              className="form-select" 
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              <option value="Todos">Todos los tipos</option>
              <option value="recurso">Recursos</option>
              <option value="espacio">Espacios</option>
            </select>
          </div>

          {/* Date filter */}
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

      {/* History Log Table */}
      <div className="table-container">
        {filteredReservas.length === 0 ? (
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
              {filteredReservas.map(res => (
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
                      {res.tipoRecurso}
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
                  <td>{getStatusBadge(res.estado)}</td>
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
