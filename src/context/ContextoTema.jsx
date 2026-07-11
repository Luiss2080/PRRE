import React, { createContext, useContext, useState, useEffect } from 'react';

// Creación del contexto global para el tema de la aplicación (Modo Claro / Oscuro)
const ContextoTema = createContext();

/**
 * ProveedorTema
 * Componente proveedor que envuelve la aplicación para proveer el estado del tema
 * y la función para alternar entre los modos claro y oscuro.
 */
export const ProveedorTema = ({ children }) => {
  // Inicialización del estado del tema. 
  // Busca primero en el LocalStorage. Si no existe, detecta la preferencia del sistema operativo.
  const [tema, setTema] = useState(() => {
    const guardado = localStorage.getItem('prre_theme');
    if (guardado) return guardado;
    
    // Configuración por defecto usando la preferencia de medios del navegador
    const sistemaPrefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return sistemaPrefiereOscuro ? 'dark' : 'light';
  });

  // Efecto secundario que sincroniza el atributo 'data-theme' del elemento raíz HTML
  // cada vez que el tema cambia, lo cual modifica las variables CSS globales y lo guarda en LocalStorage.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('prre_theme', tema);
  }, [tema]);

  // Alterna el estado del tema entre 'light' (claro) y 'dark' (oscuro)
  const alternarTema = () => {
    setTema(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ContextoTema.Provider value={{ tema, alternarTema, esOscuro: tema === 'dark' }}>
      {children}
    </ContextoTema.Provider>
  );
};

/**
 * useTema
 * Hook personalizado para acceder rápidamente al contexto del tema visual de la aplicación.
 * Lanza un error si se utiliza fuera del ProveedorTema.
 */
export const useTema = () => {
  const contexto = useContext(ContextoTema);
  if (!contexto) {
    throw new Error('useTema debe usarse dentro de un ProveedorTema');
  }
  return contexto;
};
