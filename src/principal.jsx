import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Aplicacion from './Aplicacion.jsx';

// Punto de entrada de la aplicación React.
// Se inicializa el contenedor principal de la interfaz montando el componente 'Aplicacion'
// dentro del nodo HTML con el identificador 'root'.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Aplicacion />
  </StrictMode>,
);
