import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsuarios, saveUsuario, initDB } from '../utils/mockData';

// Contexto global para administrar la autenticación y las sesiones del sistema PRRE
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializa la base de datos simulada y carga la sesión activa si existe
  useEffect(() => {
    initDB();
    const savedSession = localStorage.getItem('prre_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        // Recarga la información fresca del usuario desde el LocalStorage
        const users = getUsuarios();
        const freshUser = users.find(u => u.id === user.id);
        
        // Verifica que la cuenta continúe existiendo y esté en estado 'Activo'
        if (freshUser && freshUser.estado === 'Activo') {
          setCurrentUser(freshUser);
        } else {
          localStorage.removeItem('prre_session');
        }
      } catch (e) {
        console.error('Error al cargar la sesión activa', e);
        localStorage.removeItem('prre_session');
      }
    }
    setIsLoading(false);
  }, []);

  // Proceso de inicio de sesión con retardo simulado para simular red
  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsuarios();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      setIsLoading(false);
      throw new Error('El correo electrónico no está registrado.');
    }
    
    if (user.password !== password) {
      setIsLoading(false);
      throw new Error('La contraseña es incorrecta.');
    }
    
    if (user.estado !== 'Activo') {
      setIsLoading(false);
      throw new Error('Esta cuenta ha sido desactivada por el administrador.');
    }
    
    // Almacena la sesión en estado y LocalStorage
    setCurrentUser(user);
    localStorage.setItem('prre_session', JSON.stringify(user));
    setIsLoading(false);
    return user;
  };

  // Registro de nuevos usuarios institucionales (Docente o Estudiante)
  const register = async (nombre, email, password, rol) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const users = getUsuarios();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      setIsLoading(false);
      throw new Error('Este correo electrónico ya está registrado.');
    }

    const newUser = {
      nombre,
      email,
      password,
      rol: rol || 'Docente',
      estado: 'Activo'
    };

    // Guarda el registro en la base de datos simulada
    const saved = saveUsuario(newUser);
    setCurrentUser(saved);
    localStorage.setItem('prre_session', JSON.stringify(saved));
    setIsLoading(false);
    return saved;
  };

  // Cierre de sesión y limpieza de claves en LocalStorage
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('prre_session');
  };

  // Actualización de privilegios y estados por parte de la consola de administrador
  const updateUserRoleAndStatus = (userId, newRol, newEstado) => {
    const users = getUsuarios();
    const userIdx = users.findIndex(u => u.id === userId);
    if (userIdx !== -1) {
      users[userIdx].rol = newRol;
      users[userIdx].estado = newEstado;
      localStorage.setItem('prre_usuarios', JSON.stringify(users));
      
      // Si el usuario modificado es el que está actualmente en sesión, actualiza su token de sesión
      if (currentUser && currentUser.id === userId) {
        if (newEstado === 'Inactivo') {
          logout();
        } else {
          const updated = { ...currentUser, rol: newRol };
          setCurrentUser(updated);
          localStorage.setItem('prre_session', JSON.stringify(updated));
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, isLoading, login, register, logout, updateUserRoleAndStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook de acceso directo para el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
