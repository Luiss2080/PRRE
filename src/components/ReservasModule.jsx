import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getReservas, 
  saveReservation, 
  deleteReservation, 
  getRecursos, 
  getEspacios 
} from '../utils/mockData';
import { 
  Plus, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  Info, 
  Slash,
  AlertCircle,
  Play,
  RotateCcw,
  Search
} from 'lucide-react';

export default function ReservasModule({ preselectedItem, onClearPreselected }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.rol === 'Administrador';

  const [reservas, setReservas] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [tipoRecurso, setTipoRecurso] = useState('recurso'); // 'recurso' o 'espacio'
  const [itemId, setItemId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [motivo, setMotivo] = useState('');

  const loadData = () => {
    setReservas(getReservas());
    setRecursos(getRecursos());
    setEspacios(getEspacios());
  };

  useEffect(() => {
    loadData();
    // Refresh when other tabs make changes
    window.addEventListener('prre_db_update', loadData);
    return () => window.removeEventListener('prre_db_update', loadData);
  }, []);

  // Preselection logic when redirected from resources or spaces catalog
  useEffect(() => {
    if (preselectedItem && (recursos.length > 0 || espacios.length > 0)) {
      const type = preselectedItem.tipoRecurso || 'recurso';
      setTipoRecurso(type);
      setItemId(preselectedItem.id);
      setCantidad(1);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().substring(0, 10);
      setFechaInicio(dateStr);
      setFechaFin(dateStr);
      setHoraInicio('08:00');
      setHoraFin('09:30');
      setMotivo('');
      setFormError('');
      
      setModalOpen(true);
      if (onClearPreselected) onClearPreselected();
    }
  }, [preselectedItem, recursos, espacios]);

  // Set initial item when switching types or opening modal
  useEffect(() => {
    if (tipoRecurso === 'recurso' && recursos.length > 0) {
      setItemId(recursos[0].id);
    } else if (tipoRecurso === 'espacio' && espacios.length > 0) {
      setItemId(espacios[0].id);
    }
  }, [tipoRecurso, recursos, espacios, modalOpen]);

  const handleOpenAddModal = () => {
    setTipoRecurso('recurso');
    setCantidad(1);
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().substring(0, 10);
    
    setFechaInicio(dateStr);
    setFechaFin(dateStr);
    setHoraInicio('08:00');
    setHoraFin('09:30');
    setMotivo('');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!itemId) {
      setFormError('Por favor seleccione un recurso o espacio.');
      return;
    }
    if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) {
      setFormError('Por favor complete todas las fechas y horarios.');
      return;
    }
    if (fechaInicio > fechaFin) {
      setFormError('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }
    if (fechaInicio === fechaFin && horaInicio >= horaFin) {
      setFormError('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }
    if (!motivo.trim()) {
      setFormError('Por favor ingrese el motivo de la reserva.');
      return;
    }

    // Validation for stock or availability
    if (tipoRecurso === 'recurso') {
      const selectedRec = recursos.find(r => r.id === itemId);
      if (!selectedRec) return;
      if (selectedRec.estado === 'Mantenimiento') {
        setFormError('Este recurso se encuentra en mantenimiento y no puede ser reservado.');
        return;
      }
      if (cantidad > selectedRec.cantidadDisponible) {
        setFormError(`Cantidad insuficiente. Solo quedan ${selectedRec.cantidadDisponible} unidades disponibles.`);
        return;
      }
    } else {
      const selectedEsp = espacios.find(e => e.id === itemId);
      if (!selectedEsp) return;
      if (selectedEsp.estado === 'Mantenimiento') {
        setFormError('Este espacio se encuentra en mantenimiento y no puede ser reservado.');
        return;
      }
      if (selectedEsp.estado === 'Ocupado' && !isAdmin) {
        // Allow admins to override or queue, but block students/teachers
        setFormError('Este espacio se encuentra actualmente ocupado.');
        return;
      }
    }

    const newReserva = {
      tipoRecurso,
      itemId,
      usuarioId: currentUser.id,
      usuarioNombre: currentUser.nombre,
      fechaInicio,
      fechaFin,
      horaInicio,
      horaFin,
      cantidad: tipoRecurso === 'recurso' ? parseInt(cantidad) : 1,
      motivo,
      // Admins approve immediately, teachers/students start as pending
      estado: isAdmin ? 'Aprobada' : 'Pendiente'
    };

    saveReservation(newReserva);
    loadData();
    setModalOpen(false);
    
    // Trigger dashboard update
    window.dispatchEvent(new Event('prre_db_update'));
  };

  // Actions
  const handleApprove = (reserva) => {
    const updated = { ...reserva, estado: 'Aprobada' };
    saveReservation(updated);
    loadData();
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const handleReject = (reserva) => {
    const updated = { ...reserva, estado: 'Rechazada' };
    saveReservation(updated);
    loadData();
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const handleFinalize = (reserva) => {
    const updated = { ...reserva, estado: 'Finalizada' };
    saveReservation(updated);
    loadData();
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const handleCancel = (reserva) => {
    const updated = { ...reserva, estado: 'Cancelada' };
    saveReservation(updated);
    loadData();
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Desea eliminar este registro de reserva definitivamente?')) {
      deleteReservation(id);
      loadData();
      window.dispatchEvent(new Event('prre_db_update'));
    }
  };

  // Filter list: Users see only their own unless Admin
  const visibleReservas = reservas.filter(res => {
    if (isAdmin) return true;
    return res.usuarioId === currentUser?.id;
  });

  const filteredReservas = visibleReservas.filter(res => {
    return res.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           res.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           res.motivo.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

  const selectedItemData = tipoRecurso === 'recurso' 
    ? recursos.find(r => r.id === itemId) 
    : espacios.find(e => e.id === itemId);

  return (
    <div>
      {/* Action Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div className="search-container" style={{ flexGrow: 1, maxWidth: '400px' }}>
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por recurso, solicitante, motivo..." 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Nueva Solicitud</span>
        </button>
      </div>

      {/* Booking List Table */}
      <div className="table-container">
        {filteredReservas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No tienes solicitudes de reserva registradas.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Recurso/Espacio</th>
                {isAdmin && <th>Solicitante</th>}
                <th>Fechas</th>
                <th>Horario</th>
                <th style={{ textAlign: 'center' }}>Cantidad</th>
                <th>Estado</th>
                <th>Justificación</th>
                <th style={{ textAlign: 'center', width: '220px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.map(res => (
                <tr key={res.id}>
                  <td style={{ fontWeight: '700' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{res.itemName}</span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '500' }}>
                        {res.tipoRecurso}
                      </span>
                    </div>
                  </td>
                  {isAdmin && <td style={{ fontWeight: '600' }}>{res.usuarioNombre}</td>}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                      <Calendar size={14} className="text-muted" />
                      <span>
                        {res.fechaInicio === res.fechaFin ? res.fechaInicio : `${res.fechaInicio} al ${res.fechaFin}`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                      <Clock size={14} className="text-muted" />
                      <span>{res.horaInicio} - {res.horaFin}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '600' }}>
                    {res.tipoRecurso === 'recurso' ? `${res.cantidad} ud.` : '-'}
                  </td>
                  <td>{getStatusBadge(res.estado)}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={res.motivo}>
                    {res.motivo}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center' }}>
                      {/* Admin Actions */}
                      {isAdmin && res.estado === 'Pendiente' && (
                        <>
                          <button 
                            onClick={() => handleApprove(res)} 
                            className="btn btn-primary" 
                            style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                            title="Aprobar"
                          >
                            <Check size={14} />
                            <span>Aprobar</span>
                          </button>
                          <button 
                            onClick={() => handleReject(res)} 
                            className="btn btn-danger" 
                            style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                            title="Rechazar"
                          >
                            <X size={14} />
                            <span>Rechazar</span>
                          </button>
                        </>
                      )}

                      {/* Admin Finalize action */}
                      {isAdmin && res.estado === 'Aprobada' && (
                        <button 
                          onClick={() => handleFinalize(res)} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem', color: 'var(--color-success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                          title="Finalizar"
                        >
                          <Play size={14} style={{ transform: 'rotate(90deg)' }} />
                          <span>Concluir</span>
                        </button>
                      )}

                      {/* User cancel option */}
                      {(res.estado === 'Pendiente' || (res.estado === 'Aprobada' && !isAdmin)) && (
                        <button 
                          onClick={() => handleCancel(res)} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                          title="Cancelar reserva"
                        >
                          <X size={14} />
                          <span>Cancelar</span>
                        </button>
                      )}

                      {/* Delete record for historic or canceled entries */}
                      {(res.estado === 'Finalizada' || res.estado === 'Cancelada' || res.estado === 'Rechazada') && (
                        <button 
                          onClick={() => handleDelete(res.id)} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.375rem', borderRadius: '4px' }}
                          title="Eliminar registro"
                        >
                          <X size={14} style={{ color: 'var(--color-danger)' }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Booking Form Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}>
                Solicitud de Reserva de Recurso
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && (
                  <div 
                    style={{ 
                      backgroundColor: 'var(--color-danger-bg)', 
                      color: 'var(--color-danger)', 
                      padding: '0.75rem', 
                      borderRadius: 'var(--border-radius-sm)', 
                      fontSize: '0.8125rem',
                      marginBottom: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    {formError}
                  </div>
                )}

                {/* Resource Category Selector */}
                <div className="form-group">
                  <label className="form-label">¿Qué tipo de recurso desea reservar?</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input 
                        type="radio" 
                        name="tipoRecurso" 
                        value="recurso" 
                        checked={tipoRecurso === 'recurso'} 
                        onChange={() => setTipoRecurso('recurso')} 
                      />
                      Recurso Educativo (Laptop, Proyector, Kits...)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input 
                        type="radio" 
                        name="tipoRecurso" 
                        value="espacio" 
                        checked={tipoRecurso === 'espacio'} 
                        onChange={() => setTipoRecurso('espacio')} 
                      />
                      Espacio Físico/Virtual (Aulas, Laboratorios...)
                    </label>
                  </div>
                </div>

                {/* Resource Item Selector */}
                <div className="form-group">
                  <label className="form-label">Seleccionar Elemento</label>
                  <select 
                    className="form-select" 
                    value={itemId} 
                    onChange={(e) => setItemId(e.target.value)}
                    required
                  >
                    {tipoRecurso === 'recurso' ? (
                      recursos.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.nombre} (Stock Disp: {r.cantidadDisponible})
                        </option>
                      ))
                    ) : (
                      espacios.map(e => (
                        <option key={e.id} value={e.id}>
                          {e.nombre} ({e.estado} • Capacidad: {e.capacidad} pers.)
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Info block for selected item */}
                {selectedItemData && (
                  <div 
                    style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: 'var(--border-radius-sm)', 
                      backgroundColor: 'var(--bg-primary)', 
                      border: '1px solid var(--border-color)',
                      marginBottom: '1.25rem',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      gap: '0.5rem'
                    }}
                  >
                    <Info size={16} style={{ color: 'var(--color-brand-cyan)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <span style={{ fontWeight: '700' }}>Detalles:</span> {selectedItemData.descripcion || 'Sin descripción adicional.'}
                      {tipoRecurso === 'recurso' && (
                        <div style={{ marginTop: '0.25rem', fontWeight: '600', color: 'var(--color-success)' }}>
                          Estado físico del recurso: {selectedItemData.estado}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quantity (Only for resources) */}
                {tipoRecurso === 'recurso' && (
                  <div className="form-group">
                    <label className="form-label">Cantidad a Reservar</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="1" 
                      max={selectedItemData ? selectedItemData.cantidadDisponible : undefined}
                      value={cantidad} 
                      onChange={(e) => setCantidad(e.target.value)}
                      required 
                    />
                  </div>
                )}

                {/* Date range inputs */}
                <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Fecha de Inicio</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={fechaInicio} 
                      onChange={(e) => setFechaInicio(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Fecha de Cierre</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={fechaFin} 
                      onChange={(e) => setFechaFin(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                {/* Time range inputs */}
                <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Hora de Inicio</label>
                    <input 
                      type="time" 
                      className="form-input" 
                      value={horaInicio} 
                      onChange={(e) => setHoraInicio(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Hora de Salida</label>
                    <input 
                      type="time" 
                      className="form-input" 
                      value={horaFin} 
                      onChange={(e) => setHoraFin(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                {/* Justification */}
                <div className="form-group">
                  <label className="form-label">Justificación / Proyecto de Clase</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Escriba el motivo detallado de la reserva o actividad planificada..." 
                    value={motivo} 
                    onChange={(e) => setMotivo(e.target.value)}
                    rows="3"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {isAdmin ? 'Aprobar y Reservar' : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
