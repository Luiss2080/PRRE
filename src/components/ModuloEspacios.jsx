import React, { useState, useEffect } from 'react';
import { useAutenticacion } from '../context/ContextoAutenticacion';
import { getEspacios, guardarEspacio, eliminarEspacio } from '../utils/datosSimulados';
import { Plus, Edit2, Trash2, Search, X, MapPin, Globe, Layers, HelpCircle } from 'lucide-react';

/**
 * ModuloEspacios
 * Componente que representa la interfaz de administración y consulta de las aulas,
 * laboratorios y espacios físicos o virtuales de la institución escolar.
 */
export default function ModuloEspacios({ alRedireccionarReserva }) {
  const { usuarioActual } = useAutenticacion();
  const esAdmin = usuarioActual?.rol === 'Administrador';

  const [espacios, setEspacios] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [paginaActual, setPaginaActual] = useState(1);

  // Reinicia la página actual si cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [terminoBusqueda, filtroTipo]);

  // Estados del modal de agregar/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [espacioEditando, setEspacioEditando] = useState(null);

  // Campos del formulario de espacios
  const [nombre, setNombre] = useState('');
  const [capacidad, setCapacidad] = useState(20);
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState('Físico');
  const [estado, setEstado] = useState('Disponible');
  const [descripcion, setDescripcion] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');

  // Carga la lista de espacios disponibles
  const cargarEspacios = () => {
    setEspacios(getEspacios());
  };

  useEffect(() => {
    cargarEspacios();
  }, []);

  // Limpia los campos e inicializa el modal para añadir un nuevo espacio
  const alAbrirModalAgregar = () => {
    setEspacioEditando(null);
    setNombre('');
    setCapacidad(20);
    setUbicacion('');
    setTipo('Físico');
    setEstado('Disponible');
    setDescripcion('');
    setErrorFormulario('');
    setModalAbierto(true);
  };

  // Carga los datos del espacio seleccionado e inicia el modal en modo edición
  const alAbrirModalEditar = (espacio) => {
    setEspacioEditando(espacio);
    setNombre(espacio.nombre);
    setCapacidad(espacio.capacidad);
    setUbicacion(espacio.ubicacion);
    setTipo(espacio.tipo);
    setEstado(espacio.estado);
    setDescripcion(espacio.descripcion || '');
    setErrorFormulario('');
    setModalAbierto(true);
  };

  // Guarda los cambios del espacio (creación o edición)
  const alGuardar = (e) => {
    e.preventDefault();
    setErrorFormulario('');

    if (!nombre.trim()) {
      setErrorFormulario('El nombre del espacio es obligatorio.');
      return;
    }
    if (!ubicacion.trim()) {
      setErrorFormulario('La ubicación es obligatoria.');
      return;
    }
    if (capacidad < 1) {
      setErrorFormulario('La capacidad debe ser de al menos 1 persona.');
      return;
    }

    const datosEspacio = {
      id: espacioEditando ? espacioEditando.id : undefined,
      nombre,
      capacidad: parseInt(capacidad),
      ubicacion,
      tipo,
      estado,
      descripcion
    };

    guardarEspacio(datosEspacio);
    cargarEspacios();
    setModalAbierto(false);

    // Notifica la actualización a otros componentes del sistema
    window.dispatchEvent(new Event('prre_db_update'));
  };

  // Elimina un espacio solicitando confirmación previa
  const alEliminar = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este espacio físico/virtual?')) {
      eliminarEspacio(id);
      cargarEspacios();
      window.dispatchEvent(new Event('prre_db_update'));
    }
  };

  // Filtra la lista de espacios de acuerdo a la búsqueda y tipo seleccionado
  const espaciosFiltrados = espacios.filter(esp => {
    const coincideBusqueda = esp.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                            esp.ubicacion.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideFiltro = filtroTipo === 'Todos' || esp.tipo === filtroTipo;
    return coincideBusqueda && coincideFiltro;
  });

  const itemsPorPagina = 5;
  const totalPaginas = Math.ceil(espaciosFiltrados.length / itemsPorPagina);
  const espaciosPaginados = espaciosFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  // Retorna la etiqueta visual según el estado
  const obtenerInsigniaEstado = (estado) => {
    switch (estado) {
      case 'Disponible': return <span className="badge badge-success">Disponible</span>;
      case 'Ocupado': return <span className="badge badge-danger">Ocupado</span>;
      case 'Mantenimiento': return <span className="badge badge-warning">Mantenimiento</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  // Retorna el icono de acuerdo al tipo de espacio
  const obtenerIconoTipo = (tipo) => {
    if (tipo === 'Físico') {
      return <MapPin size={16} style={{ color: 'var(--color-brand-cyan)' }} />;
    }
    return <Globe size={16} style={{ color: 'var(--color-brand-gold)' }} />;
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', width: '100%', alignItems: 'start' }}>
      {/* Columna Izquierda (68% de ancho) */}
      <div style={{ flex: '1 1 68%', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
        {/* Controles de cabecera y búsqueda */}
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
          <div style={{ display: 'flex', gap: '0.75rem', flexGrow: 1, maxWidth: '600px' }}>
            {/* Campo de búsqueda */}
            <div className="search-container" style={{ flexGrow: 1, maxWidth: 'none' }}>
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar espacio o ubicación..." 
                className="search-input" 
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
            </div>

            {/* Filtro de tipo de espacio */}
            <select 
              className="form-select" 
              style={{ width: '160px', padding: '0.625rem 1rem' }}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="Todos">Todos los tipos</option>
              <option value="Físico">Físicos</option>
              <option value="Virtual">Virtuales</option>
            </select>
          </div>

          {/* Botón de nuevo espacio (solo admin) */}
          {esAdmin && (
            <button 
              onClick={alAbrirModalAgregar}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              <span>Nuevo Espacio</span>
            </button>
          )}
        </div>

        {/* Tabla de registros */}
        <div className="table-container">
          {espaciosFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No se encontraron espacios que coincidan con los filtros aplicados.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Espacio</th>
                  <th>Ubicación / Link</th>
                  <th>Capacidad</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {espaciosPaginados.map(esp => (
                  <tr key={esp.id}>
                    <td style={{ fontWeight: '700' }}>{esp.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {obtenerIconoTipo(esp.tipo)}
                        <span style={{ fontWeight: '700' }}>{esp.nombre}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {esp.tipo === 'Virtual' ? (
                        <a 
                          href={esp.ubicacion} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ color: 'var(--color-brand-cyan)', textDecoration: 'underline' }}
                        >
                          Enlace de Aula
                        </a>
                      ) : (
                        esp.ubicacion
                      )}
                    </td>
                    <td style={{ fontWeight: '600' }}>{esp.capacidad} estudiantes</td>
                    <td>{obtenerInsigniaEstado(esp.estado)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        {esAdmin ? (
                          <>
                            <button 
                              onClick={() => alAbrirModalEditar(esp)} 
                              className="btn btn-secondary" 
                              style={{ padding: '0.375rem', borderRadius: '4px' }}
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => alEliminar(esp.id)} 
                              className="btn btn-danger" 
                              style={{ padding: '0.375rem', borderRadius: '4px' }}
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => alRedireccionarReserva && alRedireccionarReserva(esp)}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            disabled={esp.estado === 'Mantenimiento' || esp.estado === 'Ocupado'}
                          >
                            Reservar
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

      {/* Columna Derecha (28% de ancho) - Estado y Políticas */}
      <div style={{ flex: '1 1 28%', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: 'calc(var(--header-height) + 1.5rem)' }}>
        {/* Monitoreo de Aulas */}
        <div className="glass-card glow-card-cyan" style={{ borderLeft: '4px solid var(--color-brand-cyan-muted)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--color-brand-cyan-muted)" />
            Estado de Aulas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span>Laboratorio de Computación A:</span>
              <b style={{ color: 'var(--color-success)' }}>Disponible</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span>Laboratorio de Computación B:</span>
              <b style={{ color: 'var(--color-danger)' }}>Ocupado (Clase)</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span>Aula de Audiovisuales:</span>
              <b style={{ color: 'var(--color-success)' }}>Disponible</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Auditorio de Eventos:</span>
              <b style={{ color: 'var(--color-brand-gold)' }}>Mantenimiento</b>
            </div>
          </div>
        </div>

        {/* Políticas de Espacio */}
        <div className="glass-card glow-card-gold" style={{ borderLeft: '4px solid var(--color-brand-gold)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} color="var(--color-brand-gold)" />
            Políticas de Uso
          </h3>
          <ul style={{ paddingLeft: '1.15rem', margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.4' }}>
            <li>Las llaves de las aulas deben solicitarse y devolverse en soporte TI.</li>
            <li>No se permite ingresar con alimentos o bebidas a los laboratorios.</li>
            <li>Apague los equipos y luces al concluir la sesión.</li>
          </ul>
        </div>
      </div>

      {/* Modal de Creación / Modificación de Espacios */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}>
                {espacioEditando ? 'Modificar Espacio' : 'Nuevo Espacio Físico / Virtual'}
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

                <div className="form-group">
                  <label className="form-label">Nombre del Espacio</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. Laboratorio de Cómputo B o Aula Virtual de Zoom" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ubicación</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. Bloque Este - 1er Piso, o Enlace/Plataforma virtual" 
                    value={ubicacion} 
                    onChange={(e) => setUbicacion(e.target.value)}
                    required 
                  />
                </div>

                <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Tipo de Espacio</label>
                    <select 
                      className="form-select" 
                      value={tipo} 
                      onChange={(e) => setTipo(e.target.value)}
                    >
                      <option value="Físico">Físico</option>
                      <option value="Virtual">Virtual</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Capacidad (Personas)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="1" 
                      value={capacidad} 
                      onChange={(e) => setCapacidad(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estado de Disponibilidad</label>
                  <select 
                    className="form-select" 
                    value={estado} 
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="Disponible">Disponible (Listo para reservar)</option>
                    <option value="Ocupado">Ocupado (Actualmente reservado)</option>
                    <option value="Mantenimiento">Mantenimiento (No disponible por reformas)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Características especiales: Equipamiento, requerimientos de acceso, etc..." 
                    value={descripcion} 
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows="3"
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
                  {espacioEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
