import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsuarios, saveUsuario, inicializarBD } from '../utils/datosSimulados';

// Contexto global para administrar la autenticación y las sesiones del sistema PRRE
const ContextoAutenticacion = createContext();

/**
 * ProveedorAutenticacion
 * Componente que provee el estado del usuario autenticado, estado de carga,
 * y funciones de inicio de sesión, registro, cierre de sesión y actualización de perfiles.
 */
export const ProveedorAutenticacion = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Inicializa la base de datos simulada y carga la sesión activa si existe
  useEffect(() => {
    inicializarBD();
    const sesionGuardada = localStorage.getItem('prre_session');
    if (sesionGuardada) {
      try {
        const usuario = JSON.parse(sesionGuardada);
        // Recarga la información fresca del usuario desde el LocalStorage
        const usuarios = getUsuarios();
        const usuarioFresco = usuarios.find(u => u.id === usuario.id);
        
        // Verifica que la cuenta continúe existiendo y esté en estado 'Activo'
        if (usuarioFresco && usuarioFresco.estado === 'Activo') {
          setUsuarioActual(usuarioFresco);
        } else {
          localStorage.removeItem('prre_session');
        }
      } catch (e) {
        console.error('Error al cargar la sesión activa', e);
        localStorage.removeItem('prre_session');
      }
    }
    setCargando(false);
  }, []);

  // Proceso de inicio de sesión con retardo simulado para simular red
  const iniciarSesion = async (email, password) => {
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!usuario) {
      setCargando(false);
      throw new Error('El correo electrónico no está registrado.');
    }
    
    if (usuario.password !== password) {
      setCargando(false);
      throw new Error('La contraseña es incorrecta.');
    }
    
    if (usuario.estado !== 'Activo') {
      setCargando(false);
      throw new Error('Esta cuenta ha sido desactivada por el administrador.');
    }
    
    // Almacena la sesión en estado y LocalStorage
    setUsuarioActual(usuario);
    localStorage.setItem('prre_session', JSON.stringify(usuario));
    setCargando(false);
    return usuario;
  };

  // Registro de nuevos usuarios institucionales (Docente o Estudiante)
  const registrar = async (nombre, email, password, _rol) => {
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const usuarios = getUsuarios();
    const existe = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existe) {
      setCargando(false);
      throw new Error('Este correo electrónico ya está registrado.');
    }

    const nuevoUsuario = {
      nombre,
      email,
      password,
      rol: 'Docente',
      estado: 'Activo'
    };

    // Guarda el registro en la base de datos simulada
    const guardado = saveUsuario(nuevoUsuario);
    setUsuarioActual(guardado);
    localStorage.setItem('prre_session', JSON.stringify(guardado));
    setCargando(false);
    return guardado;
  };

  // Cierre de sesión y limpieza de claves en LocalStorage
  const cerrarSesion = () => {
    setUsuarioActual(null);
    localStorage.removeItem('prre_session');
  };

  // Actualización de privilegios y estados por parte de la consola de administrador
  const actualizarRolYEstadoUsuario = (usuarioId, nuevoRol, nuevoEstado) => {
    const usuarios = getUsuarios();
    const indiceUsuario = usuarios.findIndex(u => u.id === usuarioId);
    if (indiceUsuario !== -1) {
      usuarios[indiceUsuario].rol = nuevoRol;
      usuarios[indiceUsuario].estado = nuevoEstado;
      localStorage.setItem('prre_usuarios', JSON.stringify(usuarios));
      
      // Si el usuario modificado es el que está actualmente en sesión, actualiza su token de sesión
      if (usuarioActual && usuarioActual.id === usuarioId) {
        if (nuevoEstado === 'Inactivo') {
          cerrarSesion();
        } else {
          const actualizado = { ...usuarioActual, rol: nuevoRol };
          setUsuarioActual(actualizado);
          localStorage.setItem('prre_session', JSON.stringify(actualizado));
        }
      }
    }
  const actualizarUsuario = (usuarioModificado) => {
    const usuarios = getUsuarios();
    const indice = usuarios.findIndex(u => u.id === usuarioModificado.id);
    if (indice !== -1) {
      const usuarioActualizado = { ...usuarios[indice], ...usuarioModificado };
      usuarios[indice] = usuarioActualizado;
      localStorage.setItem('prre_usuarios', JSON.stringify(usuarios));
      
      if (usuarioActual && usuarioActual.id === usuarioModificado.id) {
        setUsuarioActual(usuarioActualizado);
        localStorage.setItem('prre_session', JSON.stringify(usuarioActualizado));
      }
    }
  };

  return (
    <ContextoAutenticacion.Provider value={{ 
      usuarioActual, 
      estaAutenticado: !!usuarioActual, 
      cargando, 
      iniciarSesion, 
      registrar, 
      cerrarSesion, 
      actualizarRolYEstadoUsuario,
      actualizarUsuario
    }}>
      {children}
    </ContextoAutenticacion.Provider>
  );
};

/**
 * useAutenticacion
 * Hook de acceso directo para el contexto de autenticación.
 */
export const useAutenticacion = () => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error('useAutenticacion debe usarse dentro de un ProveedorAutenticacion');
  }
  return contexto;
};
