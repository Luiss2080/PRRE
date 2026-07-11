import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecursos, saveRecurso, deleteRecurso } from '../utils/mockData';
import CatalogoRecursos from './CatalogoRecursos';
import { Plus, Edit2, Trash2, Search, X, Laptop, BookOpen, Layers, Eye, Table } from 'lucide-react';

export default function RecursosModule({ onReserveRedirect }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.rol === 'Administrador';

  // Toggle view for admin: 'table' or 'catalog'
  const [adminView, setAdminView] = useState('table');

  const [recursos, setRecursos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState(null);
  
  // Form fields
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Dispositivo');
  const [cantidadTotal, setCantidadTotal] = useState(1);
  const [estado, setEstado] = useState('Excelente');
  const [descripcion, setDescripcion] = useState('');
  const [formError, setFormError] = useState('');

  const loadRecursos = () => {
    setRecursos(getRecursos());
  };

  useEffect(() => {
    loadRecursos();
  }, []);

  const handleOpenAddModal = () => {
    setEditingRecurso(null);
    setNombre('');
    setTipo('Dispositivo');
    setCantidadTotal(1);
    setEstado('Excelente');
    setDescripcion('');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (rec) => {
    setEditingRecurso(rec);
    setNombre(rec.nombre);
    setTipo(rec.tipo);
    setCantidadTotal(rec.cantidadTotal);
    setEstado(rec.estado);
    setDescripcion(rec.descripcion || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!nombre.trim()) {
      setFormError('El nombre del recurso es obligatorio.');
      return;
    }
    if (cantidadTotal < 1) {
      setFormError('La cantidad total debe ser al menos 1.');
      return;
    }

    let cantidadDisponible = cantidadTotal;
    if (editingRecurso) {
      const reservedCount = editingRecurso.cantidadTotal - editingRecurso.cantidadDisponible;
      if (cantidadTotal < reservedCount) {
        setFormError(`No puedes reducir el total por debajo de los recursos reservados (${reservedCount} reservados).`);
        return;
      }
      cantidadDisponible = cantidadTotal - reservedCount;
    }

    const recursoData = {
      id: editingRecurso ? editingRecurso.id : undefined,
      nombre,
      tipo,
      cantidadTotal: parseInt(cantidadTotal),
      cantidadDisponible: parseInt(cantidadDisponible),
      estado,
      descripcion
    };

    saveRecurso(recursoData);
    loadRecursos();
    setModalOpen(false);
    
    // Notify Dashboard
    window.dispatchEvent(new Event('prre_db_update'));
    // Notify Catalogo components
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este recurso? Esta acción no se puede deshacer.')) {
      deleteRecurso(id);
      loadRecursos();
      window.dispatchEvent(new Event('prre_db_update'));
    }
  };

  const filteredRecursos = recursos.filter(rec => {
    const matchesSearch = rec.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTipo === 'Todos' || rec.tipo === filterTipo;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Excelente': return <span className="badge badge-success">Excelente</span>;
      case 'Bueno': return <span className="badge badge-info">Bueno</span>;
      case 'Mantenimiento': return <span className="badge badge-warning">Mantenimiento</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  // If user is not Admin, they only see the Card Catalog by default
  if (!isAdmin) {
    return <CatalogoRecursos onReserveClick={onReserveRedirect} isPublic={false} />;
  }

  return (
    <div>
      {/* Admin layout view selectors */}
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
        {/* Toggle between admin CRUD table and Card Catalog */}
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.25rem', borderRadius: 'var(--border-radius-sm)' }}>
          <button 
            onClick={() => setAdminView('table')}
            className="btn"
            style={{ 
              padding: '0.45rem 1rem', 
              fontSize: '0.8125rem', 
              backgroundColor: adminView === 'table' ? 'var(--color-brand-cyan-muted)' : 'transparent',
              color: adminView === 'table' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              boxShadow: adminView === 'table' ? 'var(--shadow-glow-cyan)' : 'none'
            }}
          >
            <Table size={14} style={{ marginRight: '0.25rem' }} />
            <span>Vista Tabla (CRUD)</span>
          </button>
          <button 
            onClick={() => setAdminView('catalog')}
            className="btn"
            style={{ 
              padding: '0.45rem 1rem', 
              fontSize: '0.8125rem', 
              backgroundColor: adminView === 'catalog' ? 'var(--color-brand-cyan-muted)' : 'transparent',
              color: adminView === 'catalog' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              boxShadow: adminView === 'catalog' ? 'var(--shadow-glow-cyan)' : 'none'
            }}
          >
            <Eye size={14} style={{ marginRight: '0.25rem' }} />
            <span>Vista Catálogo</span>
          </button>
        </div>

        {/* Add Button */}
        {adminView === 'table' && (
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} />
            <span>Agregar Recurso</span>
          </button>
        )}
      </div>

      {/* Render selected view */}
      {adminView === 'catalog' ? (
        <CatalogoRecursos onReserveClick={onReserveRedirect} isPublic={false} />
      ) : (
        <>
          {/* Filters for Admin Table */}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="form-select" 
              style={{ width: '160px' }}
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              <option value="Todos">Todos los tipos</option>
              <option value="Dispositivo">Dispositivos</option>
              <option value="Libro">Libros</option>
              <option value="Material">Materiales</option>
            </select>
          </div>

          {/* Resources Table */}
          <div className="table-container">
            {filteredRecursos.length === 0 ? (
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
                  {filteredRecursos.map(rec => (
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
                      <td>{getStatusBadge(rec.estado)}</td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rec.descripcion}>
                        {rec.descripcion || 'Sin descripción.'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleOpenEditModal(rec)} 
                            className="btn btn-secondary" 
                            style={{ padding: '0.375rem', borderRadius: '4px' }} 
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(rec.id)} 
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

      {/* CRUD Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}>
                {editingRecurso ? 'Modificar Recurso' : 'Nuevo Recurso Educativo'}
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
                  onClick={() => setModalOpen(false)} 
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {editingRecurso ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
