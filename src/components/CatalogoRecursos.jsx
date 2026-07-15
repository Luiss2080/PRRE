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
                    flexDirection: 'column', 
                    padding: 0,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    minHeight: '340px',
                    flex: '1 1 280px',
                    maxWidth: '320px'
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
