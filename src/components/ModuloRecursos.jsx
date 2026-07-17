import React, { useState, useEffect } from 'react';
import { useAutenticacion } from '../context/ContextoAutenticacion';
import { getRecursos, saveRecurso, deleteRecurso } from '../utils/datosSimulados';
import CatalogoRecursos from './CatalogoRecursos';
import { Plus, Edit2, Trash2, Search, X, Laptop, BookOpen, Eye, Table, Layers, AlertTriangle, Upload, Link } from 'lucide-react';

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
  const [paginaActual, setPaginaActual] = useState(1);

  // Reinicia la página actual si cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [terminoBusqueda, filtroTipo, vistaAdmin]);
  
  // Estados del modal de agregar/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [recursoEditando, setRecursoEditando] = useState(null);
  
  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Dispositivo');
  const [cantidadTotal, setCantidadTotal] = useState(1);
  const [estado, setEstado] = useState('Excelente');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [modoImagen, setModoImagen] = useState('url'); // 'url' | 'file'
  const [cargandoImagen, setCargandoImagen] = useState(false);
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
    setImagenUrl('');
    setModoImagen('url');
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
    setImagenUrl(recurso.imagenUrl || '');
    // Si la imagen guardada es base64 o una URL normal, detectar modo
    setModoImagen(recurso.imagenUrl?.startsWith('data:') ? 'file' : 'url');
    setErrorFormulario('');
    setModalAbierto(true);
  };

  // Maneja la selección de un archivo de imagen local, convirtiéndolo a base64
  const alSeleccionarArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) {
      setErrorFormulario('Por favor seleccione un archivo de imagen válido (JPG, PNG, WebP, etc.).');
      return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setErrorFormulario('La imagen no puede superar los 5 MB.');
      return;
    }
    setCargandoImagen(true);
    setErrorFormulario('');
    const lector = new FileReader();
    lector.onload = (ev) => {
      setImagenUrl(ev.target.result);
      setCargandoImagen(false);
    };
    lector.onerror = () => {
      setErrorFormulario('Error al leer el archivo. Intente nuevamente.');
      setCargandoImagen(false);
    };
    lector.readAsDataURL(archivo);
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
      descripcion,
      imagenUrl
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

  const itemsPorPagina = 5;
  const totalPaginas = Math.ceil(recursosFiltrados.length / itemsPorPagina);
  const recursosPaginados = recursosFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

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
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', width: '100%', alignItems: 'start' }}>
          {/* Tabla de Recursos en Pantalla Completa */}
          <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column' }}>
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

          {/* Info y Contador de Búsqueda de Recursos */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', padding: '0 0.25rem' }}>
            <span>
              {terminoBusqueda || filtroTipo !== 'Todos' ? (
                <>Se encontraron <b>{recursosFiltrados.length}</b> recursos de <b>{recursos.length}</b> en el inventario.</>
              ) : (
                <>Total: <b>{recursos.length}</b> recursos registrados.</>
              )}
            </span>
            {(terminoBusqueda || filtroTipo !== 'Todos') && (
              <button 
                onClick={() => {
                  setTerminoBusqueda('');
                  setFiltroTipo('Todos');
                }} 
                style={{ background: 'none', border: 'none', color: 'var(--color-brand-cyan-muted)', cursor: 'pointer', fontWeight: '750', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Limpiar Filtros
              </button>
            )}
          </div>

          {/* Tabla de Recursos */}
          <div className="table-container">
            {recursosFiltrados.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-gold)' }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>No se encontraron recursos</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto', lineHeight: '1.4' }}>
                    No hay recursos que coincidan con la búsqueda y filtros actuales.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setTerminoBusqueda('');
                    setFiltroTipo('Todos');
                  }} 
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                >
                  Restablecer Filtros
                </button>
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
                  {recursosPaginados.map(rec => (
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
      </div>
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
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Imagen de la Card</label>

                  {/* Selector de modo: URL o Archivo local */}
                  <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '0.2rem', marginBottom: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => { setModoImagen('url'); setImagenUrl(''); }}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.4rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '4px',
                        border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        backgroundColor: modoImagen === 'url' ? 'var(--color-brand-cyan-muted)' : 'transparent',
                        color: modoImagen === 'url' ? 'white' : 'var(--text-secondary)',
                        boxShadow: modoImagen === 'url' ? 'var(--shadow-glow-cyan)' : 'none'
                      }}
                    >
                      <Link size={13} /> URL / Predefinidas
                    </button>
                    <button
                      type="button"
                      onClick={() => { setModoImagen('file'); setImagenUrl(''); }}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.4rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '4px',
                        border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        backgroundColor: modoImagen === 'file' ? 'var(--color-brand-cyan-muted)' : 'transparent',
                        color: modoImagen === 'file' ? 'white' : 'var(--text-secondary)',
                        boxShadow: modoImagen === 'file' ? 'var(--shadow-glow-cyan)' : 'none'
                      }}
                    >
                      <Upload size={13} /> Subir desde PC
                    </button>
                  </div>

                  {modoImagen === 'url' ? (
                    /* --- Modo URL --- */
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ingrese URL de imagen..."
                        value={imagenUrl}
                        onChange={(e) => setImagenUrl(e.target.value)}
                        style={{ flexGrow: 1 }}
                      />
                      <select
                        className="form-select"
                        style={{ width: '130px', fontSize: '0.75rem', padding: '0 0.5rem' }}
                        onChange={(e) => { if (e.target.value) setImagenUrl(e.target.value); }}
                        value=""
                      >
                        <option value="" disabled>Predefinidas</option>
                        <option value="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80">Laptop Dell</option>
                        <option value="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80">Laptop HP</option>
                        <option value="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80">Tablet Samsung</option>
                        <option value="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=400&q=80">Tablet Lenovo</option>
                        <option value="https://images.unsplash.com/photo-1601987177651-8edfe6c20009?auto=format&fit=crop&w=400&q=80">Proyector Epson</option>
                        <option value="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80">Proyector Cine</option>
                        <option value="https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=400&q=80">Kit Arduino</option>
                        <option value="https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=400&q=80">Sensores Química</option>
                        <option value="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80">Experimento Eléctrico</option>
                        <option value="https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=400&q=80">Anatomía Ósea</option>
                        <option value="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80">Torso Humano</option>
                        <option value="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80">Microscopio</option>
                        <option value="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80">Cristalería</option>
                        <option value="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80">Libros / Biblioteca</option>
                      </select>
                    </div>
                  ) : (
                    /* --- Modo Archivo local --- */
                    <label
                      htmlFor="input-imagen-local"
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '0.5rem', padding: '1.25rem', marginBottom: '0.5rem',
                        border: '2px dashed var(--border-color)', borderRadius: '8px',
                        cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)', fontSize: '0.8125rem', textAlign: 'center'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-cyan)'; e.currentTarget.style.backgroundColor = 'rgba(34,211,238,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                    >
                      {cargandoImagen ? (
                        <span style={{ color: 'var(--color-brand-cyan)' }}>Cargando imagen...</span>
                      ) : (
                        <>
                          <Upload size={22} style={{ color: 'var(--color-brand-cyan)' }} />
                          <span><strong style={{ color: 'var(--text-primary)' }}>Haz clic para seleccionar</strong> o arrastra una imagen</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>JPG, PNG, WebP — máx. 5 MB</span>
                        </>
                      )}
                      <input
                        id="input-imagen-local"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={alSeleccionarArchivo}
                      />
                    </label>
                  )}

                  {/* Vista previa unificada */}
                  {imagenUrl && (
                    <div style={{ position: 'relative', marginTop: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', height: '110px' }}>
                      <img
                        src={imagenUrl}
                        alt="Vista previa"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setImagenUrl('')}
                        style={{
                          position: 'absolute', top: '6px', right: '6px',
                          background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                          width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'white'
                        }}
                        title="Quitar imagen"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}
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
