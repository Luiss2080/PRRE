// Mock Database for PRRE using LocalStorage

const KEY_RECURSOS = 'prre_recursos';
const KEY_ESPACIOS = 'prre_espacios';
const KEY_RESERVAS = 'prre_reservas';
const KEY_USUARIOS = 'prre_usuarios';

// Initial Mock Data
const INITIAL_RECURSOS = [
  { id: 'rec_1', nombre: 'Proyector Epson PowerLite', tipo: 'Dispositivo', cantidadTotal: 5, cantidadDisponible: 5, estado: 'Excelente', descripcion: 'Proyector multimedia con entrada HDMI y control remoto.' },
  { id: 'rec_2', nombre: 'Laptop HP ProBook 440', tipo: 'Dispositivo', cantidadTotal: 20, cantidadDisponible: 20, estado: 'Excelente', descripcion: 'Laptops para clases prácticas, Intel Core i5, 8GB RAM.' },
  { id: 'rec_3', nombre: 'Tablet Lenovo K10', tipo: 'Dispositivo', cantidadTotal: 15, cantidadDisponible: 15, estado: 'Bueno', descripcion: 'Tabletas para lectura y cuestionarios dinámicos.' },
  { id: 'rec_4', nombre: 'Enciclopedia de Física Cuántica', tipo: 'Libro', cantidadTotal: 3, cantidadDisponible: 3, estado: 'Bueno', descripcion: 'Material bibliográfico avanzado para consultas científicas.' },
  { id: 'rec_5', nombre: 'Kit de Robótica Arduino Starter', tipo: 'Material', cantidadTotal: 8, cantidadDisponible: 8, estado: 'Excelente', descripcion: 'Kits completos con sensores, cables y microcontrolador Uno.' }
];

const INITIAL_ESPACIOS = [
  { id: 'esp_1', nombre: 'Laboratorio de Computación A', capacidad: 25, ubicacion: 'Bloque Central - 2do Piso', tipo: 'Físico', estado: 'Disponible', descripcion: 'Equipado con 25 computadoras de escritorio, aire acondicionado y pizarra acrílica.' },
  { id: 'esp_2', nombre: 'Auditorio Germán Busch B', capacidad: 120, ubicacion: 'Planta Baja - Ala Este', tipo: 'Físico', estado: 'Disponible', descripcion: 'Espacio amplio para conferencias, exposiciones teatrales y eventos académicos.' },
  { id: 'esp_3', nombre: 'Laboratorio de Física y Química', capacidad: 20, ubicacion: 'Bloque Norte - 1er Piso', tipo: 'Físico', estado: 'Disponible', descripcion: 'Cuenta con mecheros, microscopios, campana extractora y material de vidrio.' },
  { id: 'esp_4', nombre: 'Biblioteca Virtual Epdb', capacidad: 50, ubicacion: 'Bloque Oeste - 1er Piso', tipo: 'Virtual', estado: 'Disponible', descripcion: 'Plataforma y espacio físico con acceso a bases de datos académicas.' }
];

const INITIAL_USUARIOS = [
  { id: 'user_1', nombre: 'Prof. Luis Sanders', email: 'admin@colegio.edu.bo', rol: 'Administrador', estado: 'Activo', password: 'admin' },
  { id: 'user_2', nombre: 'Profa. María Delgado', email: 'docente@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_3', nombre: 'Est. Alejandro Vargas', email: 'estudiante@colegio.edu.bo', rol: 'Estudiante', estado: 'Activo', password: 'user123' }
];

const INITIAL_RESERVAS = [
  {
    id: 'res_1',
    tipoRecurso: 'recurso',
    itemId: 'rec_1',
    itemName: 'Proyector Epson PowerLite',
    usuarioId: 'user_2',
    usuarioNombre: 'Profa. María Delgado',
    fechaInicio: '2026-07-12',
    fechaFin: '2026-07-12',
    horaInicio: '08:00',
    horaFin: '09:30',
    cantidad: 1,
    motivo: 'Clase de Ciencias Naturales sobre el sistema solar',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-10 10:15'
  },
  {
    id: 'res_2',
    tipoRecurso: 'espacio',
    itemId: 'esp_1',
    itemName: 'Laboratorio de Computación A',
    usuarioId: 'user_2',
    usuarioNombre: 'Profa. María Delgado',
    fechaInicio: '2026-07-13',
    fechaFin: '2026-07-13',
    horaInicio: '10:00',
    horaFin: '11:30',
    cantidad: 1,
    motivo: 'Evaluación práctica de programación en HTML',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-10 14:30'
  },
  {
    id: 'res_3',
    tipoRecurso: 'recurso',
    itemId: 'rec_2',
    itemName: 'Laptop HP ProBook 440',
    usuarioId: 'user_3',
    usuarioNombre: 'Est. Alejandro Vargas',
    fechaInicio: '2026-07-09',
    fechaFin: '2026-07-09',
    horaInicio: '14:00',
    horaFin: '16:00',
    cantidad: 1,
    motivo: 'Proyecto grupal de investigación histórica',
    estado: 'Finalizada',
    fechaCreacion: '2026-07-08 11:00'
  }
];

export const initDB = () => {
  if (!localStorage.getItem(KEY_RECURSOS)) {
    localStorage.setItem(KEY_RECURSOS, JSON.stringify(INITIAL_RECURSOS));
  }
  if (!localStorage.getItem(KEY_ESPACIOS)) {
    localStorage.setItem(KEY_ESPACIOS, JSON.stringify(INITIAL_ESPACIOS));
  }
  if (!localStorage.getItem(KEY_RESERVAS)) {
    localStorage.setItem(KEY_RESERVAS, JSON.stringify(INITIAL_RESERVAS));
  }
  if (!localStorage.getItem(KEY_USUARIOS)) {
    localStorage.setItem(KEY_USUARIOS, JSON.stringify(INITIAL_USUARIOS));
  }
};

// Generic helper methods
const getItems = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveItems = (key, items) => localStorage.setItem(key, JSON.stringify(items));

// RECURSOS CRUD
export const getRecursos = () => getItems(KEY_RECURSOS);
export const saveRecurso = (recurso) => {
  const recursos = getRecursos();
  if (recurso.id) {
    const idx = recursos.findIndex(r => r.id === recurso.id);
    if (idx !== -1) {
      recursos[idx] = recurso;
    }
  } else {
    recurso.id = 'rec_' + Date.now();
    recursos.push(recurso);
  }
  saveItems(KEY_RECURSOS, recursos);
  return recurso;
};
export const deleteRecurso = (id) => {
  const recursos = getRecursos().filter(r => r.id !== id);
  saveItems(KEY_RECURSOS, recursos);
};

// ESPACIOS CRUD
export const getEspacios = () => getItems(KEY_ESPACIOS);
export const saveSpace = (espacio) => {
  const espacios = getEspacios();
  if (espacio.id) {
    const idx = espacios.findIndex(e => e.id === espacio.id);
    if (idx !== -1) {
      espacios[idx] = espacio;
    }
  } else {
    espacio.id = 'esp_' + Date.now();
    espacios.push(espacio);
  }
  saveItems(KEY_ESPACIOS, espacios);
  return espacio;
};
export const deleteSpace = (id) => {
  const espacios = getEspacios().filter(e => e.id !== id);
  saveItems(KEY_ESPACIOS, espacios);
};

// USUARIOS CRUD
export const getUsuarios = () => getItems(KEY_USUARIOS);
export const saveUsuario = (usuario) => {
  const usuarios = getUsuarios();
  if (usuario.id) {
    const idx = usuarios.findIndex(u => u.id === usuario.id);
    if (idx !== -1) {
      usuarios[idx] = usuario;
    }
  } else {
    usuario.id = 'user_' + Date.now();
    usuario.estado = 'Activo';
    usuarios.push(usuario);
  }
  saveItems(KEY_USUARIOS, usuarios);
  return usuario;
};
export const deleteUsuario = (id) => {
  const usuarios = getUsuarios().filter(u => u.id !== id);
  saveItems(KEY_USUARIOS, usuarios);
};

// RESERVAS CRUD & Logic
export const getReservas = () => getItems(KEY_RESERVAS);
export const saveReservation = (reserva) => {
  const reservas = getReservas();
  const recursos = getRecursos();
  const espacios = getEspacios();

  if (reserva.id) {
    const idx = reservas.findIndex(r => r.id === reserva.id);
    if (idx !== -1) {
      const oldReserva = reservas[idx];
      // If status is changing to "Aprobada" or "Finalizada" and was pending, adjust resource availability
      if (reserva.estado === 'Aprobada' && oldReserva.estado !== 'Aprobada' && reserva.tipoRecurso === 'recurso') {
        const recIdx = recursos.findIndex(r => r.id === reserva.itemId);
        if (recIdx !== -1) {
          recursos[recIdx].cantidadDisponible = Math.max(0, recursos[recIdx].cantidadDisponible - reserva.cantidad);
          saveItems(KEY_RECURSOS, recursos);
        }
      }
      // If status is changing to "Cancelada" or "Rechazada" or "Finalizada" and was approved, restore stock
      if ((reserva.estado === 'Cancelada' || reserva.estado === 'Rechazada' || reserva.estado === 'Finalizada') && 
          oldReserva.estado === 'Aprobada' && reserva.tipoRecurso === 'recurso') {
        const recIdx = recursos.findIndex(r => r.id === reserva.itemId);
        if (recIdx !== -1) {
          recursos[recIdx].cantidadDisponible = Math.min(recursos[recIdx].cantidadTotal, recursos[recIdx].cantidadDisponible + reserva.cantidad);
          saveItems(KEY_RECURSOS, recursos);
        }
      }
      
      // Update space status if applicable
      if (reserva.tipoRecurso === 'espacio') {
        const espIdx = espacios.findIndex(e => e.id === reserva.itemId);
        if (espIdx !== -1) {
          if (reserva.estado === 'Aprobada') {
            espacios[espIdx].estado = 'Ocupado';
          } else if (reserva.estado === 'Finalizada' || reserva.estado === 'Cancelada' || reserva.estado === 'Rechazada') {
            espacios[espIdx].estado = 'Disponible';
          }
          saveItems(KEY_ESPACIOS, espacios);
        }
      }

      reservas[idx] = reserva;
    }
  } else {
    // Creating a new reservation
    reserva.id = 'res_' + Date.now();
    reserva.fechaCreacion = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    // Set item name cache
    if (reserva.tipoRecurso === 'recurso') {
      const item = recursos.find(r => r.id === reserva.itemId);
      reserva.itemName = item ? item.nombre : 'Recurso Desconocido';
    } else {
      const item = espacios.find(e => e.id === reserva.itemId);
      reserva.itemName = item ? item.nombre : 'Espacio Desconocido';
    }

    // Default status: Docentes/Estudiantes start as "Pendiente". Admin starts as "Aprobada" immediately.
    if (reserva.estado === 'Aprobada') {
      if (reserva.tipoRecurso === 'recurso') {
        const recIdx = recursos.findIndex(r => r.id === reserva.itemId);
        if (recIdx !== -1) {
          recursos[recIdx].cantidadDisponible = Math.max(0, recursos[recIdx].cantidadDisponible - reserva.cantidad);
          saveItems(KEY_RECURSOS, recursos);
        }
      } else {
        const espIdx = espacios.findIndex(e => e.id === reserva.itemId);
        if (espIdx !== -1) {
          espacios[espIdx].estado = 'Ocupado';
          saveItems(KEY_ESPACIOS, espacios);
        }
      }
    }

    reservas.push(reserva);
  }
  saveItems(KEY_RESERVAS, reservas);
  return reserva;
};

export const deleteReservation = (id) => {
  const reservas = getReservas();
  const resIdx = reservas.findIndex(r => r.id === id);
  if (resIdx !== -1) {
    const reserva = reservas[resIdx];
    if (reserva.estado === 'Aprobada') {
      if (reserva.tipoRecurso === 'recurso') {
        const recursos = getRecursos();
        const recIdx = recursos.findIndex(r => r.id === reserva.itemId);
        if (recIdx !== -1) {
          recursos[recIdx].cantidadDisponible = Math.min(recursos[recIdx].cantidadTotal, recursos[recIdx].cantidadDisponible + reserva.cantidad);
          saveItems(KEY_RECURSOS, recursos);
        }
      } else if (reserva.tipoRecurso === 'espacio') {
        const espacios = getEspacios();
        const espIdx = espacios.findIndex(e => e.id === reserva.itemId);
        if (espIdx !== -1) {
          espacios[espIdx].estado = 'Disponible';
          saveItems(KEY_ESPACIOS, espacios);
        }
      }
    }
    const filtered = reservas.filter(r => r.id !== id);
    saveItems(KEY_RESERVAS, filtered);
  }
};
