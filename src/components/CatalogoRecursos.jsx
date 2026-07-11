import React, { useState, useEffect } from 'react';
import { getRecursos } from '../utils/mockData';
import { Search, Laptop, BookOpen, Layers, Info, Calendar } from 'lucide-react';

export default function CatalogoRecursos({ onReserveClick, isPublic = false }) {
  // Estado que almacena la lista completa de recursos escolares
  const [recursos, setRecursos] = useState([]);
  
  // Estado para la barra de búsqueda de texto
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el filtro por categoría (Dispositivo, Libro, Material)
  const [filterTipo, setFilterTipo] = useState('Todos');

  // Función interna para cargar la información de recursos desde la base de datos simulada
  const loadRecursos = () => {
    setRecursos(getRecursos());
  };

  // Carga los recursos al montar el componente y se suscribe al evento global
  // para actualizar el catálogo de forma reactiva cuando haya cambios en el stock.
  useEffect(() => {
    loadRecursos();
    window.addEventListener('prre_db_update', loadRecursos);
    return () => window.removeEventListener('prre_db_update', loadRecursos);
  }, []);

  // Filtra los recursos correspondientes en función de la búsqueda y la categoría seleccionada
  const filteredRecursos = recursos.filter(rec => {
    const matchesSearch = rec.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTipo === 'Todos' || rec.tipo === filterTipo;
    return matchesSearch && matchesFilter;
  });

  // Retorna el icono Lucide correspondiente al tipo de recurso
  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'Dispositivo': return <Laptop size={28} color="white" />;
      case 'Libro': return <BookOpen size={28} color="white" />;
      default: return <Layers size={28} color="white" />;
    }
  };

  // Devuelve la clase CSS del gradiente superior según el tipo
  const getTipoColorClass = (tipo) => {
    switch (tipo) {
      case 'Dispositivo': return 'gradient-cyan';
      case 'Libro': return 'gradient-gold';
      default: return 'gradient-indigo';
    }
  };

  // Renderiza la plaqueta (badge) de estado físico del recurso
  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Excelente': return <span className="badge badge-success">Excelente</span>;
      case 'Bueno': return <span className="badge badge-info">Bueno</span>;
      case 'Mantenimiento': return <span className="badge badge-warning">En Mantenimiento</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Contenedor de Búsqueda y Filtros de Categorías */}
      <div 
        className="glass-card" 
        style={{ 
          marginBottom: '2rem', 
          padding: '1.25rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {/* Input de Búsqueda */}
        <div className="search-container" style={{ flexGrow: 1, maxWidth: 'none' }}>
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar laptops, proyectores, libros de consulta..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Botones de Categorías */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['Todos', 'Dispositivo', 'Libro', 'Material'].map(t => (
            <button
              key={t}
              onClick={() => setFilterTipo(t)}
              className="btn"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.8125rem',
                backgroundColor: filterTipo === t ? 'var(--color-brand-cyan-muted)' : 'var(--bg-primary)',
                color: filterTipo === t ? 'white' : 'var(--text-primary)',
                border: filterTipo === t ? 'none' : '1px solid var(--border-color)',
                boxShadow: filterTipo === t ? 'var(--shadow-glow-cyan)' : 'none'
              }}
            >
              {t === 'Todos' ? 'Todos' : (t === 'Dispositivo' ? 'Dispositivos' : (t === 'Libro' ? 'Libros' : 'Materiales'))}
            </button>
          ))}
        </div>
      </div>

      {/* Cuadrícula de Tarjetas del Catálogo */}
      {filteredRecursos.length === 0 ? (
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
          {filteredRecursos.map(rec => {
            const isOutOfStock = rec.cantidadDisponible === 0;
            const isMaintenance = rec.estado === 'Mantenimiento';
            const disableReserve = isOutOfStock || isMaintenance;

            return (
              <div 
                key={rec.id} 
                className={`glass-card ${rec.tipo === 'Dispositivo' ? 'glow-card-cyan' : 'glow-card-gold'}`}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  padding: 0,
                  overflow: 'hidden',
                  borderTop: `4px solid ${rec.tipo === 'Dispositivo' ? 'var(--color-brand-cyan-muted)' : 'var(--color-brand-gold)'}`
                }}
              >
                {/* Cabecera visual de la tarjeta con gradientes */}
                <div style={cardHeaderStyle(rec.tipo)}>
                  <div style={iconCircleStyle}>
                    {getTipoIcon(rec.tipo)}
                  </div>
                  <span style={typeBadgeStyle}>{rec.tipo}</span>
                </div>

                {/* Cuerpo de la Tarjeta */}
                <div style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem', flexGrow: 1 }}>
                  <h3 style={cardTitleStyle} title={rec.nombre}>{rec.nombre}</h3>
                  <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    {getStatusBadge(rec.estado)}
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>ID: {rec.id}</span>
                  </div>
                  <p style={cardDescStyle}>{rec.descripcion || 'Sin descripción adicional.'}</p>
                </div>

                {/* Telemetría de Stock y Barra de Progreso */}
                <div style={{ padding: '0 1.25rem 1rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem', fontWeight: '700' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Stock Disponible</span>
                    <span style={{ color: isOutOfStock ? 'var(--color-danger)' : 'var(--color-success)' }}>
                      {rec.cantidadDisponible} / {rec.cantidadTotal} uds.
                    </span>
                  </div>
                  <div style={progressContainerStyle}>
                    <div 
                      style={{ 
                        ...progressBarStyle, 
                        width: `${(rec.cantidadDisponible / rec.cantidadTotal) * 100}%`,
                        backgroundColor: isOutOfStock ? 'var(--color-danger)' : 'var(--color-success)'
                      }} 
                    />
                  </div>
                </div>

                {/* Pie de Página de la Tarjeta - Botones de Reservas */}
                <div style={cardActionFooterStyle}>
                  {isPublic ? (
                    <button 
                      onClick={() => alert('Por favor, inicie sesión o cree una cuenta para realizar reservas.')}
                      className="btn btn-secondary w-full"
                      style={{ fontSize: '0.75rem', fontWeight: '700' }}
                    >
                      Iniciar Sesión para Reservar
                    </button>
                  ) : (
                    <button 
                      onClick={() => onReserveClick && onReserveClick(rec)}
                      className={`btn w-full ${rec.tipo === 'Dispositivo' ? 'btn-primary' : 'btn-accent'}`}
                      style={{ fontSize: '0.8125rem' }}
                      disabled={disableReserve}
                    >
                      {isMaintenance ? 'En Mantenimiento' : (isOutOfStock ? 'Sin Stock Disponible' : 'Reservar Ahora')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Estilos en línea para las Tarjetas del Catálogo
const cardHeaderStyle = (tipo) => {
  const isDevice = tipo === 'Dispositivo';
  return {
    background: isDevice 
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

const iconCircleStyle = {
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

const typeBadgeStyle = {
  fontSize: '0.625rem',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--text-muted)',
};

const cardTitleStyle = {
  fontSize: '1rem',
  fontWeight: '800',
  marginBottom: '0.5rem',
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const cardDescStyle = {
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

const progressContainerStyle = {
  width: '100%',
  height: '6px',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  borderRadius: '10px',
  overflow: 'hidden',
};

const progressBarStyle = {
  height: '100%',
  borderRadius: '10px',
  transition: 'width 0.5s ease',
};

const cardActionFooterStyle = {
  padding: '1rem 1.25rem 1.25rem 1.25rem',
  borderTop: '1px solid var(--border-color)',
  backgroundColor: 'rgba(0,0,0,0.01)',
};
