import React, { useState, useEffect } from 'react';
import { getRecursos } from '../utils/datosSimulados';
import { Search, Laptop, BookOpen, Layers } from 'lucide-react';

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
  const obtenerIconoTipo = (tipo) => {
    switch (tipo) {
      case 'Dispositivo': return <Laptop size={28} color="white" />;
      case 'Libro': return <BookOpen size={28} color="white" />;
      default: return <Layers size={28} color="white" />;
    }
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
      {/* Columna Izquierda (68% de ancho) */}
      <div style={{ flex: '1 1 68%', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
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

        {/* Cuadrícula de Tarjetas del Catálogo */}
        {recursosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            No se encontraron recursos disponibles que coincidan con la búsqueda.
          </div>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '1.5rem',
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
                    flexDirection: 'column', 
                    padding: 0,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    minHeight: '340px'
                  }}
                >
                  {/* Encabezado visual de la tarjeta */}
                  <div style={estiloCabeceraTarjeta(rec.tipo)}>
                    <div 
                      style={{ 
                        width: '52px', 
                        height: '52px', 
                        borderRadius: '50%', 
                        backgroundColor: rec.tipo === 'Dispositivo' ? 'var(--color-brand-cyan-muted)' : 'var(--color-brand-gold)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {obtenerIconoTipo(rec.tipo)}
                    </div>
                    <span style={{ fontSize: '0.625rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                      {rec.tipo}
                    </span>
                  </div>

                  {/* Cuerpo de la tarjeta */}
                  <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                          {rec.nombre}
                        </h3>
                        {obtenerInsigniaEstado(rec.estado)}
                      </div>
                      
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                        {rec.descripcion || 'Sin descripción adicional.'}
                      </p>
                    </div>

                    <div>
                      {/* Barra de progreso de stock */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Stock Disponible</span>
                          <span style={{ color: sinStock ? 'var(--color-danger)' : 'var(--color-success)' }}>
                            {rec.cantidadDisponible} / {rec.cantidadTotal} uds.
                          </span>
                        </div>
                        <div 
                          style={{ 
                            height: '6px', 
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
                          style={{ fontSize: '0.8125rem' }}
                          disabled={true}
                        >
                          Inicie sesión para reservar
                        </button>
                      ) : (
                        <button 
                          onClick={() => alHacerClicReserva && alHacerClicReserva(rec)}
                          className={`btn w-full ${rec.tipo === 'Dispositivo' ? 'btn-primary' : 'btn-accent'}`}
                          style={{ fontSize: '0.8125rem' }}
                          disabled={deshabilitarReserva}
                        >
                          {enMantenimiento ? 'En Mantenimiento' : (sinStock ? 'Sin Stock Disponible' : 'Reservar Ahora')}
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

      {/* Columna Derecha (28% de ancho) - Resumen y Políticas */}
      <div style={{ flex: '1 1 28%', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: 'calc(var(--header-height) + 1.5rem)' }}>
        {/* Resumen del Inventario */}
        <div className="glass-card glow-card-cyan" style={{ borderLeft: '4px solid var(--color-brand-cyan-muted)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--color-brand-cyan-muted)" />
            Inventario Rápido
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span>Laptops de Computación:</span>
              <b style={{ color: 'var(--text-primary)' }}>20 unidades</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span>Proyectores HDMI:</span>
              <b style={{ color: 'var(--text-primary)' }}>5 unidades</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span>Tabletas Lenovo:</span>
              <b style={{ color: 'var(--text-primary)' }}>15 unidades</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Textos de Consulta:</span>
              <b style={{ color: 'var(--text-primary)' }}>3 unidades</b>
            </div>
          </div>
        </div>

        {/* Políticas del Portal */}
        <div className="glass-card glow-card-gold" style={{ borderLeft: '4px solid var(--color-brand-gold)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} color="var(--color-brand-gold)" />
            Reglas del Portal
          </h3>
          <ul style={{ paddingLeft: '1.15rem', margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.4' }}>
            <li>Las reservas deben crearse al menos con 24h de anticipación.</li>
            <li>Al finalizar su clase, devuelva los cables y adaptadores en TI.</li>
            <li>En caso de fallas físicas, repórtelo en soporte del bloque administrativo.</li>
          </ul>
        </div>
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

const estiloCirculoIcono = {
  width: '54px',
  height: '54px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-brand-blue-dark)',
  border: '2px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  marginBottom: '0.5rem',
};

const estiloInsigniaTipo = {
  fontSize: '0.625rem',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--text-muted)',
};

const estiloTituloTarjeta = {
  fontSize: '1rem',
  fontWeight: '800',
  marginBottom: '0.5rem',
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const estiloDescripcionTarjeta = {
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5',
  height: '54px',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  marginBottom: '1rem',
};

const estiloContenedorProgreso = {
  width: '100%',
  height: '6px',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  borderRadius: '10px',
  overflow: 'hidden',
};

const estiloBarraProgreso = {
  height: '100%',
  borderRadius: '10px',
  transition: 'width 0.5s ease',
};

const estiloPieAccionesTarjeta = {
  padding: '1rem 1.25rem 1.25rem 1.25rem',
  borderTop: '1px solid var(--border-color)',
  backgroundColor: 'rgba(0,0,0,0.01)',
};
