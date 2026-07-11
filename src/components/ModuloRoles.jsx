import React, { useState, useEffect } from 'react';
import { useAutenticacion } from '../context/ContextoAutenticacion';
import { getUsuarios, deleteUsuario } from '../utils/datosSimulados';
import { Shield, ShieldAlert, ShieldCheck, UserMinus, Check, X } from 'lucide-react';

/**
 * ModuloRoles
 * Componente que representa la consola de administración de usuarios,
 * permitiendo gestionar roles, activar/desactivar cuentas y visualizar
 * la matriz de permisos correspondiente de la U.E. Germán Busch B.
 */
export default function ModuloRoles() {
  const { usuarioActual, actualizarRolYEstadoUsuario } = useAutenticacion();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioIdEditando, setUsuarioIdEditando] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  
  // Estados temporales de edición
  const [rolTemporal, setRolTemporal] = useState('');
  const [estadoTemporal, setEstadoTemporal] = useState('');

  const cargarUsuarios = () => {
    setUsuarios(getUsuarios());
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const alHacerClicEditar = (usuario) => {
    setUsuarioIdEditando(usuario.id);
    setRolTemporal(usuario.rol);
    setEstadoTemporal(usuario.estado);
  };

  const alHacerClicGuardar = (usuarioId) => {
    actualizarRolYEstadoUsuario(usuarioId, rolTemporal, estadoTemporal);
    setUsuarioIdEditando(null);
    cargarUsuarios();
    
    // Notifica la actualización a otros componentes del sistema
    window.dispatchEvent(new Event('prre_db_update'));
  };

  const alHacerClicEliminar = (id) => {
    if (id === usuarioActual.id) {
      alert('No puedes eliminar tu propia cuenta administrativa.');
      return;
    }
    if (window.confirm('¿Está seguro de que desea eliminar permanentemente a este usuario?')) {
      deleteUsuario(id);
      cargarUsuarios();
      window.dispatchEvent(new Event('prre_db_update'));
    }
  };

  const obtenerIconoRol = (rol) => {
    switch (rol) {
      case 'Administrador': return <ShieldAlert size={16} style={{ color: 'var(--color-brand-gold)' }} />;
      case 'Docente': return <ShieldCheck size={16} style={{ color: 'var(--color-brand-cyan)' }} />;
      case 'Estudiante': return <Shield size={16} style={{ color: 'var(--text-muted)' }} />;
      default: return null;
    }
  };

  // Matriz de permisos del sistema PRRE
  const matrizPermisos = [
    { modulo: 'Recursos', operacion: 'Crear / Editar / Eliminar', admin: true, docente: false, estudiante: false },
    { modulo: 'Recursos', operacion: 'Visualizar Disponibilidad', admin: true, docente: true, estudiante: true },
    { modulo: 'Espacios', operacion: 'Crear / Editar / Eliminar', admin: true, docente: false, estudiante: false },
    { modulo: 'Espacios', operacion: 'Visualizar Disponibilidad', admin: true, docente: true, estudiante: true },
    { modulo: 'Reservas', operacion: 'Aprobar / Rechazar Solicitudes', admin: true, docente: false, estudiante: false },
    { modulo: 'Reservas', operacion: 'Solicitar Reservas', admin: true, docente: true, estudiante: true },
    { modulo: 'Reservas', operacion: 'Cancelar Propias Reservas', admin: true, docente: true, estudiante: true },
    { modulo: 'Historial', operacion: 'Ver Registro Completo (Global)', admin: true, docente: false, estudiante: false },
    { modulo: 'Historial', operacion: 'Ver Historial Propio', admin: true, docente: true, estudiante: true },
    { modulo: 'Roles y Permisos', operacion: 'Gestionar Usuarios y Cuentas', admin: true, docente: false, estudiante: false },
  ];

  const itemsPorPagina = 5;
  const totalPaginas = Math.ceil(usuarios.length / itemsPorPagina);
  const usuariosPaginados = usuarios.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  return (
    <div>
      <div className="grid-cols-2" style={{ gap: '2rem' }}>
        {/* Listado de Usuarios */}
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
                {usuariosPaginados.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '700' }}>{user.nombre}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                        {obtenerIconoRol(user.rol)}
                        {user.rol}
                      </span>
                    </td>
                    <td>
                      {usuarioIdEditando === user.id ? (
                        <select 
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                          value={estadoTemporal}
                          onChange={(e) => setEstadoTemporal(e.target.value)}
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
                      {usuarioIdEditando === user.id ? (
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <button 
                            onClick={() => alHacerClicGuardar(user.id)}
                            className="btn btn-primary"
                            style={{ padding: '0.375rem', borderRadius: '4px' }}
                            title="Guardar cambios"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => setUsuarioIdEditando(null)}
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
                            onClick={() => alHacerClicEditar(user)}
                            className="btn btn-secondary"
                            style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => alHacerClicEliminar(user.id)}
                            className="btn btn-secondary"
                            style={{ padding: '0.375rem' }}
                            disabled={user.id === usuarioActual.id}
                            title="Eliminar usuario"
                          >
                            <UserMinus size={14} style={{ color: user.id === usuarioActual.id ? 'var(--text-muted)' : 'var(--color-danger)' }} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
          </div>

          {/* Controles de Paginación */}
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button 
                disabled={paginaActual === 1} 
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
              >
                &larr; Ant.
              </button>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {paginaActual} / {totalPaginas}
              </span>
              <button 
                disabled={paginaActual === totalPaginas} 
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
              >
                Sig. &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Matriz de Permisos */}
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
                {matrizPermisos.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700' }}>{p.modulo}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.operacion}</td>
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
