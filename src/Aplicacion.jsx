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
  X
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

  // Componente interno para el logo institucional (landing pública)
  const Logo = ({ tamaño = 32 }) => (
    <img
      src="/LogoInstitucional.png"
      alt="Logo U.E. Germán Busch B"
      style={{
        width: `${tamaño}px`,
        height: 'auto',
        display: 'block',
        filter: 'drop-shadow(0 2px 8px rgba(0,229,255,0.2))'
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
                  <h1 className="public-hero-title" style={estiloTituloHero}>
                    PRRE: <span className="gradient-text">Portal de Reserva</span> de Recursos Educativos
                  </h1>
                  <p className="public-hero-subtitle" style={estiloSubtituloHero}>
                    Un entorno tecnológico estandarizado diseñado en cooperación con las Escuelas Populares Don Bosco (EPDB) para optimizar el préstamo de laptops, proyectores, laboratorios y aulas virtuales.
                  </p>
                  <div className="public-cta-group">
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

              {/* Franja de Estadísticas - Datos Reales */}
              <section style={estiloFranjaStats}>
                <div style={estiloGridFranjaStats} className="grid-cols-4">
                  <div style={estiloItemFranjaStats}>
                    <span style={estiloNumeroFranjaStats}>591</span>
                    <span style={estiloEtiquetaFranjaStats}>Estudiantes Activos</span>
                  </div>
                  <div style={estiloItemFranjaStats}>
                    <span style={estiloNumeroFranjaStats}>40+</span>
                    <span style={estiloEtiquetaFranjaStats}>Docentes y Administrativos</span>
                  </div>
                  <div style={estiloItemFranjaStats}>
                    <span style={estiloNumeroFranjaStats}>3</span>
                    <span style={estiloEtiquetaFranjaStats}>Niveles Educativos</span>
                  </div>
                  <div style={estiloItemFranjaStats}>
                    <span style={estiloNumeroFranjaStats}>29+</span>
                    <span style={estiloEtiquetaFranjaStats}>Años de Trayectoria</span>
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

        // --- VISTA SOBRE EL PORTAL ---
        case 'nosotros':
          return (
            <div className="public-section" style={{ maxWidth: '960px' }}>
              {/* Cabecera */}
              <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
                <div className="public-section-header">
                  <Logo tamaño={64} />
                  <div>
                    <h2 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Sobre el Portal PRRE</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>
                      Plataforma de Reserva de Recursos Educativos • U.E. Germán Busch B
                    </p>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', fontSize: '1rem' }}>
                  El sistema <b>PRRE</b> es una plataforma digital diseñada en cooperación con las <b>Escuelas Populares Don Bosco (EPDB)</b>
                  para optimizar el préstamo y reserva de recursos educativos, laboratorios y herramientas didácticas de la
                  <b>Unidad Educativa Germán Busch "B"</b>, ubicada en Shinahota, Provincia Tiraque, Cochabamba.
                </p>
              </div>

              {/* Cards de objetivos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { titulo: 'Misión', texto: 'Brindar acceso equitativo y organizado a los recursos educativos de la institución, previniendo conflictos de horario y prolongando la vida útil del equipamiento.', color: 'var(--color-brand-cyan-muted)' },
                  { titulo: 'Visión', texto: 'Convertirse en el referente de administración digital escolar en la región del Chapáre, promoviendo la transformación tecnológica salesiana.', color: 'var(--color-brand-gold)' },
                  { titulo: 'Valores', texto: 'Transparencia, equidad, responsabilidad y compromiso con la formación integral de docentes y estudiantes de la U.E.', color: 'var(--color-success)' },
                ].map(card => (
                  <div key={card.titulo} className="glass-card" style={{ padding: '1.5rem', borderTop: `3px solid ${card.color}` }}>
                    <h4 style={{ color: card.color, marginBottom: '0.5rem', fontSize: '0.9375rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{card.titulo}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.65' }}>{card.texto}</p>
                  </div>
                ))}
              </div>

              {/* Imágenes de Valores */}
              <div className="public-section-grid-2" style={{ marginBottom: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '0.75rem', overflow: 'hidden', borderRadius: 'var(--border-radius)' }}>
                  <img
                    src="/img/ValoresFundamentales.jpeg"
                    alt="Valores Fundamentales"
                    style={{ width: '100%', height: 'auto', borderRadius: 'var(--border-radius-sm)', display: 'block', objectFit: 'cover' }}
                  />
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valores Fundamentales</p>
                </div>
                <div className="glass-card" style={{ padding: '0.75rem', overflow: 'hidden', borderRadius: 'var(--border-radius)' }}>
                  <img
                    src="/img/ValoresInstitucionales.jpeg"
                    alt="Valores Institucionales"
                    style={{ width: '100%', height: 'auto', borderRadius: 'var(--border-radius-sm)', display: 'block', objectFit: 'cover' }}
                  />
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valores Institucionales</p>
                </div>
              </div>

              {/* Cooperación EPDB */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--color-brand-cyan-muted)' }}>Cooperación con Escuelas Populares Don Bosco</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', fontSize: '0.9375rem' }}>
                  Bajo la filosofía salesiana, fomentamos que la tecnología esté al alcance de todos los estudiantes del Chapáre.
                  El portal PRRE es parte de la iniciativa de transformación digital impulsada por el convenio EPDB
                  para modernizar la administración de recursos didácticos en Bolivia.
                  En 2019, la A.L.D. de Cochabamba reconoció a la institución mediante la <b>Ley N° 147/2018-2019</b> por su aporte
                  a la educación de niños y jóvenes de la región.
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

        // --- VISTA INSTITUCIÓN ---
        case 'institucion':
          return (
            <div className="public-section" style={{ maxWidth: '1060px' }}>
              {/* Encabezado institucional */}
              <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem', borderTop: '3px solid var(--color-brand-cyan-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <Logo tamaño={80} />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Estado Plurinacional de Bolivia • Ministerio de Educación
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Dirección Departamental de Educación Cochabamba • Distrito Tiraque
                    </p>
                    <h2 className="gradient-text" style={{ fontSize: '1.6rem', lineHeight: '1.2', marginBottom: '0.35rem' }}>U.E. Germán Busch “B”</h2>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.9rem' }}>
                      Escuelas Populares Don Bosco (EPDB) • Shinahota, Tiraque, Cochabamba
                    </p>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', fontSize: '0.9375rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  Fundada oficialmente el <b>26 de abril de 1993</b>, la Unidad Educativa Germán Busch “B” es una institución dependiente de las
                  Escuelas Populares Don Bosco, con filosofía orientada a la madurez de niños y jóvenes en Cristo y la Iglesia, enseñando el
                  evangelio mediante la educación y la evangelización. Actualmente cuenta con <b>591 estudiantes</b> en los tres niveles.
                </p>
              </div>

              {/* Grid: datos + carrera */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Datos institucionales */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--color-brand-cyan-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Datos Institucionales
                  </h3>
                  <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
                    <tbody>
                      {[
                        ['Código SIE', '80830066'],
                        ['Cód. Edificio Escolar', '80830068'],
                        ['Res. Administrativa', 'N° 0752/2000'],
                        ['Res. Ministerial', '26/04/1993'],
                        ['Municipio', 'Shinahota'],
                        ['Provincia', 'Tiraque, Cochabamba'],
                        ['Dependencia', 'Convenio EPDB'],
                        ['Director', 'José Antonio Mendizábal M.'],
                        ['Cód. CIE Director', 'CIE: 808300066'],
                        ['Correo', 'dir.germanbuschb@gmail.com'],
                        ['Bachillerato', 'Técnico Humanístico (BTH)'],
                        ['Carreras', 'Electricidad / Secretariado'],
                      ].map(([clave, valor]) => (
                        <tr key={clave} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.5rem 0.25rem', color: 'var(--text-muted)', fontWeight: '700', width: '45%' }}>{clave}</td>
                          <td style={{ padding: '0.5rem 0.25rem', color: 'var(--text-primary)', fontWeight: '600' }}>{valor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Plantilla docente */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--color-brand-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Plantilla Docente 
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { nivel: 'Nivel Inicial', maestros: 4, color: '#6366F1' },
                      { nivel: 'Nivel Primario', maestros: 20, color: 'var(--color-brand-cyan-muted)' },
                      { nivel: 'Nivel Secundario (BTH)', maestros: 16, color: 'var(--color-brand-gold)' },
                      { nivel: 'Personal Administrativo', maestros: 3, color: 'var(--color-success)' },
                    ].map(item => (
                      <div key={item.nivel}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.8125rem' }}>
                          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.nivel}</span>
                          <span style={{ color: item.color, fontWeight: '800' }}>{item.maestros} personas</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(item.maestros / 20) * 100}%`, backgroundColor: item.color, borderRadius: '99px', transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '1.5rem', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden' }}>
                    <img
                      src="/img/PlantelAdministrativo.jpeg"
                      alt="Plantel Administrativo"
                      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--border-radius-sm)', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación e historia */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {/* Mapa embed */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Ubicación
                  </h3>
                  <div style={{ borderRadius: 'var(--border-radius-sm)', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d947.3!2d-65.2408588!3d-16.9951941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e44fccf9852c73%3A0x58afa85344fc4c76!2sColegio%20German%20Busch%20%22B%22!5e0!3m2!1ses!2sbo!4v1234567890"
                      width="100%"
                      height="200"
                      style={{ border: 0, display: 'block' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mapa U.E. Germán Busch B"
                    />
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span><b>Dirección:</b> 2Q35+WMC, Shinahota, Bolivia</span>
                    <span><b>Municipio:</b> Shinahota • Provincia Tiraque</span>
                    <span><b>Departamento:</b> Cochabamba, Bolivia</span>
                    <a
                      href="https://maps.app.goo.gl/QS8SQA6X8BByZuZa7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ marginTop: '0.5rem', fontSize: '0.8125rem', padding: '0.5rem 1rem', textDecoration: 'none' }}
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                </div>

                {/* Reseña histórica */}
                <div className="glass-card" style={{ padding: '1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Reseña Histórica
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <p>
                      El <b style={{ color: 'var(--color-brand-cyan-muted)' }}>26 de abril de 1993</b> se obtuvo la Resolución Ministerial que legalizaba el
                      funcionamiento de los niveles Intermedio y Medio bajo la supervisión del Supervisor Regional Rural Chapáre Tropical,
                      Prof. Leónidas Torres Luján, siendo director el Prof. Pedro Cruz Flores.
                    </p>
                    <p>
                      La primera Junta Escolar de Padres de Familia estuvo presidida por Manuel Henry Flores.
                      La <b style={{ color: 'var(--color-brand-gold)' }}>primera Promoción</b> se graduó en 1994 con 9 estudiantes bachilleres.
                    </p>
                    <p>
                      Cuenta con Resolución Administrativa N° 0752/2000 y Código SIE: 80830066. Tiene sus tres niveles
                      Inicial, Primario y Secundario, perteneciente al área curricular de Educación REGULAR, de dependencia CONVENIO.
                    </p>
                    <p>
                      En 2019, en ocasión de celebrar los XXVI años de vida institucional, fue reconocida por la <b>Asamblea Legislativa
                      Departamental de Cochabamba</b> mediante la <b style={{ color: 'var(--color-brand-cyan-muted)' }}>Ley N° 147/2018-2019</b> por su
                      aporte a la educación de la región.
                    </p>
                    <p>
                      Actualmente es consolidada como <b>Bachillerato Técnico Humanístico (BTH)</b> con dos carreras:
                      <b style={{ color: 'var(--color-brand-gold)' }}>Electricidad</b> y <b style={{ color: 'var(--color-brand-gold)' }}>Secretariado</b>.
                    </p>
                  </div>
                </div>
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

                {/* Tarjeta de Información Institucional */}
                <div className="contact-card-info">
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Oficina de Dirección</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>U.E. Germán Busch “B” • Escuelas Populares Don Bosco</p>

                  <div className="contact-info-item">
                    <div className="contact-icon-wrapper"><MapPin size={18} /></div>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block' }}>Dirección Física</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        2Q35+WMC, Shinahota, Tiraque, Cochabamba, Bolivia
                      </span>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon-wrapper"><Phone size={18} /></div>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block' }}>Central Telefónica Escolar</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>(+591) Oficina Dirección EPDB</span>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon-wrapper"><Mail size={18} /></div>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block' }}>Correo de Soporte TI</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>soporte@prre.sistema.edu</span>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon-wrapper"><Globe size={18} /></div>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block' }}>Plataforma EPDB</span>
                      <a href="https://www.donbosco.edu.bo" target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '0.8125rem', color: 'var(--color-brand-cyan-muted)', textDecoration: 'none', fontWeight: '600' }}>
                        www.donbosco.edu.bo
                      </a>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: 'rgba(0,229,255,0.04)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      <b>Director:</b> José Antonio Mendizábal Maldonado<br />
                      <b>CIE:</b> 808300066<br />
                      <b>Cód. SIE:</b> 80830066
                    </p>
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
        {/* Encabezado Público */}
        <header className="public-header" style={estiloEncabezadoLanding}>
          <div className="app-header-group public-logo-lockup" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
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
            <div className="public-logo-lockup-text" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={estiloTextoLogoLanding}>PRRE</span>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                U.E. GERMAN BUSCH B
              </span>
            </div>
          </div>

          {/* Navegación de pestañas públicas */}
          <nav className="header-nav">
            <button onClick={() => setLandingTab('inicio')} className={`header-nav-link ${pestañaActualPublico === 'inicio' ? 'active' : ''}`}>Inicio</button>
            <button onClick={() => setLandingTab('nosotros')} className={`header-nav-link ${pestañaActualPublico === 'nosotros' ? 'active' : ''}`}>Sobre el Portal</button>
            <button onClick={() => setLandingTab('institucion')} className={`header-nav-link ${pestañaActualPublico === 'institucion' ? 'active' : ''}`}>Institución</button>
            <button onClick={() => setLandingTab('catalogo')} className={`header-nav-link ${pestañaActualPublico === 'catalogo' ? 'active' : ''}`}>Catálogo</button>
            <button onClick={() => setLandingTab('espacios')} className={`header-nav-link ${pestañaActualPublico === 'espacios' ? 'active' : ''}`}>Espacios</button>
            <button onClick={() => setLandingTab('faq')} className={`header-nav-link ${pestañaActualPublico === 'faq' ? 'active' : ''}`}>FAQ</button>
            <button onClick={() => setLandingTab('contacto')} className={`header-nav-link ${pestañaActualPublico === 'contacto' ? 'active' : ''}`}>Contacto</button>
          </nav>

          {/* Controles de autenticación y tema */}
          <div className="public-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
            <button 
              onClick={alternarTema} 
              className="public-theme-toggle"
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <Logo tamaño={28} />
            <div style={{ textAlign: 'left' }}>
              <b style={{ display: 'block', fontSize: '0.9rem' }}>U.E. Germán Busch “B”</b>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Escuelas Populares Don Bosco (EPDB)</span>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Shinahota, Tiraque, Cochabamba, Bolivia • &copy; 2026 Portal PRRE. Todos los derechos reservados.
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
                  { id: 'institucion', label: 'Institución' },
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
