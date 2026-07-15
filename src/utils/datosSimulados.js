// Base de datos simulada (Mock DB) para el portal PRRE utilizando LocalStorage
// Todos los comentarios y nombres de funciones están en español para mayor claridad y mantenimiento.

const CLAVE_RECURSOS = 'prre_recursos';
const CLAVE_ESPACIOS = 'prre_espacios';
const CLAVE_RESERVAS = 'prre_reservas';
const CLAVE_USUARIOS = 'prre_usuarios';

// Datos iniciales por defecto para el sistema en su primer inicio
const RECURSOS_INICIALES = [
  { id: 'rec_1', nombre: 'Proyector Epson PowerLite', tipo: 'Dispositivo', cantidadTotal: 5, cantidadDisponible: 5, estado: 'Excelente', descripcion: 'Proyector multimedia con entrada HDMI y control remoto.' },
  { id: 'rec_2', nombre: 'Laptop HP ProBook 440', tipo: 'Dispositivo', cantidadTotal: 25, cantidadDisponible: 25, estado: 'Excelente', descripcion: 'Laptops para clases prácticas, Intel Core i5, 8GB RAM.' },
  { id: 'rec_3', nombre: 'Tablet Lenovo K10', tipo: 'Dispositivo', cantidadTotal: 15, cantidadDisponible: 15, estado: 'Bueno', descripcion: 'Tabletas para lectura y cuestionarios dinámicos.' },
  { id: 'rec_4', nombre: 'Enciclopedia de Física Cuántica', tipo: 'Libro', cantidadTotal: 5, cantidadDisponible: 5, estado: 'Bueno', descripcion: 'Material bibliográfico avanzado para consultas científicas.' },
  { id: 'rec_5', nombre: 'Kit de Robótica Arduino Starter', tipo: 'Material', cantidadTotal: 10, cantidadDisponible: 10, estado: 'Excelente', descripcion: 'Kits completos con sensores, cables y microcontrolador Uno.' },
  { id: 'rec_6', nombre: 'Microscopio Óptico Binocular', tipo: 'Dispositivo', cantidadTotal: 8, cantidadDisponible: 8, estado: 'Excelente', descripcion: 'Microscopios de alta resolución para laboratorio de biología.' },
  { id: 'rec_7', nombre: 'Kit de Sensores Vernier (Química)', tipo: 'Material', cantidadTotal: 6, cantidadDisponible: 6, estado: 'Bueno', descripcion: 'Sensores de pH, temperatura y conductividad para experimentos.' },
  { id: 'rec_8', nombre: 'Casco de Realidad Virtual Meta Quest 2', tipo: 'Dispositivo', cantidadTotal: 4, cantidadDisponible: 4, estado: 'Excelente', descripcion: 'Gafas VR para simulaciones interactivas e historia inmersiva.' },
  { id: 'rec_9', nombre: 'Diccionario Enciclopédico de Química', tipo: 'Libro', cantidadTotal: 6, cantidadDisponible: 6, estado: 'Bueno', descripcion: 'Libro de referencia esencial para nomenclatura y reacciones químicas.' },
  { id: 'rec_10', nombre: 'Maqueta del Torso Humano Desarmable', tipo: 'Material', cantidadTotal: 2, cantidadDisponible: 2, estado: 'Bueno', descripcion: 'Modelo anatómico con órganos removibles para clases de biología.' },
  { id: 'rec_11', nombre: 'Kit de Experimento Eléctrico Básico', tipo: 'Material', cantidadTotal: 12, cantidadDisponible: 12, estado: 'Excelente', descripcion: 'Kits para armar circuitos eléctricos en serie y paralelo.' },
  { id: 'rec_12', nombre: 'Calculadora Científica Casio', tipo: 'Dispositivo', cantidadTotal: 30, cantidadDisponible: 30, estado: 'Bueno', descripcion: 'Calculadoras para exámenes de matemáticas y física.' },
  { id: 'rec_13', nombre: 'Laptop Dell Latitude 3420', tipo: 'Dispositivo', cantidadTotal: 15, cantidadDisponible: 15, estado: 'Excelente', descripcion: 'Laptops de última generación para diseño y simulaciones.' },
  { id: 'rec_14', nombre: 'Tablet Samsung Galaxy Tab A8', tipo: 'Dispositivo', cantidadTotal: 20, cantidadDisponible: 20, estado: 'Excelente', descripcion: 'Tabletas ligeras con pantalla HD de 10.5 pulgadas.' },
  { id: 'rec_15', nombre: 'Kit de Anatomía Ósea Completa', tipo: 'Material', cantidadTotal: 3, cantidadDisponible: 3, estado: 'Bueno', descripcion: 'Esqueleto humano articulado y desmontable para clases de ciencias.' },
  { id: 'rec_16', nombre: 'Libro de Álgebra Lineal de Grossman', tipo: 'Libro', cantidadTotal: 8, cantidadDisponible: 8, estado: 'Excelente', descripcion: 'Libros oficiales para el área de matemáticas avanzadas.' },
  { id: 'rec_17', nombre: 'Kit de Termodinámica y Calor', tipo: 'Material', cantidadTotal: 5, cantidadDisponible: 5, estado: 'Bueno', descripcion: 'Equipos y sensores calorimétricos para experimentos térmicos.' },
  { id: 'rec_18', nombre: 'Proyector Optoma UHD 4K', tipo: 'Dispositivo', cantidadTotal: 2, cantidadDisponible: 2, estado: 'Excelente', descripcion: 'Proyector de alta gama para salón de actos y proyecciones amplias.' },
  { id: 'rec_19', nombre: 'Libro de Química General de Chang', tipo: 'Libro', cantidadTotal: 10, cantidadDisponible: 10, estado: 'Excelente', descripcion: 'Manuales académicos de química general e inorgánica.' },
  { id: 'rec_20', nombre: 'Juego de Cristalería de Laboratorio', tipo: 'Material', cantidadTotal: 4, cantidadDisponible: 4, estado: 'Excelente', descripcion: 'Kits de probetas, matraces, vasos de precipitados y tubos de ensayo.' }
];

const ESPACIOS_INICIALES = [
  { id: 'esp_1', nombre: 'Laboratorio de Computación A', capacidad: 25, ubicacion: 'Bloque Central - 2do Piso', tipo: 'Físico', estado: 'Disponible', descripcion: 'Equipado con 25 computadoras de escritorio, aire acondicionado y pizarra acrílica.' },
  { id: 'esp_2', nombre: 'Auditorio Germán Busch B', capacidad: 120, ubicacion: 'Planta Baja - Ala Este', tipo: 'Físico', estado: 'Disponible', descripcion: 'Espacio amplio para conferencias, exposiciones teatrales y eventos académicos.' },
  { id: 'esp_3', nombre: 'Laboratorio de Física y Química', capacidad: 20, ubicacion: 'Bloque Norte - 1er Piso', tipo: 'Físico', estado: 'Disponible', descripcion: 'Cuenta con mecheros, microscopios, campana extractora y material de vidrio.' },
  { id: 'esp_4', nombre: 'Biblioteca Virtual Epdb', capacidad: 50, ubicacion: 'Bloque Oeste - 1er Piso', tipo: 'Virtual', estado: 'Disponible', descripcion: 'Plataforma y espacio físico con acceso a bases de datos académicas.' },
  { id: 'esp_5', nombre: 'Aula de Audiovisuales & Cine', capacidad: 40, ubicacion: 'Bloque Sur - Planta Baja', tipo: 'Físico', estado: 'Disponible', descripcion: 'Equipado con Smart TV de 75", sistema de sonido envolvente y cortinas blackout.' },
  { id: 'esp_6', nombre: 'Laboratorio de Robótica y Electrónica', capacidad: 15, ubicacion: 'Bloque Central - 3er Piso', tipo: 'Físico', estado: 'Disponible', descripcion: 'Laboratorio con osciloscopios, estaciones de soldadura y kits Arduino.' },
  { id: 'esp_7', nombre: 'Taller de Arte y Modelado', capacidad: 30, ubicacion: 'Bloque Sur - 2do Piso', tipo: 'Físico', estado: 'Disponible', descripcion: 'Espacio iluminado con caballetes, piletas de lavado y mesas de madera amplias.' },
  { id: 'esp_8', nombre: 'Gimnasio Techado & Polideportivo', capacidad: 300, ubicacion: 'Bloque Norte - Exterior', tipo: 'Físico', estado: 'Disponible', descripcion: 'Cancha cubierta con gradas, tableros de básquetbol y arcos de futsal.' },
  { id: 'esp_9', nombre: 'Laboratorio de Biología Celular', capacidad: 25, ubicacion: 'Bloque Norte - 2do Piso', tipo: 'Físico', estado: 'Disponible', descripcion: 'Espacio equipado para análisis microbiológico e histológico.' },
  { id: 'esp_10', nombre: 'Auditorio Nivel Primaria', capacidad: 80, ubicacion: 'Bloque Sur - Planta Alta', tipo: 'Físico', estado: 'Disponible', descripcion: 'Teatro pequeño idóneo para títeres, obras escolares y reuniones.' },
  { id: 'esp_11', nombre: 'Sala de Consejo de Docentes', capacidad: 20, ubicacion: 'Bloque Central - 1er Piso', tipo: 'Físico', estado: 'Disponible', descripcion: 'Mesa de directorio, proyector fijo y cafetera para juntas de personal.' },
  { id: 'esp_12', nombre: 'Aula Virtual Google Meet A', capacidad: 250, ubicacion: 'Servidor Virtual U.E.', tipo: 'Virtual', estado: 'Disponible', descripcion: 'Cuenta premium institucional para seminarios web y clases a distancia.' },
  { id: 'esp_13', nombre: 'Aula Virtual Zoom Pro B', capacidad: 100, ubicacion: 'Servidor Virtual U.E.', tipo: 'Virtual', estado: 'Disponible', descripcion: 'Enlace exclusivo para tutorías grupales y defensas de grado.' },
  { id: 'esp_14', nombre: 'Laboratorio de Ciencias Mecánicas', capacidad: 18, ubicacion: 'Bloque Norte - Sótano', tipo: 'Físico', estado: 'Disponible', descripcion: 'Equipado con rieles, poleas y sensores Vernier para física elemental.' },
  { id: 'esp_15', nombre: 'Biblioteca Histórica Física', capacidad: 45, ubicacion: 'Bloque Oeste - Planta Alta', tipo: 'Físico', estado: 'Disponible', descripcion: 'Estanterías con archivos históricos, enciclopedias y mesas de estudio silencioso.' }
];

const USUARIOS_INICIALES = [
  { id: 'user_1', nombre: 'Prof. Luis Sanders', email: 'admin@colegio.edu.bo', rol: 'Administrador', estado: 'Activo', password: 'admin' },
  { id: 'user_2', nombre: 'Profa. María Delgado', email: 'docente@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_3', nombre: 'Est. Alejandro Vargas', email: 'estudiante@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_4', fontName: 'Prof. Carlos Choque', nombre: 'Prof. Carlos Choque', email: 'carlos@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_5', nombre: 'Profa. Ana Mendoza', email: 'ana@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_6', nombre: 'Profa. Carmen Ortiz', email: 'carmen@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_7', nombre: 'Prof. Roberto Gómez', email: 'roberto@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_8', nombre: 'Profa. Julia Quispe', email: 'julia@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_9', nombre: 'Prof. Ramiro Beltrán', email: 'ramiro@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_10', nombre: 'Profa. Sandra Flores', email: 'sandra@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_11', nombre: 'Prof. Fernando Loza', email: 'fernando@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_12', nombre: 'Profa. Gabriela Silva', email: 'gabriela@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_13', nombre: 'Prof. Hugo Vásquez', email: 'hugo@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_14', nombre: 'Profa. Patricia Rojas', email: 'patricia@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' },
  { id: 'user_15', nombre: 'Prof. Ricardo Aliaga', email: 'ricardo@colegio.edu.bo', rol: 'Docente', estado: 'Activo', password: 'user123' }
];

const RESERVAS_INICIALES = [
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
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-15',
    horaInicio: '10:00',
    horaFin: '11:30',
    cantidad: 1,
    motivo: 'Proyecto grupal de investigación histórica',
    estado: 'Finalizada',
    fechaCreacion: '2026-07-08 11:00'
  },
  {
    id: 'res_3',
    tipoRecurso: 'recurso',
    itemId: 'rec_2',
    itemName: 'Laptop HP ProBook 440',
    usuarioId: 'user_3',
    usuarioNombre: 'Est. Alejandro Vargas',
    fechaInicio: '2026-07-14',
    fechaFin: '2026-07-14',
    horaInicio: '14:00',
    horaFin: '16:00',
    cantidad: 10,
    motivo: 'Desarrollo de examen práctico de programación básica',
    estado: 'Finalizada',
    fechaCreacion: '2026-07-09 15:30'
  },
  {
    id: 'res_4',
    tipoRecurso: 'recurso',
    itemId: 'rec_5',
    itemName: 'Kit de Robótica Arduino Starter',
    usuarioId: 'user_4',
    usuarioNombre: 'Prof. Carlos Choque',
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-15',
    horaInicio: '11:00',
    horaFin: '13:00',
    cantidad: 5,
    motivo: 'Práctica de armado de sensores ultrasónicos con alumnos de 5to de secundaria',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-11 09:20'
  },
  {
    id: 'res_5',
    tipoRecurso: 'espacio',
    itemId: 'esp_3',
    itemName: 'Laboratorio de Física y Química',
    usuarioId: 'user_5',
    usuarioNombre: 'Profa. Ana Mendoza',
    fechaInicio: '2026-07-16',
    fechaFin: '2026-07-16',
    horaInicio: '09:00',
    horaFin: '11:00',
    cantidad: 1,
    motivo: 'Demostración de reacciones de precipitación química',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-13 14:15'
  },
  {
    id: 'res_6',
    tipoRecurso: 'recurso',
    itemId: 'rec_8',
    itemName: 'Casco de Realidad Virtual Meta Quest 2',
    usuarioId: 'user_2',
    usuarioNombre: 'Profa. María Delgado',
    fechaInicio: '2026-07-17',
    fechaFin: '2026-07-17',
    horaInicio: '15:00',
    horaFin: '17:00',
    cantidad: 2,
    motivo: 'Viaje virtual interactivo a las ruinas de Pompeya',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-13 11:30'
  },
  {
    id: 'res_7',
    tipoRecurso: 'espacio',
    itemId: 'esp_5',
    itemName: 'Aula de Audiovisuales & Cine',
    usuarioId: 'user_4',
    usuarioNombre: 'Prof. Carlos Choque',
    fechaInicio: '2026-07-16',
    fechaFin: '2026-07-16',
    horaInicio: '14:00',
    horaFin: '15:00',
    cantidad: 1,
    motivo: 'Proyección del documental sobre la Revolución Industrial',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-14 08:00'
  },
  {
    id: 'res_8',
    tipoRecurso: 'recurso',
    itemId: 'rec_2',
    itemName: 'Laptop HP ProBook 440',
    usuarioId: 'user_5',
    usuarioNombre: 'Profa. Ana Mendoza',
    fechaInicio: '2026-07-18',
    fechaFin: '2026-07-18',
    horaInicio: '10:00',
    horaFin: '12:00',
    cantidad: 15,
    motivo: 'Taller de Excel básico para cálculo de estadísticas escolares',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-14 16:45'
  },
  {
    id: 'res_9',
    tipoRecurso: 'recurso',
    itemId: 'rec_1',
    itemName: 'Proyector Epson PowerLite',
    usuarioId: 'user_5',
    usuarioNombre: 'Profa. Ana Mendoza',
    fechaInicio: '2026-07-13',
    fechaFin: '2026-07-13',
    horaInicio: '08:00',
    horaFin: '10:00',
    cantidad: 1,
    motivo: 'Exposiciones finales de proyectos estudiantiles',
    estado: 'Finalizada',
    fechaCreacion: '2026-07-10 17:00'
  },
  {
    id: 'res_10',
    tipoRecurso: 'recurso',
    itemId: 'rec_3',
    itemName: 'Tablet Lenovo K10',
    usuarioId: 'user_2',
    usuarioNombre: 'Profa. María Delgado',
    fechaInicio: '2026-07-14',
    fechaFin: '2026-07-14',
    horaInicio: '11:00',
    horaFin: '12:00',
    cantidad: 8,
    motivo: 'Lectura comprensiva de mitología griega y debates rápidos',
    estado: 'Finalizada',
    fechaCreacion: '2026-07-12 11:20'
  },
  {
    id: 'res_11',
    tipoRecurso: 'espacio',
    itemId: 'esp_8',
    itemName: 'Gimnasio Techado & Polideportivo',
    usuarioId: 'user_4',
    usuarioNombre: 'Prof. Carlos Choque',
    fechaInicio: '2026-07-19',
    fechaFin: '2026-07-19',
    horaInicio: '16:00',
    horaFin: '18:00',
    cantidad: 1,
    motivo: 'Entrenamiento intercolegial de fútsal masculino',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-13 18:20'
  },
  {
    id: 'res_12',
    tipoRecurso: 'espacio',
    itemId: 'esp_2',
    itemName: 'Auditorio Germán Busch B',
    usuarioId: 'user_2',
    usuarioNombre: 'Profa. María Delgado',
    fechaInicio: '2026-07-14',
    fechaFin: '2026-07-14',
    horaInicio: '15:00',
    horaFin: '16:00',
    cantidad: 1,
    motivo: 'Ensayo general del coro de primaria para el festival patrio',
    estado: 'Rechazada',
    fechaCreacion: '2026-07-12 15:45'
  },
  {
    id: 'res_13',
    tipoRecurso: 'recurso',
    itemId: 'rec_5',
    itemName: 'Kit de Robótica Arduino Starter',
    usuarioId: 'user_3',
    usuarioNombre: 'Est. Alejandro Vargas',
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-15',
    horaInicio: '08:00',
    horaFin: '10:00',
    cantidad: 4,
    motivo: 'Construcción y calibración de prototipo robótico autónomo',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-14 09:10'
  },
  {
    id: 'res_14',
    tipoRecurso: 'espacio',
    itemId: 'esp_6',
    itemName: 'Laboratorio de Robótica y Electrónica',
    usuarioId: 'user_4',
    usuarioNombre: 'Prof. Carlos Choque',
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-15',
    horaInicio: '08:00',
    horaFin: '10:00',
    cantidad: 1,
    motivo: 'Sesión complementaria de robótica móvil experimental',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-14 09:12'
  },
  {
    id: 'res_15',
    tipoRecurso: 'recurso',
    itemId: 'rec_6',
    itemName: 'Microscopio Óptico Binocular',
    usuarioId: 'user_5',
    usuarioNombre: 'Profa. Ana Mendoza',
    fechaInicio: '2026-07-17',
    fechaFin: '2026-07-17',
    horaInicio: '08:00',
    horaFin: '10:00',
    cantidad: 8,
    motivo: 'Análisis microscópico de tejidos y células vegetales',
    estado: 'Cancelada',
    fechaCreacion: '2026-07-12 10:00'
  },
  {
    id: 'res_16',
    tipoRecurso: 'espacio',
    itemId: 'esp_7',
    itemName: 'Taller de Arte y Modelado',
    usuarioId: 'user_2',
    usuarioNombre: 'Profa. María Delgado',
    fechaInicio: '2026-07-20',
    fechaFin: '2026-07-20',
    horaInicio: '11:00',
    horaFin: '13:00',
    cantidad: 1,
    motivo: 'Práctica libre de escultura en arcilla',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-14 19:30'
  },
  {
    id: 'res_17',
    tipoRecurso: 'recurso',
    itemId: 'rec_13',
    itemName: 'Laptop Dell Latitude 3420',
    usuarioId: 'user_6',
    usuarioNombre: 'Profa. Carmen Ortiz',
    fechaInicio: '2026-07-13',
    fechaFin: '2026-07-13',
    horaInicio: '14:00',
    horaFin: '16:00',
    cantidad: 5,
    motivo: 'Simulación de sistemas operativos en redes locales',
    estado: 'Finalizada',
    fechaCreacion: '2026-07-11 11:20'
  },
  {
    id: 'res_18',
    tipoRecurso: 'espacio',
    itemId: 'esp_9',
    itemName: 'Laboratorio de Biología Celular',
    usuarioId: 'user_7',
    usuarioNombre: 'Prof. Roberto Gómez',
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-15',
    horaInicio: '09:00',
    horaFin: '11:00',
    cantidad: 1,
    motivo: 'Práctica microbiológica de hongos y levaduras',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-14 10:30'
  },
  {
    id: 'res_19',
    tipoRecurso: 'recurso',
    itemId: 'rec_12',
    itemName: 'Calculadora Científica Casio',
    usuarioId: 'user_8',
    usuarioNombre: 'Profa. Julia Quispe',
    fechaInicio: '2026-07-14',
    fechaFin: '2026-07-14',
    horaInicio: '08:00',
    horaFin: '10:00',
    cantidad: 20,
    motivo: 'Prueba trimestral de trigonometría y cálculo integral',
    estado: 'Finalizada',
    fechaCreacion: '2026-07-12 16:30'
  },
  {
    id: 'res_20',
    tipoRecurso: 'espacio',
    itemId: 'esp_10',
    itemName: 'Auditorio Nivel Primaria',
    usuarioId: 'user_9',
    usuarioNombre: 'Prof. Ramiro Beltrán',
    fechaInicio: '2026-07-16',
    fechaFin: '2026-07-16',
    horaInicio: '10:00',
    horaFin: '11:00',
    cantidad: 1,
    motivo: 'Charla sobre valores y convivencia armónica escolar',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-14 11:00'
  },
  {
    id: 'res_21',
    tipoRecurso: 'recurso',
    itemId: 'rec_11',
    itemName: 'Kit de Experimento Eléctrico Básico',
    usuarioId: 'user_10',
    usuarioNombre: 'Profa. Sandra Flores',
    fechaInicio: '2026-07-16',
    fechaFin: '2026-07-16',
    horaInicio: '14:00',
    horaFin: '15:00',
    cantidad: 8,
    motivo: 'Montaje de circuitos de corriente continua y alterna',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-14 17:10'
  },
  {
    id: 'res_22',
    tipoRecurso: 'espacio',
    itemId: 'esp_11',
    itemName: 'Sala de Consejo de Docentes',
    usuarioId: 'user_1',
    usuarioNombre: 'Prof. Luis Sanders',
    fechaInicio: '2026-07-17',
    fechaFin: '2026-07-17',
    horaInicio: '08:00',
    horaFin: '10:00',
    cantidad: 1,
    motivo: 'Reunión de coordinación pedagógica y evaluación de fin de ciclo',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-13 09:00'
  },
  {
    id: 'res_23',
    tipoRecurso: 'espacio',
    itemId: 'esp_12',
    itemName: 'Aula Virtual Google Meet A',
    usuarioId: 'user_11',
    usuarioNombre: 'Prof. Fernando Loza',
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-15',
    horaInicio: '19:00',
    horaFin: '20:00',
    cantidad: 1,
    motivo: 'Reunión informativa con padres de familia de 6to de secundaria',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-14 08:30'
  },
  {
    id: 'res_24',
    tipoRecurso: 'recurso',
    itemId: 'rec_18',
    itemName: 'Proyector Optoma UHD 4K',
    usuarioId: 'user_12',
    usuarioNombre: 'Profa. Gabriela Silva',
    fechaInicio: '2026-07-18',
    fechaFin: '2026-07-18',
    horaInicio: '10:00',
    horaFin: '12:00',
    cantidad: 1,
    motivo: 'Proyección de cortometrajes artísticos creados por estudiantes',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-14 18:40'
  },
  {
    id: 'res_25',
    tipoRecurso: 'recurso',
    itemId: 'rec_15',
    itemName: 'Kit de Anatomía Ósea Completa',
    usuarioId: 'user_13',
    usuarioNombre: 'Prof. Hugo Vásquez',
    fechaInicio: '2026-07-17',
    fechaFin: '2026-07-17',
    horaInicio: '11:00',
    horaFin: '13:00',
    cantidad: 1,
    motivo: 'Clase descriptiva sobre articulaciones y huesos largos',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-13 14:00'
  },
  {
    id: 'res_26',
    tipoRecurso: 'espacio',
    itemId: 'esp_14',
    itemName: 'Laboratorio de Ciencias Mecánicas',
    usuarioId: 'user_14',
    usuarioNombre: 'Profa. Patricia Rojas',
    fechaInicio: '2026-07-19',
    fechaFin: '2026-07-19',
    horaInicio: '09:00',
    horaFin: '11:00',
    cantidad: 1,
    motivo: 'Práctica de péndulo simple y oscilaciones',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-14 15:00'
  },
  {
    id: 'res_27',
    tipoRecurso: 'recurso',
    itemId: 'rec_20',
    itemName: 'Juego de Cristalería de Laboratorio',
    usuarioId: 'user_15',
    usuarioNombre: 'Prof. Ricardo Aliaga',
    fechaInicio: '2026-07-13',
    fechaFin: '2026-07-13',
    horaInicio: '11:00',
    horaFin: '12:00',
    cantidad: 2,
    motivo: 'Práctica básica de destilación de agua y medición de densidades',
    estado: 'Finalizada',
    fechaCreacion: '2026-07-10 11:30'
  },
  {
    id: 'res_28',
    tipoRecurso: 'espacio',
    itemId: 'esp_15',
    itemName: 'Biblioteca Histórica Física',
    usuarioId: 'user_2',
    usuarioNombre: 'Profa. María Delgado',
    fechaInicio: '2026-07-21',
    fechaFin: '2026-07-21',
    horaInicio: '15:00',
    horaFin: '17:00',
    cantidad: 1,
    motivo: 'Investigación bibliográfica de archivos coloniales de Bolivia',
    estado: 'Pendiente',
    fechaCreacion: '2026-07-14 19:40'
  },
  {
    id: 'res_29',
    tipoRecurso: 'recurso',
    itemId: 'rec_14',
    itemName: 'Tablet Samsung Galaxy Tab A8',
    usuarioId: 'user_6',
    usuarioNombre: 'Profa. Carmen Ortiz',
    fechaInicio: '2026-07-14',
    fechaFin: '2026-07-14',
    horaInicio: '10:00',
    horaFin: '12:00',
    cantidad: 12,
    motivo: 'Aplicación de examen diagnóstico interactivo de geografía',
    estado: 'Finalizada',
    fechaCreacion: '2026-07-11 16:50'
  },
  {
    id: 'res_30',
    tipoRecurso: 'espacio',
    itemId: 'esp_5',
    itemName: 'Aula de Audiovisuales & Cine',
    usuarioId: 'user_7',
    usuarioNombre: 'Prof. Roberto Gómez',
    fechaInicio: '2026-07-16',
    fechaFin: '2026-07-16',
    horaInicio: '16:00',
    horaFin: '17:00',
    cantidad: 1,
    motivo: 'Proyección especial de película educativa sobre calentamiento global',
    estado: 'Aprobada',
    fechaCreacion: '2026-07-14 10:00'
  }
];

/**
 * inicializarBD
 * Comprueba e inicializa las colecciones en LocalStorage si no existen previamente,
 * o si la base de datos local tiene menor cantidad de elementos que el catálogo inicial actual.
 */
export const inicializarBD = () => {
  const recursosExistentes = JSON.parse(localStorage.getItem(CLAVE_RECURSOS)) || [];
  if (recursosExistentes.length < RECURSOS_INICIALES.length) {
    localStorage.setItem(CLAVE_RECURSOS, JSON.stringify(RECURSOS_INICIALES));
  }

  const espaciosExistentes = JSON.parse(localStorage.getItem(CLAVE_ESPACIOS)) || [];
  if (espaciosExistentes.length < ESPACIOS_INICIALES.length) {
    localStorage.setItem(CLAVE_ESPACIOS, JSON.stringify(ESPACIOS_INICIALES));
  }

  const reservasExistentes = JSON.parse(localStorage.getItem(CLAVE_RESERVAS)) || [];
  if (reservasExistentes.length < RESERVAS_INICIALES.length) {
    localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(RESERVAS_INICIALES));
  }

  const usuariosExistentes = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
  if (usuariosExistentes.length < USUARIOS_INICIALES.length) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(USUARIOS_INICIALES));
  }
};

// Métodos auxiliares de serialización genéricos para LocalStorage
const obtenerItems = (clave) => JSON.parse(localStorage.getItem(clave)) || [];
const guardarItems = (clave, items) => localStorage.setItem(clave, JSON.stringify(items));

// ==========================================
// CRUD de Recursos
// ==========================================

/**
 * getRecursos
 * Obtiene la lista completa de recursos educativos.
 */
export const getRecursos = () => obtenerItems(CLAVE_RECURSOS);

/**
 * saveRecurso
 * Inserta un nuevo recurso o actualiza uno existente en el almacenamiento.
 */
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
  guardarItems(CLAVE_RECURSOS, recursos);
  return recurso;
};

/**
 * deleteRecurso
 * Elimina un recurso del sistema por su ID.
 */
export const deleteRecurso = (id) => {
  const recursos = getRecursos().filter(r => r.id !== id);
  guardarItems(CLAVE_RECURSOS, recursos);
};

// ==========================================
// CRUD de Aulas y Espacios Físicos/Virtuales
// ==========================================

/**
 * getEspacios
 * Obtiene la lista completa de aulas, laboratorios y espacios configurados.
 */
export const getEspacios = () => obtenerItems(CLAVE_ESPACIOS);

/**
 * guardarEspacio (Anteriormente saveSpace)
 * Guarda o actualiza la configuración de un aula/espacio.
 */
export const guardarEspacio = (espacio) => {
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
  guardarItems(CLAVE_ESPACIOS, espacios);
  return espacio;
};

/**
 * eliminarEspacio (Anteriormente deleteSpace)
 * Elimina un espacio por su identificador.
 */
export const eliminarEspacio = (id) => {
  const espacios = getEspacios().filter(e => e.id !== id);
  guardarItems(CLAVE_ESPACIOS, espacios);
};

// ==========================================
// CRUD de Usuarios
// ==========================================

/**
 * getUsuarios
 * Obtiene la lista de usuarios del sistema escolar.
 */
export const getUsuarios = () => obtenerItems(CLAVE_USUARIOS);

/**
 * saveUsuario
 * Inserta o actualiza los datos de un usuario escolar (Docente, Estudiante, Administrador).
 */
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
  guardarItems(CLAVE_USUARIOS, usuarios);
  return usuario;
};

/**
 * deleteUsuario
 * Elimina la cuenta de un usuario por su ID.
 */
export const deleteUsuario = (id) => {
  const usuarios = getUsuarios().filter(u => u.id !== id);
  guardarItems(CLAVE_USUARIOS, usuarios);
};

// ==========================================
// Lógica de Transacciones y CRUD de Reservas
// ==========================================

/**
 * getReservas
 * Obtiene la lista completa de reservas del sistema.
 */
export const getReservas = () => obtenerItems(CLAVE_RESERVAS);

/**
 * guardarReserva (Anteriormente saveReservation)
 * Registra o actualiza una reserva. Maneja la lógica de negocio del control de stock
 * para recursos disponibles y el estado ocupado/disponible de los espacios.
 */
export const guardarReserva = (reserva) => {
  const reservas = getReservas();
  const recursos = getRecursos();
  const espacios = getEspacios();

  if (reserva.id) {
    const idx = reservas.findIndex(r => r.id === reserva.id);
    if (idx !== -1) {
      const oldReserva = reservas[idx];
      
      // Si la reserva cambia a aprobada, reduce el stock disponible del recurso
      if (reserva.estado === 'Aprobada' && oldReserva.estado !== 'Aprobada' && reserva.tipoRecurso === 'recurso') {
        const recIdx = recursos.findIndex(r => r.id === reserva.itemId);
        if (recIdx !== -1) {
          recursos[recIdx].cantidadDisponible = Math.max(0, recursos[recIdx].cantidadDisponible - reserva.cantidad);
          guardarItems(CLAVE_RECURSOS, recursos);
        }
      }
      
      // Si la reserva se cancela, rechaza o finaliza, devuelve las unidades al stock disponible
      if ((reserva.estado === 'Cancelada' || reserva.estado === 'Rechazada' || reserva.estado === 'Finalizada') && 
          oldReserva.estado === 'Aprobada' && reserva.tipoRecurso === 'recurso') {
        const recIdx = recursos.findIndex(r => r.id === reserva.itemId);
        if (recIdx !== -1) {
          recursos[recIdx].cantidadDisponible = Math.min(recursos[recIdx].cantidadTotal, recursos[recIdx].cantidadDisponible + reserva.cantidad);
          guardarItems(CLAVE_RECURSOS, recursos);
        }
      }
      
      // Si es un aula, actualiza el estado de disponibilidad física del laboratorio
      if (reserva.tipoRecurso === 'espacio') {
        const espIdx = espacios.findIndex(e => e.id === reserva.itemId);
        if (espIdx !== -1) {
          if (reserva.estado === 'Aprobada') {
            espacios[espIdx].estado = 'Ocupado';
          } else if (reserva.estado === 'Finalizada' || reserva.estado === 'Cancelada' || reserva.estado === 'Rechazada') {
            espacios[espIdx].estado = 'Disponible';
          }
          guardarItems(CLAVE_ESPACIOS, espacios);
        }
      }
      
      reservas[idx] = reserva;
    }
  } else {
    // Creación de una solicitud de reserva
    reserva.id = 'res_' + Date.now();
    reserva.fechaCreacion = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    // Asigna el nombre del recurso/aula para optimizar listados
    if (reserva.tipoRecurso === 'recurso') {
      const item = recursos.find(r => r.id === reserva.itemId);
      reserva.itemName = item ? item.nombre : 'Recurso Desconocido';
    } else {
      const item = espacios.find(e => e.id === reserva.itemId);
      reserva.itemName = item ? item.nombre : 'Espacio Desconocido';
    }

    // Los docentes/alumnos empiezan como "Pendiente" y el admin se aprueba inmediatamente
    if (reserva.estado === 'Aprobada') {
      if (reserva.tipoRecurso === 'recurso') {
        const recIdx = recursos.findIndex(r => r.id === reserva.itemId);
        if (recIdx !== -1) {
          recursos[recIdx].cantidadDisponible = Math.max(0, recursos[recIdx].cantidadDisponible - reserva.cantidad);
          guardarItems(CLAVE_RECURSOS, recursos);
        }
      } else {
        const espIdx = espacios.findIndex(e => e.id === reserva.itemId);
        if (espIdx !== -1) {
          espacios[espIdx].estado = 'Ocupado';
          guardarItems(CLAVE_ESPACIOS, espacios);
        }
      }
    }

    reservas.push(reserva);
  }
  guardarItems(CLAVE_RESERVAS, reservas);
  return reserva;
};

/**
 * eliminarReserva (Anteriormente deleteReservation)
 * Elimina una reserva del sistema y devuelve stock/disponibilidad al recurso/espacio correspondiente si la reserva estaba en estado aprobado.
 */
export const eliminarReserva = (id) => {
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
          guardarItems(CLAVE_RECURSOS, recursos);
        }
      } else if (reserva.tipoRecurso === 'espacio') {
        const espacios = getEspacios();
        const espIdx = espacios.findIndex(e => e.id === reserva.itemId);
        if (espIdx !== -1) {
          espacios[espIdx].estado = 'Disponible';
          guardarItems(CLAVE_ESPACIOS, espacios);
        }
      }
    }
    const filtrados = reservas.filter(r => r.id !== id);
    guardarItems(CLAVE_RESERVAS, filtrados);
  }
};
