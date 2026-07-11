import React, { createContext, useContext, useState, useEffect } from 'react';

// Creación del contexto global para el tema de la aplicación (Modo Claro / Oscuro)
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Inicialización del estado del tema. 
  // Busca primero en el LocalStorage. Si no existe, detecta la preferencia del sistema operativo.
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('prre_theme');
    if (saved) return saved;
    
    // Configuración por defecto usando la preferencia de medios del navegador
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  // Efecto secundario que sincroniza el atributo 'data-theme' del elemento raíz HTML
  // cada vez que el tema cambia, lo cual modifica las variables CSS globales y lo guarda en LocalStorage.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('prre_theme', theme);
  }, [theme]);

  // Alterna el estado del tema entre 'light' (claro) y 'dark' (oscuro)
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para acceder rápidamente al contexto del tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};
