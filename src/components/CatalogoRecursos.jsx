import React, { useState, useEffect } from 'react';
import { getRecursos } from '../utils/datosSimulados';
import { Search, Laptop, BookOpen, Layers, AlertCircle } from 'lucide-react';

/**
 * CatalogoRecursos
 * Componente que muestra una cuadrícula interactiva de tarjetas con los recursos
 * educativos disponibles (laptops, proyectores, kits, libros, etc.) del colegio.
 */
export default function CatalogoRecursos({ alHacerClicReserva, esPublico = false }) {
  // Estado que almacena la lista completa de recursos escolares
  const [recursos, setRecursos] = useState([]);
  
  // Estado para la barra de búsqueda de texto
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  // Estado para el filtro por categoría (Dispositivo, Libro, Material)
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // Estado para la paginación
  const [paginaActual, setPaginaActual] = useState(1);

  // Reinicia la página actual si cambia la búsqueda o el filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [terminoBusqueda, filtroTipo]);

  // Función interna para cargar la información de recursos desde la base de datos simulada
  const cargarRecursos = () => {
    setRecursos(getRecursos());
  };

  // Carga los recursos al montar el componente y se suscribe al evento global
  // para actualizar el catálogo de forma reactiva cuando haya cambios en el stock.
  useEffect(() => {
    cargarRecursos();
    window.addEventListener('prre_db_update', cargarRecursos);
    return () => window.removeEventListener('prre_db_update', cargarRecursos);
  }, []);

  // Filtra los recursos correspondientes en función de la búsqueda y la categoría seleccionada
  const recursosFiltrados = recursos.filter(rec => {
    const coincideBusqueda = rec.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) || 
                            rec.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideFiltro = filtroTipo === 'Todos' || rec.tipo === filtroTipo;
    return coincideBusqueda && coincideFiltro;
  });

  const itemsPorPagina = 6;
  const totalPaginas = Math.ceil(recursosFiltrados.length / itemsPorPagina);
  const recursosPaginados = recursosFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  // Retorna el icono Lucide correspondiente al tipo de recurso
  const obtenerIconoTipo = (tipo, size = 28) => {
    switch (tipo) {
      case 'Dispositivo': return <Laptop size={size} color="white" />;
      case 'Libro': return <BookOpen size={size} color="white" />;
      default: return <Layers size={size} color="white" />;
    }
  };

  // Retorna una URL de imagen ilustrativa y de alta calidad para cada tipo de recurso
  const obtenerImagenRecurso = (id, nombre, tipo) => {
    const mapaImagenes = {
      'rec_1': 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?auto=format&fit=crop&w=400&q=80', // Proyector Epson (moderno blanco)
      'rec_2': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80', // Laptop HP (limpia en mesa)
      'rec_3': 'https://images.unsplash.com/photo-1589256469067-ea99122bbec4?auto=format&fit=crop&w=400&q=80', // Tablet Lenovo (lápiz y tableta)
      'rec_4': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80', // Física Cuántica (ciencia/cuántica)
      'rec_5': 'https://images.unsplash.com/photo-1561736778-92e52a77cf94?auto=format&fit=crop&w=400&q=80', // Arduino Kit (cables y placas)
      'rec_6': 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80', // Microscopio (laboratorio médico)
      'rec_7': 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=400&q=80', // Sensores Vernier (matraces y química)
      'rec_8': 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80', // VR Casco (Meta Quest)
      'rec_9': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80', // Diccionario Química (biblioteca científica)
      'rec_10': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80', // Torso Humano (modelo anatómico)
      'rec_11': 'https://images.unsplash.com/photo-1517055720413-6e5a807d8b58?auto=format&fit=crop&w=400&q=80', // Experimento Eléctrico (placas de circuito)
      'rec_12': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=400&q=80', // Calculadora Casio (financiera/oficina)
      'rec_13': 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=400&q=80', // Laptop Dell (computadora abierta)
      'rec_14': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80', // Tablet Samsung (pantalla encendida)
      'rec_15': 'https://images.unsplash.com/photo-1530210120070-ad161e4116db?auto=format&fit=crop&w=400&q=80', // Anatomía Ósea (esqueleto)
      'rec_16': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80', // Grossman Álgebra (pizarra/matemáticas)
      'rec_17': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=400&q=80', // Termodinámica (sensores físicos)
      'rec_18': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80', // Proyector Optoma (luz de lente/proyección)
      'rec_19': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80', // Química Chang (manual/cuaderno de química)
      'rec_20': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80', // Cristalería (tubos de ensayo)
    };

    if (mapaImagenes[id]) {
      return mapaImagenes[id];
    }

    // Fallback para recursos agregados en caliente por el administrador
    const nomLower = nombre.toLowerCase();
    if (nomLower.includes('proyector')) return 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?auto=format&fit=crop&w=400&q=80';
    if (nomLower.includes('laptop') || nomLower.includes('computadora')) return 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=400&q=80';
    if (nomLower.includes('tablet') || nomLower.includes('ipad')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80';
    if (nomLower.includes('libro') || nomLower.includes('álgebra') || nomLower.includes('química') || nomLower.includes('física')) return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80';
    
    if (tipo === 'Dispositivo') {
      return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80';
    }
    if (tipo === 'Libro') {
      return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80';
    }
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80';
  };



  // Renderiza la plaqueta (badge) de estado físico del recurso
  const obtenerInsigniaEstado = (estado) => {
    switch (estado) {
      case 'Excelente': return <span className="badge badge-success">Excelente</span>;
      case 'Bueno': return <span className="badge badge-info">Bueno</span>;
      case 'Mantenimiento': return <span className="badge badge-warning">En Mantenimiento</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', width: '100%', alignItems: 'start' }}>
      {/* Catálogo en Pantalla Completa */}
      <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column' }}>
        {/* Contenedor de Búsqueda y Filtros de Categorías */}
        <div 
          className="glass-card" 
          style={{ 
            marginBottom: '2rem', 
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Barra de búsqueda integrada con iconos */}
          <div className="search-container" style={{ flexGrow: 1, maxWidth: '450px' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar laptops, proyectores, libros de consulta..." 
              className="search-input"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>

          {/* Botones de categoría tipo Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Todos', 'Dispositivo', 'Libro', 'Material'].map(tipo => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`btn ${filtroTipo === tipo ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  padding: '0.45rem 1rem', 
                  fontSize: '0.8125rem',
                  boxShadow: filtroTipo === tipo ? 'var(--shadow-glow-cyan)' : 'none'
                }}
              >
                {tipo === 'Todos' ? 'Todos' : (tipo === 'Dispositivo' ? 'Dispositivos' : (tipo === 'Libro' ? 'Libros' : 'Materiales'))}
              </button>
            ))}
          </div>
        </div>

        {/* Info y Contador de Búsqueda de Catálogo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
          <span>
            {terminoBusqueda || filtroTipo !== 'Todos' ? (
              <>Se encontraron <b>{recursosFiltrados.length}</b> recursos en el catálogo de <b>{recursos.length}</b> en total.</>
            ) : (
              <>Total: <b>{recursos.length}</b> recursos en catálogo.</>
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

        {/* Cuadrícula de Tarjetas del Catálogo */}
        {recursosFiltrados.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-gold)' }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>No se encontraron recursos</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto', lineHeight: '1.4' }}>
                No hay recursos en el catálogo que coincidan con la búsqueda de "{terminoBusqueda}". Intente con otros términos o limpie los filtros.
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
          <div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '1.5rem',
              justifyContent: 'center',
              animation: 'fadeIn 0.4s ease-out'
            }}
          >
            {recursosPaginados.map(rec => {
              const sinStock = rec.cantidadDisponible === 0;
              const enMantenimiento = rec.estado === 'Mantenimiento';
              const deshabilitarReserva = sinStock || enMantenimiento;

              return (
                <div 
                  key={rec.id} 
                  className={`glass-card ${rec.tipo === 'Dispositivo' ? 'glow-card-cyan' : 'glow-card-gold'}`}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    padding: 0,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    minHeight: '200px',
                    width: '100%',
                    maxWidth: '540px',
                    flex: '1 1 480px'
                  }}
                >
                  {/* Lado izquierdo: Imagen representativa */}
                  <div style={{ width: '160px', minWidth: '160px', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={obtenerImagenRecurso(rec.id, rec.nombre, rec.tipo)} 
                      alt={rec.nombre} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block'
                      }} 
                    />
                    {/* Badge tipo flotante */}
                    <div 
                      style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        left: '10px', 
                        backgroundColor: 'rgba(15, 23, 42, 0.75)', 
                        backdropFilter: 'blur(4px)',
                        borderRadius: '6px', 
                        padding: '0.2rem 0.4rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.3rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {obtenerIconoTipo(rec.tipo, 12)}
                      <span style={{ fontSize: '0.625rem', fontWeight: '800', textTransform: 'uppercase', color: 'white' }}>
                        {rec.tipo}
                      </span>
                    </div>
                  </div>

                  {/* Lado derecho: Descripción e información */}
                  <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {rec.nombre}
                        </h3>
                        {obtenerInsigniaEstado(rec.estado)}
                      </div>
                      
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {rec.descripcion || 'Sin descripción adicional.'}
                      </p>
                    </div>

                    <div>
                      {/* Barra de progreso de stock */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Stock</span>
                          <span style={{ color: sinStock ? 'var(--color-danger)' : 'var(--color-success)' }}>
                            {rec.cantidadDisponible} / {rec.cantidadTotal} uds.
                          </span>
                        </div>
                        <div 
                          style={{ 
                            height: '5px', 
                            backgroundColor: 'var(--border-color)', 
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}
                        >
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${(rec.cantidadDisponible / rec.cantidadTotal) * 100}%`,
                              backgroundColor: sinStock ? 'var(--color-danger)' : 'var(--color-success)',
                              borderRadius: '3px',
                              transition: 'width 0.5s ease-out'
                            }}
                          />
                        </div>
                      </div>

                      {/* Botón de acción */}
                      {esPublico ? (
                        <button 
                          className="btn btn-secondary w-full"
                          style={{ fontSize: '0.75rem', padding: '0.45rem' }}
                          disabled={true}
                        >
                          Inicie sesión para reservar
                        </button>
                      ) : (
                        <button 
                          onClick={() => alHacerClicReserva && alHacerClicReserva(rec)}
                          className={`btn w-full ${rec.tipo === 'Dispositivo' ? 'btn-primary' : 'btn-accent'}`}
                          style={{ fontSize: '0.75rem', padding: '0.45rem' }}
                          disabled={deshabilitarReserva}
                        >
                          {enMantenimiento ? 'En Mantenimiento' : (sinStock ? 'Sin Stock' : 'Reservar Ahora')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Controles de Paginación */}
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
            <button 
              disabled={paginaActual === 1} 
              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
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
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
            >
              Siguiente &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos en línea para las Tarjetas del Catálogo
const estiloCabeceraTarjeta = (tipo) => {
  const esDispositivo = tipo === 'Dispositivo';
  return {
    background: esDispositivo 
      ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(0, 119, 182, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(255, 159, 28, 0.1) 0%, rgba(217, 119, 6, 0.15) 100%)',
    height: '110px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottom: '1px solid var(--border-color)',
  };
};
