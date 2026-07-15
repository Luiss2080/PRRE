import React, { useState, useEffect } from 'react';
import { useAutenticacion } from '../context/ContextoAutenticacion';
import { 
  getReservas, 
  guardarReserva, 
  eliminarReserva, 
  getRecursos, 
  getEspacios 
} from '../utils/datosSimulados';
import { 
  Plus, 
  Check, 
  X, 
  Clock, 
  Info, 
  Search,
  AlertCircle
} from 'lucide-react';

// Helpers locales para control estricto de fechas y horarios
const getFechaLocalStr = (fecha = new Date()) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

const calcularFechaFinMaxima = (inicio) => {
  if (!inicio) return '';
  const fecha = new Date(inicio + 'T00:00:00');
  fecha.setDate(fecha.getDate() + 10);
  return getFechaLocalStr(fecha);
};

const calcularHoraFin = (inicio, dur) => {
  if (!inicio) return '';
  const [hora, min] = inicio.split(':').map(Number);
  const nuevaHora = hora + Number(dur);
  return `${String(nuevaHora).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
};

/**
 * ModuloReservas
 * Componente que gestiona el sistema de reservas y solicitudes de préstamos de recursos y espacios.
 * Los usuarios normales envían solicitudes que entran en estado "Pendiente". Los administradores
 * pueden aprobar, rechazar o finalizar reservas directamente, gestionando el flujo del stock institucional.
 */
export default function ModuloReservas({ elementoPreseleccionado, alLimpiarPreseleccionado, establecerPestañaActiva }) {
  const { usuarioActual } = useAutenticacion();
  const esAdmin = usuarioActual?.rol === 'Administrador';

  const [reservas, setReservas] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  // Estado del modal de reservas
  const [modalAbierto, setModalAbierto] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState('');

  // Campos del formulario
  const [tipoRecurso, setTipoRecurso] = useState('recurso'); // 'recurso' o 'espacio'
  const [itemId, setItemId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [duracion, setDuracion] = useState('1'); // '1' o '2' horas
  const [horaFin, setHoraFin] = useState('09:00');
  const [motivo, setMotivo] = useState('');

  const cargarDatos = () => {
    setReservas(getReservas());
    setRecursos(getRecursos());
    setEspacios(getEspacios());
  };

  useEffect(() => {
    cargarDatos();
    // Actualiza los datos cuando ocurren cambios en otras pestañas
    window.addEventListener('prre_db_update', cargarDatos);
    return () => window.removeEventListener('prre_db_update', cargarDatos);
  }, []);

  // Lógica para preseleccionar elementos redirigidos desde el catálogo o los espacios
  useEffect(() => {
    if (elementoPreseleccionado && (recursos.length > 0 || espacios.length > 0)) {
      const tipo = elementoPreseleccionado.tipoRecurso || 'recurso';
      setTipoRecurso(tipo);
      setItemId(elementoPreseleccionado.id);
      setCantidad(1);
      
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);
      const cadenaFecha = getFechaLocalStr(mañana);
      setFechaInicio(cadenaFecha);
      setFechaFin(cadenaFecha);
      setHoraInicio('08:00');
      setDuracion('1');
      setMotivo('');
      setErrorFormulario('');
      
      setModalAbierto(true);
      if (alLimpiarPreseleccionado) alLimpiarPreseleccionado();
    }
  }, [elementoPreseleccionado, recursos, espacios, alLimpiarPreseleccionado]);

  // Asigna el primer elemento por defecto al cambiar de tipo de recurso o al abrir el modal
  useEffect(() => {
    if (tipoRecurso === 'recurso' && recursos.length > 0) {
      setItemId(recursos[0].id);
    } else if (tipoRecurso === 'espacio' && espacios.length > 0) {
      setItemId(espacios[0].id);
    }
  }, [tipoRecurso, recursos, espacios, modalAbierto]);

  // Efecto para calcular automáticamente horaFin en base a horaInicio y duracion
  useEffect(() => {
    if (horaInicio && duracion) {
      const horaFinCalculada = calcularHoraFin(horaInicio, duracion);
      setHoraFin(horaFinCalculada);
    }
  }, [horaInicio, duracion]);

  const alCambiarFechaInicio = (nuevaFecha) => {
    setFechaInicio(nuevaFecha);
    const maxFecha = calcularFechaFinMaxima(nuevaFecha);
    if (fechaFin < nuevaFecha || (fechaFin > maxFecha)) {
      setFechaFin(nuevaFecha);
    }
  };

  const alAbrirModalAgregar = () => {
    setTipoRecurso('recurso');
    setCantidad(1);
    
    // Fecha por defecto: Mañana
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    const cadenaFecha = getFechaLocalStr(mañana);
    
    setFechaInicio(cadenaFecha);
    setFechaFin(cadenaFecha);
    setHoraInicio('08:00');
    setDuracion('1');
    setMotivo('');
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const alGuardar = (e) => {
    e.preventDefault();
    setErrorFormulario('');

    if (!itemId) {
      setErrorFormulario('Por favor seleccione un recurso o espacio.');
      return;
    }
    if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) {
      setErrorFormulario('Por favor complete todas las fechas y horarios.');
      return;
    }
    if (fechaInicio > fechaFin) {
      setErrorFormulario('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }
    if (fechaInicio === fechaFin && horaInicio >= horaFin) {
      setErrorFormulario('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }
    if (!motivo.trim()) {
      setErrorFormulario('Por favor ingrese el motivo de la reserva.');
      return;
    }

    // Validación de existencias y disponibilidad
    if (tipoRecurso === 'recurso') {
      const recSeleccionado = recursos.find(r => r.id === itemId);
      if (!recSeleccionado) return;
      if (recSeleccionado.estado === 'Mantenimiento') {
        setErrorFormulario('Este recurso se encuentra en mantenimiento y no puede ser reservado.');
        return;
      }
      if (cantidad > recSeleccionado.cantidadDisponible) {
        setErrorFormulario(`Cantidad insuficiente. Solo quedan ${recSeleccionado.cantidadDisponible} unidades disponibles.`);
        return;
      }
    } else {
      const espSeleccionado = espacios.find(e => e.id === itemId);
      if (!espSeleccionado) return;
      if (espSeleccionado.estado === 'Mantenimiento') {
        setErrorFormulario('Este espacio se encuentra en mantenimiento y no puede ser reservado.');
        return;
      }
      if (espSeleccionado.estado === 'Ocupado' && !esAdmin) {
        setErrorFormulario('Este espacio se encuentra actualmente ocupado.');
        return;
      }
    }

    const nuevaReserva = {
      tipoRecurso,
      itemId,
      usuarioId: usuarioActual.id,
      usuarioNombre: usuarioActual.nombre,
      fechaInicio,
      fechaFin,
      horaInicio,
      horaFin,
      cantidad: tipoRecurso === 'recurso' ? parseInt(cantidad) : 1,
      motivo,
      // Los administradores se aprueban inmediatamente; estudiantes/docentes inician como Pendiente
      estado: esAdmin ? 'Aprobada' : 'Pendiente'
    };

    guardarReserva(nuevaReserva);
    cargarDatos();
    setModalAbierto(false);
    
    // Actualiza estadísticas globales en el panel de control
    window.dispatchEvent(new Event('prre_db_update'));
  };

  // Acciones de administración de reservas
  const alAprobar = (reserva) => {
    const actualizada = { ...reserva, estado: 'Aprobada' };
    guardarReserva(actualizada);
    cargarDatos();
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const alRechazar = (reserva) => {
    const actualizada = { ...reserva, estado: 'Rechazada' };
    guardarReserva(actualizada);
    cargarDatos();
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const alFinalizar = (reserva) => {
    const actualizada = { ...reserva, estado: 'Finalizada' };
    guardarReserva(actualizada);
    cargarDatos();
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const alCancelar = (reserva) => {
    const actualizada = { ...reserva, estado: 'Cancelada' };
    guardarReserva(actualizada);
    cargarDatos();
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const alEliminar = (id) => {
    if (window.confirm('¿Desea eliminar este registro de reserva definitivamente?')) {
      eliminarReserva(id);
      cargarDatos();
      window.dispatchEvent(new Event('prre_db_update'));
    }
  };

  // Filtra la lista visible de reservas (los docentes y estudiantes solo ven las propias)
  const reservasVisibles = reservas.filter(res => {
    if (esAdmin) return true;
    return res.usuarioId === usuarioActual?.id;
  });

  const reservasFiltradas = reservasVisibles.filter(res => {
    return res.itemName.toLowerCase().includes(terminoBusqueda.toLowerCase()) || 
           res.usuarioNombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
           res.motivo.toLowerCase().includes(terminoBusqueda.toLowerCase());
  });

  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    setPaginaActual(1);
  }, [terminoBusqueda]);

  const itemsPorPagina = 5;
  const totalPaginas = Math.ceil(reservasFiltradas.length / itemsPorPagina);
  const reservasPaginadas = reservasFiltradas.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

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

  const datosElementoSeleccionado = tipoRecurso === 'recurso' 
    ? recursos.find(r => r.id === itemId) 
    : espacios.find(e => e.id === itemId);

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', width: '100%', alignItems: 'start' }}>
      {/* Columna Izquierda (65% de ancho) */}
      <div style={{ flex: '1 1 65%', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
        {/* Controles de cabecera */}
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
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {establecerPestañaActiva && (
              <button 
                onClick={() => {
                  if (alLimpiarPreseleccionado) alLimpiarPreseleccionado();
                  establecerPestañaActiva(elementoPreseleccionado?.tipoRecurso === 'espacio' ? 'espacios' : 'recursos');
                }} 
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}
              >
                Volver al catálogo
              </button>
            )}

            <button 
              onClick={alAbrirModalAgregar}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              <span>Nueva Reserva</span>
            </button>
          </div>
        </div>

        {/* Tabla de registros */}
        <div className="table-container">
          {reservasFiltradas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No se encontraron reservas registradas.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Ítem Reservado</th>
                  <th>Solicitado por</th>
                  <th>Fecha de Préstamo</th>
                  <th>Horario</th>
                  <th style={{ textAlign: 'center' }}>Cantidad</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservasPaginadas.map(res => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: '700' }}>{res.id}</td>
                    <td>
                      <span style={{ fontWeight: '750', color: 'var(--text-primary)' }}>{res.itemName}</span>
                      <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        Tipo: {res.tipoRecurso === 'recurso' ? 'Recurso didáctico' : 'Aula/Espacio'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>{res.usuarioNombre}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{res.fechaInicio}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                        <Clock size={12} />
                        {res.horaInicio} - {res.horaFin}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '700' }}>{res.cantidad}</td>
                    <td>{obtenerInsigniaEstado(res.estado)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        {/* Aprobación/Rechazo sólo para administradores */}
                        {esAdmin && res.estado === 'Pendiente' && (
                          <>
                            <button 
                              onClick={() => alAprobar(res)} 
                              className="btn btn-success" 
                              style={{ padding: '0.375rem', borderRadius: '4px' }}
                              title="Aprobar reserva"
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={() => alRechazar(res)} 
                              className="btn btn-danger" 
                              style={{ padding: '0.375rem', borderRadius: '4px' }}
                              title="Rechazar reserva"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}

                        {/* Finalizar una reserva aprobada */}
                        {esAdmin && res.estado === 'Aprobada' && (
                          <button 
                            onClick={() => alFinalizar(res)} 
                            className="btn btn-info" 
                            style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                            title="Finalizar préstamo"
                          >
                            <Check size={14} />
                            <span>Concluir</span>
                          </button>
                        )}

                        {/* Cancelar reserva propia para docentes */}
                        {!esAdmin && (res.estado === 'Pendiente' || res.estado === 'Aprobada') && (
                          <button 
                            onClick={() => alCancelar(res)} 
                            className="btn btn-secondary" 
                            style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                            title="Cancelar reserva"
                          >
                            <X size={14} />
                            <span>Cancelar</span>
                          </button>
                        )}

                        {/* Eliminar registro definitivo para reservas concluidas o inactivas */}
                        {(res.estado === 'Finalizada' || res.estado === 'Cancelada' || res.estado === 'Rechazada') && (
                          <button 
                            onClick={() => alEliminar(res.id)} 
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

        {/* Controles de Paginación */}
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <button 
              disabled={paginaActual === 1} 
              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
            >
              &larr; Anterior
            </button>
            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button 
              disabled={paginaActual === totalPaginas} 
              onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
            >
              Siguiente &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Columna Derecha (32% de ancho) - Hoy Ocupados */}
      <div style={{ flex: '1 1 32%', minWidth: '290px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: 'calc(var(--header-height) + 1.5rem)' }}>
        {/* Cronograma del Día */}
        <div className="glass-card glow-card-cyan" style={{ borderLeft: '4px solid var(--color-brand-cyan-muted)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--color-brand-cyan-muted)" />
            Cronograma del Día
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reservas.filter(r => r.estado === 'Aprobada').slice(0, 3).length === 0 ? (
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No hay reservas activas aprobadas para hoy.</span>
            ) : (
              reservas.filter(r => r.estado === 'Aprobada').slice(0, 3).map(res => (
                <div key={res.id} style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.01)', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '700' }}>{res.itemName}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.625rem', padding: '0.1rem 0.35rem' }}>Aprobado</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.6875rem' }}>
                    Docente: {res.usuarioNombre}<br />
                    Horario: {res.horaInicio} - {res.horaFin}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Políticas de Reserva */}
        <div className="glass-card glow-card-gold" style={{ borderLeft: '4px solid var(--color-brand-gold)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} color="var(--color-brand-gold)" />
            Prioridad de Aprobación
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
            Los recursos y aulas se asignan con base en la fecha de solicitud. Las materias curriculares prácticas tienen prioridad alta sobre las sesiones extracurriculares.
          </p>
        </div>
      </div>
      {/* Modal de Solicitud de Reserva */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}>
                Solicitud de Reserva de Recurso
              </h2>
              <button 
                onClick={() => setModalAbierto(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={alGuardar}>
              <div className="modal-body">
                {errorFormulario && (
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
                    {errorFormulario}
                  </div>
                )}

                {/* Tipo de Recurso (Radio buttons) */}
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

                {/* Selector de Elemento */}
                <div className="form-group">
                  <label className="form-label">Seleccionar Elemento</label>
                  <select 
                    className="form-select" 
                    value={itemId} 
                    onChange={(e) => setItemId(e.target.value)}
                    required
                  >
                    {tipoRecurso === 'recurso' ? (
                      recursos.map(r => {
                        const inactivo = r.cantidadDisponible === 0 || r.estado === 'Mantenimiento';
                        return (
                          <option key={r.id} value={r.id} disabled={inactivo}>
                            {r.nombre} {r.estado === 'Mantenimiento' ? '[MANTENIMIENTO]' : (r.cantidadDisponible === 0 ? '[SIN STOCK]' : `(Disponible: ${r.cantidadDisponible})`)}
                          </option>
                        );
                      })
                    ) : (
                      espacios.map(e => {
                        const inactivo = e.estado === 'Mantenimiento' || (e.estado === 'Ocupado' && !esAdmin);
                        return (
                          <option key={e.id} value={e.id} disabled={inactivo}>
                            {e.nombre} {e.estado === 'Mantenimiento' ? '[MANTENIMIENTO]' : (e.estado === 'Ocupado' ? '[OCUPADO]' : `(Capacidad: ${e.capacidad} pers.)`)}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                {/* Panel de detalles del elemento seleccionado */}
                {datosElementoSeleccionado && (
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
                      <span style={{ fontWeight: '700' }}>Detalles:</span> {datosElementoSeleccionado.descripcion || 'Sin descripción adicional.'}
                      {tipoRecurso === 'recurso' && (
                        <div style={{ marginTop: '0.25rem', fontWeight: '600', color: 'var(--color-success)' }}>
                          Estado físico del recurso: {datosElementoSeleccionado.estado}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cantidad (Solo para recursos) */}
                {tipoRecurso === 'recurso' && (
                  <div className="form-group">
                    <label className="form-label">Cantidad a Reservar</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="1" 
                      max={datosElementoSeleccionado ? datosElementoSeleccionado.cantidadDisponible : undefined}
                      value={cantidad} 
                      onChange={(e) => setCantidad(e.target.value)}
                      required 
                    />
                  </div>
                )}

                {/* Rango de Fechas */}
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

                {/* Rango de Horarios */}
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

                {/* Justificación */}
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
                  onClick={() => setModalAbierto(false)} 
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {esAdmin ? 'Aprobar y Reservar' : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
