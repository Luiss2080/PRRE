import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEspacios, saveSpace, deleteSpace } from '../utils/mockData';
import { Plus, Edit2, Trash2, Search, X, MapPin, Monitor, Globe } from 'lucide-react';

export default function EspaciosModule({ onReserveRedirect }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.rol === 'Administrador';

  const [espacios, setEspacios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEspacio, setEditingEspacio] = useState(null);

  // Form fields
  const [nombre, setNombre] = useState('');
  const [capacidad, setCapacidad] = useState(20);
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState('Físico');
  const [estado, setEstado] = useState('Disponible');
  const [descripcion, setDescripcion] = useState('');
  const [formError, setFormError] = useState('');

  const loadEspacios = () => {
    setEspacios(getEspacios());
  };

  useEffect(() => {
    loadEspacios();
  }, []);

  const handleOpenAddModal = () => {
    setEditingEspacio(null);
    setNombre('');
    setCapacidad(20);
    setUbicacion('');
    setTipo('Físico');
    setEstado('Disponible');
    setDescripcion('');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (esp) => {
    setEditingEspacio(esp);
    setNombre(esp.nombre);
    setCapacidad(esp.capacidad);
    setUbicacion(esp.ubicacion);
    setTipo(esp.tipo);
    setEstado(esp.estado);
    setDescripcion(esp.descripcion || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!nombre.trim()) {
      setFormError('El nombre del espacio es obligatorio.');
      return;
    }
    if (!ubicacion.trim()) {
      setFormError('La ubicación es obligatoria.');
      return;
    }
    if (capacidad < 1) {
      setFormError('La capacidad debe ser de al menos 1 persona.');
      return;
    }

    const spaceData = {
      id: editingEspacio ? editingEspacio.id : undefined,
      nombre,
      capacidad: parseInt(capacidad),
      ubicacion,
      tipo,
      estado,
      descripcion
    };

    saveSpace(spaceData);
    loadEspacios();
    setModalOpen(false);

    // Update statistics
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este espacio físico/virtual?')) {
      deleteSpace(id);
      loadEspacios();
      window.dispatchEvent(new Event('prre_db_update'));
    }
  };

  // Filter list
  const filteredEspacios = espacios.filter(esp => {
    const matchesSearch = esp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          esp.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTipo === 'Todos' || esp.tipo === filterTipo;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Disponible': return <span className="badge badge-success">Disponible</span>;
      case 'Ocupado': return <span className="badge badge-danger">Ocupado</span>;
      case 'Mantenimiento': return <span className="badge badge-warning">Mantenimiento</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  const getTipoIcon = (tipo) => {
    if (tipo === 'Físico') {
      return <MapPin size={16} style={{ color: 'var(--color-brand-cyan)' }} />;
    }
    return <Globe size={16} style={{ color: 'var(--color-brand-gold)' }} />;
  };

  return (
    <div>
      {/* Module Header Actions */}
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
          {/* Search */}
          <div className="search-container" style={{ flexGrow: 1, maxWidth: 'none' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar espacio o ubicación..." 
              className="search-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select 
            className="form-select" 
            style={{ width: '160px', padding: '0.625rem 1rem' }}
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
          >
            <option value="Todos">Todos los tipos</option>
            <option value="Físico">Físicos</option>
            <option value="Virtual">Virtuales</option>
          </select>
        </div>

        {/* Add Button (Admin only) */}
        {isAdmin && (
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} />
            <span>Agregar Espacio</span>
          </button>
        )}
      </div>

      {/* Spaces Table */}
      <div className="table-container">
        {filteredEspacios.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No se encontraron espacios que coincidan con la búsqueda.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Nombre del Espacio</th>
                <th>Ubicación</th>
                <th>Tipo</th>
                <th style={{ textAlign: 'center' }}>Capacidad</th>
                <th>Estado</th>
                <th>Descripción</th>
                {isAdmin && <th style={{ textAlign: 'center', width: '100px' }}>Acciones</th>}
                {!isAdmin && <th style={{ textAlign: 'center', width: '130px' }}>Reservar</th>}
              </tr>
            </thead>
            <tbody>
              {filteredEspacios.map(esp => (
                <tr key={esp.id}>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    {getTipoIcon(esp.tipo)}
                  </td>
                  <td style={{ fontWeight: '700' }}>{esp.nombre}</td>
                  <td>{esp.ubicacion}</td>
                  <td>
                    <span style={{ fontWeight: '500', fontSize: '0.8125rem' }}>
                      {esp.tipo}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '600' }}>
                    {esp.capacidad} pers.
                  </td>
                  <td>{getStatusBadge(esp.estado)}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={esp.descripcion}>
                    {esp.descripcion || 'Sin descripción.'}
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleOpenEditModal(esp)} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.375rem', borderRadius: '4px' }} 
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(esp.id)} 
                          className="btn btn-danger" 
                          style={{ padding: '0.375rem', borderRadius: '4px' }} 
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                  {!isAdmin && (
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => onReserveRedirect && onReserveRedirect(esp)}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: '750' }}
                        disabled={esp.estado === 'Mantenimiento' || esp.estado === 'Ocupado'}
                      >
                        {esp.estado === 'Mantenimiento' ? 'Mantenimiento' : (esp.estado === 'Ocupado' ? 'Ocupado' : 'Reservar Aula')}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}>
                {editingEspacio ? 'Modificar Espacio' : 'Nuevo Espacio Físico / Virtual'}
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
                  onClick={() => setModalOpen(false)} 
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {editingEspacio ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
