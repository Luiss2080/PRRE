import React, { useState, useEffect } from 'react';
import { ProveedorAutenticacion, useAutenticacion } from './context/ContextoAutenticacion';
import { ProveedorTema, useTema } from './context/ContextoTema';
import PantallaCarga from './components/PantallaCarga';
import ModalAutenticacion from './components/ModalAutenticacion';
import DisenoEstructura from './components/DisenoEstructura';
import PanelControl from './components/PanelControl';
import ModuloRecursos from './components/ModuloRecursos';
import ModuloEspacios from './components/ModuloEspacios';
import ModuloReservas from './components/ModuloReservas';
import ModuloHistorial from './components/ModuloHistorial';
import ModuloRoles from './components/ModuloRoles';
import ModuloReportes from './components/ModuloReportes';
import ModuloAyuda from './components/ModuloAyuda';
import CatalogoRecursos from './components/CatalogoRecursos';
import { getEspacios } from './utils/datosSimulados';
import { 
  Laptop, 
  Calendar, 
  ShieldCheck, 
  Sun, 
  Moon, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Send, 
  CheckCircle, 
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';

/**
 * ContenidoAplicacion
 * Componente que maneja el flujo de visualización principal.
 * Divide la experiencia del usuario entre el portal público (Landing Page) para no autenticados
 * y el Panel de Reservas Escolar para docentes, estudiantes y administradores autenticados.
 */
function ContenidoAplicacion() {
  const { estaAutenticado, usuarioActual } = useAutenticacion();
  const { alternarTema, esOscuro } = useTema();
  
  const [mostrarPantallaCarga, setMostrarPantallaCarga] = useState(true);
  const [modalAutenticacionAbierto, setModalAutenticacionAbierto] = useState(false);
  const [pestañaAutenticacion, setPestañaAutenticacion] = useState('login');
  
  // Estados para las pestañas de navegación
  const [pestañaActualPortal, setPestañaActualPortal] = useState(() => localStorage.getItem('prre_pestaña_predeterminada') || 'dashboard'); // Pestaña del Portal (Autenticado)
  const [pestañaActualPublico, setPestañaActualPublico] = useState('inicio'); // Pestaña Pública (No Autenticado)

  // Estado para la redirección o preselección de recursos
  const [recursoPreseleccionado, setRecursoPreseleccionado] = useState(null);

  // Estado para la barra de avisos institucionales
  const [mostrarAviso, setMostrarAviso] = useState(true);

  // Estado para el panel de Preguntas Frecuentes (FAQ)
  const [indiceFaqAbierto, setIndiceFaqAbierto] = useState(null);

  // Estados del Formulario de Contacto
  const [nombreContacto, setNombreContacto] = useState('');
  const [emailContacto, setEmailContacto] = useState('');
  const [mensajeContacto, setMensajeContacto] = useState('');

  // Estado para listar los espacios públicos
  const [espaciosPublicos, setEspaciosPublicos] = useState([]);
  
  // Estado para controlar la barra lateral en versión móvil
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Carga los espacios públicos al montar y escucha cambios de la BD simulada
  useEffect(() => {
    setEspaciosPublicos(getEspacios());
    const manejarActualizacion = () => {
      setEspaciosPublicos(getEspacios());
    };
    window.addEventListener('prre_db_update', manejarActualizacion);
    return () => window.removeEventListener('prre_db_update', manejarActualizacion);
  }, []);

  const alternarFaq = (indice) => {
    setIndiceFaqAbierto(indiceFaqAbierto === indice ? null : indice);
  };

  const alEnviarContacto = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setNombreContacto('');
      setEmailContacto('');
      setMensajeContacto('');
      alert('¡Mensaje enviado con éxito! Nos pondremos en contacto con usted a la brevedad.');
    }, 800);
  };

  // Redirecciona al docente/estudiante al formulario de reserva con un recurso preseleccionado
  const alRedireccionarReservaRecurso = (recurso) => {
    setRecursoPreseleccionado({ ...recurso, tipoRecurso: 'recurso' });
    setPestañaActualPortal('reservas');
  };

  // Redirecciona al docente/estudiante al formulario de reserva con un espacio preseleccionado
  const alRedireccionarReservaEspacio = (espacio) => {
    setRecursoPreseleccionado({ ...espacio, tipoRecurso: 'espacio' });
    setPestañaActualPortal('reservas');
  };

  // 1. Mostrar la pantalla de carga animada inicial
  if (mostrarPantallaCarga) {
    return <PantallaCarga alTerminar={() => setMostrarPantallaCarga(false)} />;
  }

  // Componente interno para el logo institucional
  const Logo = ({ tamaño = 32 }) => (
    <img 
      src="/LogoSistema.png" 
      alt="Logo PRRE" 
      style={{ 
        width: `${tamaño}px`, 
        height: 'auto', 
        display: 'block',
        filter: 'drop-shadow(0 2px 8px rgba(0, 229, 255, 0.2))' 
      }} 
    />
  );

  // 2. Renderiza la sección pública si el usuario no ha iniciado sesión
  if (!estaAutenticado) {
    
    // Controla la carga del contenido de las pestañas públicas
    const renderizarPestañaPublica = () => {
      switch (pestañaActualPublico) {
        // --- VISTA INICIO ---
        case 'inicio':
          return (
            <>
              {/* Sección Hero */}
              <section style={estiloSeccionHero}>
                <div style={estiloContenidoHero}>
                  <div style={estiloEtiquetaHero}>
                    PORTAL DE RESERVAS • U. E. GERMÁN BUSCH B
                  </div>
                  <h1 style={estiloTituloHero}>
                    PRRE: <span className="gradient-text">Portal de Reserva</span> de Recursos Educativos
                  </h1>
                  <p style={estiloSubtituloHero}>
                    Un entorno tecnológico estandarizado diseñado en cooperación con las Escuelas Populares Don Bosco (EPDB) para optimizar el préstamo de laptops, proyectores, laboratorios y aulas virtuales.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                    <button 
                      onClick={() => { setPestañaAutenticacion('login'); setModalAutenticacionAbierto(true); }}
                      className="btn btn-primary"
                      style={{ padding: '0.85rem 2.05rem', fontSize: '1rem' }}
                    >
                      Acceder al Portal
                    </button>
                    <button 
                      onClick={() => { setPestañaAutenticacion('register'); setModalAutenticacionAbierto(true); }}
                      className="btn btn-secondary"
                      style={{ padding: '0.85rem 2.05rem', fontSize: '1rem' }}
                    >
                      Crear Cuenta Institucional
                    </button>
                  </div>
                </div>
              </section>

              {/* Franja de Estadísticas */}
              <section style={estiloFranjaStats}>
                <div style={estiloGridFranjaStats} className="grid-cols-4">
                  <div style={estiloItemFranjaStats}>
                    <span style={estiloNumeroFranjaStats}>120+</span>
                    <span style={estiloEtiquetaFranjaStats}>Usuarios Activos</span>
                  </div>
                  <div style={estiloItemFranjaStats}>
                    <span style={estiloNumeroFranjaStats}>50+</span>
                    <span style={estiloEtiquetaFranjaStats}>Equipos Tecnológicos</span>
                  </div>
                  <div style={estiloItemFranjaStats}>
                    <span style={estiloNumeroFranjaStats}>5</span>
                    <span style={estiloEtiquetaFranjaStats}>Laboratorios y Aulas</span>
                  </div>
                  <div style={estiloItemFranjaStats}>
                    <span style={estiloNumeroFranjaStats}>98%</span>
                    <span style={estiloEtiquetaFranjaStats}>Tasa de Aprobación</span>
                  </div>
                </div>
              </section>

              {/* Guía de Pasos del Portal */}
              <section style={estiloSeccionGuia}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                  <h2 className="text-center" style={{ fontSize: '1.75rem', marginBottom: '2.5rem' }}>
                    ¿Cómo solicitar tu reserva en <span style={{ color: 'var(--color-brand-cyan-muted)' }}>3 simples pasos</span>?
                  </h2>
                  <div className="grid-cols-4" style={{ gap: '2rem' }}>
                    <div style={estiloItemGuia}>
                      <div style={estiloNumeroGuia}>1</div>
                      <h4 style={{ marginBottom: '0.5rem', fontWeight: '800' }}>Registra tu cuenta</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Crea una cuenta institucional con tu correo institucional y contraseña de acceso.
                      </p>
                    </div>

                    <div style={estiloItemGuia}>
                      <div style={estiloNumeroGuia}>2</div>
                      <h4 style={{ marginBottom: '0.5rem', fontWeight: '800' }}>Selecciona tu recurso</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Explora el catálogo en tarjetas y presiona "Reservar Ahora" en el recurso o espacio de interés.
                      </p>
                    </div>

                    <div style={estiloItemGuia}>
                      <div style={estiloNumeroGuia}>3</div>
                      <h4 style={{ marginBottom: '0.5rem', fontWeight: '800' }}>Recibe y Utiliza</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Una vez aprobada la reserva, asiste al laboratorio o recoge el dispositivo móvil en la administración.
                      </p>
                    </div>

                    <div style={estiloItemGuia}>
                      <div style={{ ...estiloNumeroGuia, backgroundColor: 'var(--color-success)' }}>
                        <CheckCircle size={24} color="white" />
                      </div>
                      <h4 style={{ marginBottom: '0.5rem', fontWeight: '800' }}>¡Todo Listo!</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Al concluir la sesión, el equipo vuelve automáticamente al stock de disponibilidad.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Características del Sistema */}
              <section style={estiloSeccionCaracteristicas}>
                <div className="grid-cols-4" style={{ maxWidth: '1200px', margin: '0 auto', gap: '1.5rem' }}>
                  <div className="glass-card text-center glow-card-cyan" style={estiloTarjetaCaracteristica}>
                    <div style={estiloContenedorIconoCaracteristica('var(--color-brand-cyan-muted)')}>
                      <Laptop size={24} color="white" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Recursos de Clases</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Revisa la disponibilidad de proyectores multimedia, laptops HP y kits de robótica.
                    </p>
                  </div>

                  <div className="glass-card text-center glow-card-gold" style={estiloTarjetaCaracteristica}>
                    <div style={estiloContenedorIconoCaracteristica('var(--color-brand-gold)')}>
                      <Calendar size={24} color="white" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Aulas & Laboratorios</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Agenda el laboratorio de computación, el laboratorio de física o auditorio sin cruces de horarios.
                    </p>
                  </div>

                  <div className="glass-card text-center glow-card-cyan" style={estiloTarjetaCaracteristica}>
                    <div style={estiloContenedorIconoCaracteristica('var(--color-success)')}>
                      <ShieldCheck size={24} color="white" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Perfiles Jerárquicos</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Roles específicos para estudiantes y docentes con flujos de reserva simplificados.
                    </p>
                  </div>

                  <div className="glass-card text-center glow-card-gold" style={estiloTarjetaCaracteristica}>
                    <div style={estiloContenedorIconoCaracteristica('#6366F1')}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Control de Stock</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Algoritmo automatizado que descuenta unidades del inventario activo tras aprobar una reserva.
                    </p>
                  </div>
                </div>
              </section>
            </>
          );

        // --- VISTA SOBRE NOSOTROS ---
        case 'nosotros':
          return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
              <div className="glass-card" style={{ padding: '2.5rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Nuestra Institución</h2>
                
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.25rem', fontSize: '1.05rem' }}>
                  La <b>Unidad Educativa Germán Busch B</b> fue fundada en <b>1993</b> con el firme propósito de impartir educación técnico-humanística de primer nivel a la juventud del departamento. Afiliada a las <b>Escuelas Populares Don Bosco (EPDB)</b>, la institución prioriza la enseñanza de las tecnologías de la información, electrónica, física aplicada y robótica industrial.
                </p>

                <div 
                  style={{ 
                    display: 'flex', 
                    gap: '1.5rem', 
                    backgroundColor: 'rgba(0, 229, 255, 0.03)', 
                    border: '1px solid var(--border-color)', 
                    padding: '1.5rem', 
                    borderRadius: 'var(--border-radius-md)',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <Logo tamaño={70} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--color-brand-cyan-muted)' }}>Misión del Portal PRRE</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      Brindar un canal digital transparente y organizado para que docentes y estudiantes accedan con equidad y de manera ordenada al material educativo y laboratorios de la escuela, previniendo choques de agenda y prolongando el ciclo de vida del equipamiento mediante reportes de mantenimiento.
                    </p>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', marginTop: '2rem' }}>Cooperación EPDB</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                  Bajo la metodología salesiana, fomentamos que la tecnología esté al alcance de todos. El portal PRRE es parte de la iniciativa de transformación digital escolar impulsada por el convenio de Escuelas Populares Don Bosco para modernizar la administración de recursos didácticos en Bolivia.
                </p>
              </div>
            </div>
          );

        // --- VISTA CATÁLOGO PÚBLICO ---
        case 'catalogo':
          return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
              <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Catálogo Oficial de Recursos Educativos</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Revisa el listado activo de guías, laptops, kits y proyectores de la escuela. Para reservar, inicia sesión con tu cuenta institucional.
                </p>
              </div>
              <CatalogoRecursos esPublico={true} />
            </div>
          );

        // --- VISTA ESPACIOS PÚBLICOS ---
        case 'espacios':
          return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
              <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aulas Temáticas y Laboratorios</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Lista de laboratorios de informática, laboratorios científicos y auditorios disponibles para clases prácticas y talleres grupales.
                </p>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>Espacio Escolar</th>
                      <th>Ubicación</th>
                      <th>Tipo</th>
                      <th style={{ textAlign: 'center' }}>Capacidad</th>
                      <th>Estado</th>
                      <th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {espaciosPublicos.map(esp => (
                      <tr key={esp.id}>
                        <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                          {esp.tipo === 'Físico' ? <MapPin size={16} color="var(--color-brand-cyan-muted)" /> : <Globe size={16} color="var(--color-brand-gold)" />}
                        </td>
                        <td style={{ fontWeight: '700' }}>{esp.nombre}</td>
                        <td>{esp.ubicacion}</td>
                        <td><span style={{ fontWeight: '600' }}>{esp.tipo}</span></td>
                        <td style={{ textAlign: 'center', fontWeight: '700' }}>{esp.capacidad} alumnos</td>
                        <td>
                          <span className={`badge ${esp.estado === 'Disponible' ? 'badge-success' : (esp.estado === 'Ocupado' ? 'badge-danger' : 'badge-warning')}`}>
                            {esp.estado}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{esp.descripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        // --- VISTA DE PREGUNTAS FRECUENTES (FAQ) ---
        case 'faq':
          const listaFaq = [
            { q: '¿Quiénes pueden utilizar el portal PRRE?', a: 'El préstamo está habilitado exclusivamente para el plantel docente y los estudiantes activos de secundaria de la U.E. Germán Busch B.' },
            { q: '¿Con cuánta anticipación debo reservar un espacio?', a: 'Se recomienda reservar los laboratorios científicos y salas de computación con un mínimo de 24 horas de anticipación. Para proyectores portátiles o guías de estudio, se pueden solicitar hasta con 2 horas de anticipación siempre que haya stock.' },
            { q: '¿Qué sucede si daño o pierdo un recurso prestado?', a: 'Debes informar de inmediato al Administrador de Tecnologías en la dirección del colegio. El equipo se catalogará en estado de "Mantenimiento" y se evaluará el reporte de incidencias conforme al reglamento interno.' },
            { q: '¿Cómo obtengo mi cuenta del portal?', a: 'Haz clic en "Crear Cuenta" en la cabecera e ingresa tu correo institucional. Se te asignará automáticamente el rol correspondiente (Docente o Estudiante) y podrás iniciar solicitudes inmediatamente.' }
          ];

          return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1rem' }}>
              <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Preguntas Frecuentes</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Resuelve tus dudas sobre las normas de uso, tiempos de devolución y stock de equipos.</p>
              </div>

              <div className="faq-container">
                {listaFaq.map((faq, idx) => (
                  <div key={idx} className="faq-item" style={{ transition: 'all 0.3s ease' }}>
                    <button 
                      onClick={() => alternarFaq(idx)} 
                      className="faq-question-btn"
                    >
                      <span>{faq.q}</span>
                      {indiceFaqAbierto === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {indiceFaqAbierto === idx && (
                      <div className="faq-answer-panel" style={{ animation: 'slideInDownFaq 0.25s ease-out' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );

        // --- VISTA DE CONTACTO ---
        case 'contacto':
          return (
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1rem' }}>
              <div className="text-center" style={{ marginBottom: '3rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Centro de Contacto PRRE</h2>
                <p style={{ color: 'var(--text-secondary)' }}>¿Tiene algún problema con su cuenta institucional o desea reportar un desperfecto? Escríbanos.</p>
              </div>

              <div className="contact-layout">
                {/* Formulario de Contacto */}
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Enviar Mensaje</h3>
                  <form onSubmit={alEnviarContacto}>
                    <div className="form-group">
                      <label className="form-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ej. María Quiroga" 
                        value={nombreContacto}
                        onChange={(e) => setNombreContacto(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Correo Institucional</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="m.quiroga@colegio.edu.bo" 
                        value={emailContacto}
                        onChange={(e) => setEmailContacto(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Detalle de la consulta / Reporte</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Escriba aquí los detalles..." 
                        rows="4"
                        value={mensajeContacto}
                        onChange={(e) => setMensajeContacto(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ gap: '0.5rem' }}>
                      <Send size={16} />
                      <span>Enviar Formulario</span>
                    </button>
                  </form>
                </div>

                {/* Tarjeta de Información Física */}
                <div className="contact-card-info">
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Oficina de Administración</h3>
                  
                  <div className="contact-info-item">
                    <div className="contact-icon-wrapper">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block' }}>Dirección Física</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Bloque Administrativo, Planta Baja, Oficina de Soporte TI. Miraflores, La Paz.
                      </span>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon-wrapper">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block' }}>Línea Telefónica</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>2-224455 (Ext. 104)</span>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon-wrapper">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block' }}>Correo de Soporte</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>ti.soporte@colegio.edu.bo</span>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon-wrapper">
                      <Globe size={18} />
                    </div>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block' }}>Plataforma EPDB</span>
                      <a href="https://www.epdb.org.bo" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: 'var(--color-brand-cyan-muted)', textDecoration: 'none', fontWeight: '600' }}>
                        www.epdb.org.bo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div style={estiloEnvolturaLanding}>
        {/* Barra de avisos */}
        {mostrarAviso && (
          <div style={estiloBarraAviso}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexGrow: 1, padding: '0 1rem' }}>
              <AlertTriangle size={16} />
              <span>
                <b>Aviso:</b> El sábado 12 de julio se realizará el mantenimiento preventivo anual de las laptops HP ProBook. Tomar previsiones.
              </span>
            </div>
            <button onClick={() => setMostrarAviso(false)} style={estiloBotonCerrarAviso}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Encabezado Público */}
        <header style={estiloEncabezadoLanding}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Botón menú móvil */}
            <button 
              onClick={() => setMenuMovilAbierto(true)}
              className="public-mobile-toggle"
              style={estiloBotonMenuMovilPublico}
              title="Abrir Menú"
            >
              <Menu size={20} />
            </button>

            <Logo size={36} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={estiloTextoLogoLanding}>PRRE</span>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                U.E. GERMAN BUSCH B
              </span>
            </div>
          </div>

          {/* Navegación de pestañas públicas */}
          <nav className="header-nav">
            <button 
              onClick={() => setLandingTab('inicio')}
              className={`header-nav-link ${pestañaActualPublico === 'inicio' ? 'active' : ''}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => setLandingTab('nosotros')}
              className={`header-nav-link ${pestañaActualPublico === 'nosotros' ? 'active' : ''}`}
            >
              Sobre el Portal
            </button>
            <button 
              onClick={() => setLandingTab('catalogo')}
              className={`header-nav-link ${pestañaActualPublico === 'catalogo' ? 'active' : ''}`}
            >
              Catálogo de Recursos
            </button>
            <button 
              onClick={() => setLandingTab('espacios')}
              className={`header-nav-link ${pestañaActualPublico === 'espacios' ? 'active' : ''}`}
            >
              Aulas & Espacios
            </button>
            <button 
              onClick={() => setLandingTab('faq')}
              className={`header-nav-link ${pestañaActualPublico === 'faq' ? 'active' : ''}`}
            >
              Preguntas Frecuentes
            </button>
            <button 
              onClick={() => setLandingTab('contacto')}
              className={`header-nav-link ${pestañaActualPublico === 'contacto' ? 'active' : ''}`}
            >
              Contacto
            </button>
          </nav>

          {/* Controles de autenticación y tema */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={alternarTema} 
              style={estiloAlternarTemaLanding} 
              title="Cambiar Tema"
            >
              {esOscuro ? <Sun size={18} color="#FF9F1C" /> : <Moon size={18} color="#00B4D8" />}
            </button>

            <button 
              onClick={() => { setPestañaAutenticacion('login'); setModalAutenticacionAbierto(true); }}
              className="btn btn-secondary"
            >
              Iniciar Sesión
            </button>
            
            <button 
              onClick={() => { setPestañaAutenticacion('register'); setModalAutenticacionAbierto(true); }}
              className="btn btn-primary"
            >
              Crear Cuenta
            </button>
          </div>
        </header>

        {/* Cuerpo público */}
        <main style={{ flexGrow: 1 }}>
          {renderizarPestañaPublica()}
        </main>

        {/* Pie de página público */}
        <footer style={estiloPiePaginaLanding}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Logo size={24} />
            <b>Portal PRRE</b>
          </div>
          <div>
            U. E. Germán Busch B • Convenio Escuelas Populares Don Bosco (EPDB)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            &copy; 2026 Reservas Educativas. Todos los derechos reservados.
          </div>
        </footer>

        {/* Modal de autenticación */}
        <ModalAutenticacion 
          estaAbierto={modalAutenticacionAbierto} 
          alCerrar={() => setModalAutenticacionAbierto(false)} 
          pestañaInicial={pestañaAutenticacion} 
        />

        {/* Menú móvil desplegable */}
        {menuMovilAbierto && (
          <>
            <div 
              onClick={() => setMenuMovilAbierto(false)}
              style={estiloSombraMenuMovil}
            />
            <div style={estiloDrawerMenuMovil}>
              <div style={estiloEncabezadoDrawerMenuMovil}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Logo size={28} />
                  <span style={{ fontWeight: '800', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Menú Público</span>
                </div>
                <button onClick={() => setMenuMovilAbierto(false)} style={estiloBotonCerrarMenuMovil}>
                  <X size={20} />
                </button>
              </div>
              
              <nav style={estiloNavegacionMenuMovil}>
                {[
                  { id: 'inicio', label: 'Inicio' },
                  { id: 'nosotros', label: 'Sobre el Portal' },
                  { id: 'catalogo', label: 'Catálogo de Recursos' },
                  { id: 'espacios', label: 'Aulas & Espacios' },
                  { id: 'faq', label: 'Preguntas Frecuentes' },
                  { id: 'contacto', label: 'Contacto' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setLandingTab(item.id);
                      setMenuMovilAbierto(false);
                    }}
                    style={estiloEnlaceMenuMovil(pestañaActualPublico === item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                <button 
                  onClick={() => { setPestañaAutenticacion('login'); setModalAutenticacionAbierto(true); setMenuMovilAbierto(false); }}
                  className="btn btn-secondary w-full"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => { setPestañaAutenticacion('register'); setModalAutenticacionAbierto(true); setMenuMovilAbierto(false); }}
                  className="btn btn-primary w-full"
                >
                  Crear Cuenta
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Establece de forma consistente la pestaña de landing page
  function setLandingTab(tabId) {
    setPestañaActualPublico(tabId);
  }

  // 3. Renderiza el Panel de Control si el usuario ya inició sesión
  const renderizarContenidoTabPortal = () => {
    switch (pestañaActualPortal) {
      case 'dashboard':
        return <PanelControl establecerPestañaActiva={setPestañaActualPortal} />;
      case 'recursos':
        return <ModuloRecursos alRedireccionarReserva={alRedireccionarReservaRecurso} />;
      case 'espacios':
        return <ModuloEspacios alRedireccionarReserva={alRedireccionarReservaEspacio} />;
      case 'reservas':
        return (
          <ModuloReservas 
            elementoPreseleccionado={recursoPreseleccionado} 
            alLimpiarPreseleccionado={() => setRecursoPreseleccionado(null)} 
            establecerPestañaActiva={setPestañaActualPortal}
          />
        );
      case 'historial':
        return <ModuloHistorial />;
      case 'reportes':
        return <ModuloReportes />;
      case 'ayuda':
        return <ModuloAyuda />;
      case 'roles':
        if (usuarioActual?.rol !== 'Administrador') {
          setPestañaActualPortal('dashboard');
          return <PanelControl establecerPestañaActiva={setPestañaActualPortal} />;
        }
        return <ModuloRoles />;
      default:
        return <PanelControl establecerPestañaActiva={setPestañaActualPortal} />;
    }
  };

  return (
    <DisenoEstructura pestañaActual={pestañaActualPortal} establecerPestañaActiva={setPestañaActualPortal}>
      {renderizarContenidoTabPortal()}
    </DisenoEstructura>
  );
}

/**
 * Aplicacion
 * Envuelve el componente con los proveedores globales de autenticación y tema.
 */
export default function Aplicacion() {
  return (
    <ProveedorTema>
      <ProveedorAutenticacion>
        <ContenidoAplicacion />
      </ProveedorAutenticacion>
    </ProveedorTema>
  );
}

// Estilos en línea para las vistas públicas
const estiloEnvolturaLanding = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--bg-primary)',
};

const estiloEncabezadoLanding = {
  height: 'var(--header-height)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 1.5rem',
  backgroundColor: 'var(--bg-secondary)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid var(--border-color)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  boxShadow: 'var(--shadow-sm)'
};

const estiloTextoLogoLanding = {
  fontSize: '1.35rem',
  fontWeight: '800',
  letterSpacing: '0.05em',
  background: 'linear-gradient(135deg, var(--color-brand-cyan), var(--color-brand-gold))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1'
};

const estiloAlternarTemaLanding = {
  background: 'none',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  border: '1px solid var(--border-color)',
};

const estiloSeccionHero = {
  padding: '5rem 2rem 4rem 2rem',
  textAlign: 'center',
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at top, rgba(0, 229, 255, 0.04) 0%, transparent 70%)',
};

const estiloContenidoHero = {
  maxWidth: '850px',
  width: '100%',
};

const estiloEtiquetaHero = {
  display: 'inline-block',
  backgroundColor: 'rgba(255, 159, 28, 0.15)',
  border: '1px solid rgba(255, 159, 28, 0.3)',
  color: '#FF9F1C',
  padding: '0.45rem 1.25rem',
  borderRadius: '50px',
  fontSize: '0.75rem',
  fontWeight: '800',
  letterSpacing: '0.12em',
  marginBottom: '1.5rem',
  boxShadow: '0 0 15px rgba(255, 159, 28, 0.1)'
};

const estiloTituloHero = {
  fontSize: '3.25rem',
  fontWeight: '850',
  lineHeight: '1.15',
  color: 'var(--text-primary)',
  marginBottom: '1.5rem',
  letterSpacing: '-0.02em',
};

const estiloSubtituloHero = {
  fontSize: '1.125rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.65',
  marginBottom: '2.5rem',
  maxWidth: '720px',
  margin: '0 auto 2.5rem auto'
};

const estiloSeccionCaracteristicas = {
  padding: '4rem 2rem',
  backgroundColor: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border-color)',
  borderBottom: '1px solid var(--border-color)',
};

const estiloTarjetaCaracteristica = {
  padding: '2rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const estiloContenedorIconoCaracteristica = (color) => ({
  width: '52px',
  height: '52px',
  borderRadius: 'var(--border-radius-md)',
  backgroundColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.25rem',
  boxShadow: `0 4px 14px ${color}35`,
});

const estiloPiePaginaLanding = {
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: 'var(--bg-primary)',
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  borderTop: '1px solid var(--border-color)'
};

const estiloBarraAviso = {
  backgroundColor: '#FF9F1C',
  color: '#070B13',
  fontSize: '0.8125rem',
  fontWeight: '700',
  padding: '0.5rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 10px rgba(255, 159, 28, 0.2)',
  position: 'relative',
  zIndex: 1100,
};

const estiloBotonCerrarAviso = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#070B13',
  display: 'flex',
  alignItems: 'center',
  padding: '0.125rem',
};

const estiloFranjaStats = {
  backgroundColor: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border-color)',
  borderBottom: '1px solid var(--border-color)',
  padding: '2rem 1rem',
};

const estiloGridFranjaStats = {
  maxWidth: '1000px',
  margin: '0 auto',
  gap: '1.5rem',
  textAlign: 'center',
};

const estiloItemFranjaStats = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const estiloNumeroFranjaStats = {
  fontSize: '2rem',
  fontWeight: '900',
  color: 'var(--color-brand-cyan-muted)',
  letterSpacing: '-0.02em',
  lineHeight: '1',
  marginBottom: '0.25rem',
  filter: 'drop-shadow(0 2px 8px rgba(0, 229, 255, 0.15))'
};

const estiloEtiquetaFranjaStats = {
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  fontWeight: '600',
};

const estiloSeccionGuia = {
  padding: '5rem 2rem',
  backgroundColor: 'var(--bg-primary)',
};

const estiloItemGuia = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '1.5rem',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-sm)',
};

const estiloNumeroGuia = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-brand-cyan-muted)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  fontWeight: '800',
  marginBottom: '1rem',
  boxShadow: '0 4px 10px rgba(0, 229, 255, 0.25)',
};

const estiloSombraMenuMovil = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(5, 8, 16, 0.45)',
  backdropFilter: 'blur(4px)',
  zIndex: 1400,
};

const estiloDrawerMenuMovil = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '280px',
  backgroundColor: 'var(--bg-secondary-solid)',
  borderLeft: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-lg)',
  zIndex: 1500,
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

const estiloEncabezadoDrawerMenuMovil = {
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const estiloBotonCerrarMenuMovil = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const estiloNavegacionMenuMovil = {
  padding: '1.5rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
};

const estiloEnlaceMenuMovil = (estaActivo) => ({
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--border-radius-sm)',
  background: estaActivo ? 'rgba(0, 229, 255, 0.08)' : 'none',
  border: 'none',
  color: estaActivo ? 'var(--color-brand-cyan-muted)' : 'var(--text-primary)',
  textAlign: 'left',
  fontWeight: '700',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

const estiloBotonMenuMovilPublico = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  padding: '0.35rem',
  borderRadius: 'var(--border-radius-sm)',
  display: 'none',
  alignItems: 'center',
};

// Inyecta dinámicamente animaciones responsivas
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .public-mobile-toggle {
        display: flex !important;
      }
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes slideInDownFaq {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
