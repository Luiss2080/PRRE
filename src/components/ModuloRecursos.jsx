import React, { useState, useEffect } from 'react';
import { useAutenticacion } from '../context/ContextoAutenticacion';
import { getRecursos, saveRecurso, deleteRecurso } from '../utils/datosSimulados';
import CatalogoRecursos from './CatalogoRecursos';
import { Plus, Edit2, Trash2, Search, X, Laptop, BookOpen, Eye, Table } from 'lucide-react';

/**
 * ModuloRecursos
 * Componente que representa la interfaz de administración y visualización del
 * inventario de recursos educativos (laptops, proyectores, kits de robótica, etc.).
 * Los administradores pueden gestionar el inventario mediante una tabla CRUD o ver el catálogo,
 * mientras que docentes y estudiantes ven directamente la vista de tarjetas.
 */
export default function ModuloRecursos({ alRedireccionarReserva }) {
  const { usuarioActual } = useAutenticacion();
  const esAdmin = usuarioActual?.rol === 'Administrador';

  // Alterna la vista para el administrador: 'table' (tabla CRUD) o 'catalog' (vista de tarjetas)
  const [vistaAdmin, setVistaAdmin] = useState('table');

  const [recursos, setRecursos] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  
  // Estados del modal de agregar/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [recursoEditando, setRecursoEditando] = useState(null);
  
  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Dispositivo');
  const [cantidadTotal, setCantidadTotal] = useState(1);
  const [estado, setEstado] = useState('Excelente');
  const [descripcion, setDescripcion] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');

  // Carga los recursos del sistema
  const cargarRecursos = () => {
    setRecursos(getRecursos());
  };

  useEffect(() => {
    cargarRecursos();
  }, []);

  // Limpia e inicializa los campos para añadir un recurso nuevo
  const alAbrirModalAgregar = () => {
    setRecursoEditando(null);
    setNombre('');
    setTipo('Dispositivo');
    setCantidadTotal(1);
    setEstado('Excelente');
    setDescripcion('');
    setErrorFormulario('');
    setModalAbierto(true);
  };

  // Carga los datos del recurso seleccionado para modificarlo
  const alAbrirModalEditar = (recurso) => {
    setRecursoEditando(recurso);
    setNombre(recurso.nombre);
    setTipo(recurso.tipo);
    setCantidadTotal(recurso.cantidadTotal);
    setEstado(recurso.estado);
    setDescripcion(recurso.descripcion || '');
    setErrorFormulario('');
    setModalAbierto(true);
  };

  // Guarda la información del recurso validando el stock
  const alGuardar = (e) => {
    e.preventDefault();
    setErrorFormulario('');

    if (!nombre.trim()) {
      setErrorFormulario('El nombre del recurso es obligatorio.');
      return;
    }
    if (cantidadTotal < 1) {
      setErrorFormulario('La cantidad total debe ser al menos 1.');
      return;
    }

    let cantidadDisponible = cantidadTotal;
    if (recursoEditando) {
      const cantidadReservada = recursoEditando.cantidadTotal - recursoEditando.cantidadDisponible;
      if (cantidadTotal < cantidadReservada) {
        setErrorFormulario(`No puedes reducir el total por debajo de los recursos reservados (${cantidadReservada} reservados).`);
        return;
      }
      cantidadDisponible = cantidadTotal - cantidadReservada;
    }

    const datosRecurso = {
      id: recursoEditando ? recursoEditando.id : undefined,
      nombre,
      tipo,
      cantidadTotal: parseInt(cantidadTotal),
      cantidadDisponible: parseInt(cantidadDisponible),
      estado,
      descripcion
    };

    saveRecurso(datosRecurso);
    cargarRecursos();
    setModalAbierto(false);
    
    // Notifica la actualización a otros componentes del sistema
    window.dispatchEvent(new Event('prre_db_update'));
  };

  // Elimina un recurso del catálogo
  const alEliminar = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este recurso? Esta acción no se puede deshacer.')) {
      deleteRecurso(id);
      cargarRecursos();
      window.dispatchEvent(new Event('prre_db_update'));
    }
  };

  // Filtra los recursos según búsqueda y tipo
  const recursosFiltrados = recursos.filter(rec => {
    const coincideBusqueda = rec.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) || 
                            rec.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideFiltro = filtroTipo === 'Todos' || rec.tipo === filtroTipo;
    return coincideBusqueda && coincideFiltro;
  });

  // Retorna la etiqueta de estado correspondiente
  const obtenerInsigniaEstado = (estado) => {
    switch (estado) {
      case 'Excelente': return <span className="badge badge-success">Excelente</span>;
      case 'Bueno': return <span className="badge badge-info">Bueno</span>;
      case 'Mantenimiento': return <span className="badge badge-warning">Mantenimiento</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  // Si no es administrador, se muestra el catálogo interactivo directamente
  if (!esAdmin) {
    return <CatalogoRecursos alHacerClicReserva={alRedireccionarReserva} esPublico={false} />;
  }

  return (
    <div>
      {/* Controles de vista del administrador */}
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
        {/* Interruptor de vistas: CRUD vs Catálogo */}
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.25rem', borderRadius: 'var(--border-radius-sm)' }}>
          <button 
            onClick={() => setVistaAdmin('table')}
            className="btn"
            style={{ 
              padding: '0.45rem 1rem', 
              fontSize: '0.8125rem', 
              backgroundColor: vistaAdmin === 'table' ? 'var(--color-brand-cyan-muted)' : 'transparent',
              color: vistaAdmin === 'table' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              boxShadow: vistaAdmin === 'table' ? 'var(--shadow-glow-cyan)' : 'none'
            }}
          >
            <Table size={14} style={{ marginRight: '0.25rem' }} />
            <span>Vista Tabla (CRUD)</span>
          </button>
          <button 
            onClick={() => setVistaAdmin('catalog')}
            className="btn"
            style={{ 
              padding: '0.45rem 1rem', 
              fontSize: '0.8125rem', 
              backgroundColor: vistaAdmin === 'catalog' ? 'var(--color-brand-cyan-muted)' : 'transparent',
              color: vistaAdmin === 'catalog' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              boxShadow: vistaAdmin === 'catalog' ? 'var(--shadow-glow-cyan)' : 'none'
            }}
          >
            <Eye size={14} style={{ marginRight: '0.25rem' }} />
            <span>Vista Catálogo</span>
          </button>
        </div>

        {/* Botón de agregar recurso */}
        {vistaAdmin === 'table' && (
          <button onClick={alAbrirModalAgregar} className="btn btn-primary">
            <Plus size={18} />
            <span>Agregar Recurso</span>
          </button>
        )}
      </div>

      {/* Renderiza la vista seleccionada */}
      {vistaAdmin === 'catalog' ? (
        <CatalogoRecursos alHacerClicReserva={alRedireccionarReserva} esPublico={false} />
      ) : (
        <>
          {/* Barra de búsqueda para administradores */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              marginBottom: '1.25rem', 
              flexWrap: 'wrap' 
            }}
          >
            <div className="search-container" style={{ flexGrow: 1, maxWidth: '500px' }}>
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar recursos (nombre, descripción)..." 
                className="search-input" 
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
            </div>

            <select 
              className="form-select" 
              style={{ width: '160px' }}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="Todos">Todos los tipos</option>
              <option value="Dispositivo">Dispositivos</option>
              <option value="Libro">Libros</option>
              <option value="Material">Materiales</option>
            </select>
          </div>

          {/* Tabla de Recursos */}
          <div className="table-container">
            {recursosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No se encontraron recursos registrados.
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th style={{ textAlign: 'center' }}>Stock Total</th>
                    <th style={{ textAlign: 'center' }}>Disponible</th>
                    <th>Estado</th>
                    <th>Descripción</th>
                    <th style={{ textAlign: 'center', width: '100px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recursosFiltrados.map(rec => (
                    <tr key={rec.id}>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        {rec.tipo === 'Dispositivo' ? <Laptop size={16} color="var(--color-brand-cyan-muted)" /> : <BookOpen size={16} color="var(--color-brand-gold)" />}
                      </td>
                      <td style={{ fontWeight: '700' }}>{rec.nombre}</td>
                      <td>{rec.tipo}</td>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>{rec.cantidadTotal}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span 
                          style={{ 
                            fontWeight: '700', 
                            color: rec.cantidadDisponible === 0 ? 'var(--color-danger)' : 
                                   (rec.cantidadDisponible === rec.cantidadTotal ? 'var(--color-success)' : 'var(--color-brand-cyan-muted)')
                          }}
                        >
                          {rec.cantidadDisponible}
                        </span>
                      </td>
                      <td>{obtenerInsigniaEstado(rec.estado)}</td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rec.descripcion}>
                        {rec.descripcion || 'Sin descripción.'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => alAbrirModalEditar(rec)} 
                            className="btn btn-secondary" 
                            style={{ padding: '0.375rem', borderRadius: '4px' }} 
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => alEliminar(rec.id)} 
                            className="btn btn-danger" 
                            style={{ padding: '0.375rem', borderRadius: '4px' }} 
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Modal de Agregar / Editar */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}>
                {recursoEditando ? 'Modificar Recurso' : 'Nuevo Recurso Educativo'}
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
                  <label className="form-label">Nombre del Recurso</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. Proyector Epson FH50" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)}
                    required 
                  />
                </div>

                <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Tipo</label>
                    <select 
                      className="form-select" 
                      value={tipo} 
                      onChange={(e) => setTipo(e.target.value)}
                    >
                      <option value="Dispositivo">Dispositivo</option>
                      <option value="Libro">Libro</option>
                      <option value="Material">Material</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Cantidad Total</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="1" 
                      value={cantidadTotal} 
                      onChange={(e) => setCantidadTotal(e.target.value)}
                      required 
                  />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estado Físico</label>
                  <select 
                    className="form-select" 
                    value={estado} 
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="Excelente">Excelente (Operativo al 100%)</option>
                    <option value="Bueno">Bueno (Con desgaste cosmético)</option>
                    <option value="Mantenimiento">Mantenimiento (No disponible temporalmente)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Detalles sobre marca, modelo, accesorios incluidos, ubicación, etc..." 
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
                  {recursoEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
