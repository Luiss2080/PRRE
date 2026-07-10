import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsuarios, saveUsuario, initDB } from '../utils/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize DB and load active session on mount
  useEffect(() => {
    initDB();
    const savedSession = localStorage.getItem('prre_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        // Refresh user data from DB in case role/status changed
        const users = getUsuarios();
        const freshUser = users.find(u => u.id === user.id);
        if (freshUser && freshUser.estado === 'Activo') {
          setCurrentUser(freshUser);
        } else {
          localStorage.removeItem('prre_session');
        }
      } catch (e) {
        console.error('Error al cargar la sesión', e);
        localStorage.removeItem('prre_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    // Add a tiny artificial delay for realism
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
    
    setCurrentUser(user);
    localStorage.setItem('prre_session', JSON.stringify(user));
    setIsLoading(false);
    return user;
  };

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
      rol: rol || 'Docente', // Default to Docente if not selected
      estado: 'Activo'
    };

    const saved = saveUsuario(newUser);
    setCurrentUser(saved);
    localStorage.setItem('prre_session', JSON.stringify(saved));
    setIsLoading(false);
    return saved;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('prre_session');
  };

  const updateUserRoleAndStatus = (userId, newRol, newEstado) => {
    const users = getUsuarios();
    const userIdx = users.findIndex(u => u.id === userId);
    if (userIdx !== -1) {
      users[userIdx].rol = newRol;
      users[userIdx].estado = newEstado;
      localStorage.setItem('prre_usuarios', JSON.stringify(users));
      
      // If the modified user is currently logged in, update their session
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
