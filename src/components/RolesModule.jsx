import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsuarios, saveUsuario, deleteUsuario } from '../utils/mockData';
import { Shield, ShieldAlert, ShieldCheck, UserMinus, ToggleLeft, ToggleRight, Check, X } from 'lucide-react';

export default function RolesModule() {
  const { currentUser, updateUserRoleAndStatus } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  
  // Edit form states
  const [tempRol, setTempRol] = useState('');
  const [tempEstado, setTempEstado] = useState('');

  const loadUsuarios = () => {
    setUsuarios(getUsuarios());
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setTempRol(user.rol);
    setTempEstado(user.estado);
  };

  const handleSaveClick = (userId) => {
    updateUserRoleAndStatus(userId, tempRol, tempEstado);
    setEditingUserId(null);
    loadUsuarios();
    
    // Notify Dashboard
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const handleDeleteClick = (id) => {
    if (id === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta administrativa.');
      return;
    }
    if (window.confirm('¿Está seguro de que desea eliminar permanentemente a este usuario?')) {
      deleteUsuario(id);
      loadUsuarios();
      window.dispatchEvent(new Event('prre_db_update'));
    }
  };

  const getRoleIcon = (rol) => {
    switch (rol) {
      case 'Administrador': return <ShieldAlert size={16} style={{ color: 'var(--color-brand-gold)' }} />;
      case 'Docente': return <ShieldCheck size={16} style={{ color: 'var(--color-brand-cyan)' }} />;
      case 'Estudiante': return <Shield size={16} style={{ color: 'var(--text-muted)' }} />;
      default: return null;
    }
  };

  // Matrix of system permissions
  const permissionsMatrix = [
    { module: 'Recursos', action: 'Crear / Editar / Eliminar', admin: true, docente: false, estudiante: false },
    { module: 'Recursos', action: 'Visualizar Disponibilidad', admin: true, docente: true, estudiante: true },
    { module: 'Espacios', action: 'Crear / Editar / Eliminar', admin: true, docente: false, estudiante: false },
    { module: 'Espacios', action: 'Visualizar Disponibilidad', admin: true, docente: true, estudiante: true },
    { module: 'Reservas', action: 'Aprobar / Rechazar Solicitudes', admin: true, docente: false, estudiante: false },
    { module: 'Reservas', action: 'Solicitar Reservas', admin: true, docente: true, estudiante: true },
    { module: 'Reservas', action: 'Cancelar Propias Reservas', admin: true, docente: true, estudiante: true },
    { module: 'Historial', action: 'Ver Registro Completo (Global)', admin: true, docente: false, estudiante: false },
    { module: 'Historial', action: 'Ver Historial Propio', admin: true, docente: true, estudiante: true },
    { module: 'Roles y Permisos', action: 'Gestionar Usuarios y Cuentas', admin: true, docente: false, estudiante: false },
  ];

  return (
    <div>
      <div className="grid-cols-2" style={{ gap: '2rem' }}>
        {/* User Management List */}
        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Gestión de Usuarios</h3>
          <div className="table-container" style={{ marginTop: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '700' }}>{user.nombre}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</span>
                      </div>
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <select 
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                          value={tempRol}
                          onChange={(e) => setTempRol(e.target.value)}
                        >
                          <option value="Administrador">Administrador</option>
                          <option value="Docente">Docente</option>
                          <option value="Estudiante">Estudiante</option>
                        </select>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                          {getRoleIcon(user.rol)}
                          {user.rol}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <select 
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                          value={tempEstado}
                          onChange={(e) => setTempEstado(e.target.value)}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                      ) : (
                        <span className={`badge ${user.estado === 'Activo' ? 'badge-success' : 'badge-danger'}`}>
                          {user.estado}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {editingUserId === user.id ? (
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <button 
                            onClick={() => handleSaveClick(user.id)}
                            className="btn btn-primary"
                            style={{ padding: '0.375rem', borderRadius: '4px' }}
                            title="Guardar cambios"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => setEditingUserId(null)}
                            className="btn btn-secondary"
                            style={{ padding: '0.375rem', borderRadius: '4px' }}
                            title="Cancelar"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <button 
                            onClick={() => handleEditClick(user)}
                            className="btn btn-secondary"
                            style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(user.id)}
                            className="btn btn-secondary"
                            style={{ padding: '0.375rem' }}
                            disabled={user.id === currentUser.id}
                            title="Eliminar usuario"
                          >
                            <UserMinus size={14} style={{ color: user.id === currentUser.id ? 'var(--text-muted)' : 'var(--color-danger)' }} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Matriz de Permisos del Sistema</h3>
          <div className="table-container" style={{ marginTop: 0 }}>
            <table className="custom-table" style={{ fontSize: '0.8125rem' }}>
              <thead>
                <tr>
                  <th>Módulo</th>
                  <th>Operación</th>
                  <th style={{ textAlign: 'center', width: '50px' }}>Admin</th>
                  <th style={{ textAlign: 'center', width: '50px' }}>Doc</th>
                  <th style={{ textAlign: 'center', width: '50px' }}>Est</th>
                </tr>
              </thead>
              <tbody>
                {permissionsMatrix.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700' }}>{p.module}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.action}</td>
                    <td style={{ textAlign: 'center' }}>
                      <Check size={16} color="var(--color-success)" style={{ margin: '0 auto', display: 'block' }} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {p.docente ? (
                        <Check size={16} color="var(--color-success)" style={{ margin: '0 auto', display: 'block' }} />
                      ) : (
                        <X size={16} color="var(--color-danger)" style={{ margin: '0 auto', display: 'block' }} />
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {p.estudiante ? (
                        <Check size={16} color="var(--color-success)" style={{ margin: '0 auto', display: 'block' }} />
                      ) : (
                        <X size={16} color="var(--color-danger)" style={{ margin: '0 auto', display: 'block' }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
