import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
import AuthModal from './components/AuthModal';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RecursosModule from './components/RecursosModule';
import EspaciosModule from './components/EspaciosModule';
import ReservasModule from './components/ReservasModule';
import HistorialModule from './components/HistorialModule';
import RolesModule from './components/RolesModule';
import CatalogoRecursos from './components/CatalogoRecursos';
import { getEspacios } from './utils/mockData';
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
  BookOpen, 
  Info,
  Layers,
  Send,
  HelpCircle,
  FileText,
  AlertTriangle,
  X,
  UserCheck,
  CheckCircle,
  Menu
} from 'lucide-react';

function AppContent() {
  const { isAuthenticated, currentUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  
  const [showLoading, setShowLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  
  // Tab states
  const [currentTab, setCurrentTab] = useState('dashboard'); // System Tab (Logged In)
  const [landingTab, setLandingTab] = useState('inicio'); // Public Web Tab (Logged Out)

  // Redirect / Preselection states
  const [preselectedResource, setPreselectedResource] = useState(null);

  // Announcement Banner state
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // FAQ Accordion State
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Public Spaces state variable (Crash Fix)
  const [publicEspacios, setPublicEspacios] = useState([]);
  
  // Mobile public navigation drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load public spaces on mount and listen for DB updates
  useEffect(() => {
    setPublicEspacios(getEspacios());
    const handleUpdate = () => {
      setPublicEspacios(getEspacios());
    };
    window.addEventListener('prre_db_update', handleUpdate);
    return () => window.removeEventListener('prre_db_update', handleUpdate);
  }, []);

  const toggleFaq = (index) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      alert('¡Mensaje enviado con éxito! Nos pondremos en contacto con usted a la brevedad.');
    }, 800);
  };

  // Redirect Docente/Estudiante to booking form with resource selected
  const handleReserveRedirect = (recurso) => {
    setPreselectedResource({ ...recurso, tipoRecurso: 'recurso' });
    setCurrentTab('reservas');
  };

  // Redirect Docente/Estudiante to booking form with space selected
  const handleReserveRedirectSpace = (espacio) => {
    setPreselectedResource({ ...espacio, tipoRecurso: 'espacio' });
    setCurrentTab('reservas');
  };

  // 1. Loading Screen
  if (showLoading) {
    return <LoadingScreen onFinish={() => setShowLoading(false)} />;
  }

  // Logo component pointing to LogoPRRE.png
  const Logo = ({ size = 32 }) => (
    <img 
      src="/LogoPRRE.png" 
      alt="Logo PRRE U.E. Germán Busch B" 
      style={{ 
        width: `${size}px`, 
        height: 'auto', 
        display: 'block',
        filter: 'drop-shadow(0 2px 8px rgba(0, 229, 255, 0.2))' 
      }} 
    />
  );

  // 2. Landing Presentation Page (If Not Logged In)
  if (!isAuthenticated) {
    
    // Renders the selected public view content
    const renderPublicTab = () => {
      switch (landingTab) {
        // --- INICIO VIEW ---
        case 'inicio':
          return (
            <>
              {/* Hero Banner */}
              <section style={heroSectionStyle}>
                <div style={heroContentStyle}>
                  <div style={heroBadgeStyle}>
                    PORTAL DE RESERVAS • U. E. GERMÁN BUSCH B
                  </div>
                  <h1 style={heroTitleStyle}>
                    PRRE: <span className="gradient-text">Portal de Reserva</span> de Recursos Educativos
                  </h1>
                  <p style={heroSubtitleStyle}>
                    Un entorno tecnológico estandarizado diseñado en cooperación con las Escuelas Populares Don Bosco (EPDB) para optimizar el préstamo de laptops, proyectores, laboratorios y aulas virtuales.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                    <button 
                      onClick={() => { setAuthTab('login'); setAuthModalOpen(true); }}
                      className="btn btn-primary"
                      style={{ padding: '0.85rem 2.05rem', fontSize: '1rem' }}
                    >
                      Acceder al Portal
                    </button>
                    <button 
                      onClick={() => { setAuthTab('register'); setAuthModalOpen(true); }}
                      className="btn btn-secondary"
                      style={{ padding: '0.85rem 2.05rem', fontSize: '1rem' }}
                    >
                      Crear Cuenta Institucional
                    </button>
                  </div>
                </div>
              </section>

              {/* Statistics highlight Strip */}
              <section style={statsStripStyle}>
                <div style={statsStripGridStyle} className="grid-cols-4">
                  <div style={statsStripItemStyle}>
                    <span style={statsStripNumberStyle}>120+</span>
                    <span style={statsStripLabelStyle}>Usuarios Activos</span>
                  </div>
                  <div style={statsStripItemStyle}>
                    <span style={statsStripNumberStyle}>50+</span>
                    <span style={statsStripLabelStyle}>Equipos Tecnológicos</span>
                  </div>
                  <div style={statsStripItemStyle}>
                    <span style={statsStripNumberStyle}>5</span>
                    <span style={statsStripLabelStyle}>Laboratorios y Aulas</span>
                  </div>
                  <div style={statsStripItemStyle}>
                    <span style={statsStripNumberStyle}>98%</span>
                    <span style={statsStripLabelStyle}>Tasa de Aprobación</span>
                  </div>
                </div>
              </section>

              {/* Step-by-Step reservation guide */}
              <section style={guideSectionStyle}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                  <h2 className="text-center" style={{ fontSize: '1.75rem', marginBottom: '2.5rem' }}>
                    ¿Cómo solicitar tu reserva en <span style={{ color: 'var(--color-brand-cyan-muted)' }}>3 simples pasos</span>?
                  </h2>
                  <div className="grid-cols-4" style={{ gap: '2rem' }}>
                    <div style={guideItemStyle}>
                      <div style={guideNumberStyle}>1</div>
                      <h4 style={{ marginBottom: '0.5rem', fontWeight: '800' }}>Registra tu cuenta</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Crea una cuenta institucional con tu correo institucional y contraseña de acceso.
                      </p>
                    </div>

                    <div style={guideItemStyle}>
                      <div style={guideNumberStyle}>2</div>
                      <h4 style={{ marginBottom: '0.5rem', fontWeight: '800' }}>Selecciona tu recurso</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Explora el catálogo en tarjetas y presiona "Reservar Ahora" en el recurso o espacio de interés.
                      </p>
                    </div>

                    <div style={guideItemStyle}>
                      <div style={guideNumberStyle}>3</div>
                      <h4 style={{ marginBottom: '0.5rem', fontWeight: '800' }}>Recibe y Utiliza</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Una vez aprobada la reserva, asiste al laboratorio o recoge el dispositivo móvil en la administración.
                      </p>
                    </div>

                    <div style={guideItemStyle}>
                      <div style={{ ...guideNumberStyle, backgroundColor: 'var(--color-success)' }}>
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

              {/* Summary Features Section */}
              <section style={featuresSectionStyle}>
                <div className="grid-cols-4" style={{ maxWidth: '1200px', margin: '0 auto', gap: '1.5rem' }}>
                  <div className="glass-card text-center glow-card-cyan" style={featureCardStyle}>
                    <div style={featureIconContainerStyle('var(--color-brand-cyan-muted)')}>
                      <Laptop size={24} color="white" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Recursos de Clases</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Revisa la disponibilidad de proyectores multimedia, laptops HP y kits de robótica.
                    </p>
                  </div>

                  <div className="glass-card text-center glow-card-gold" style={featureCardStyle}>
                    <div style={featureIconContainerStyle('var(--color-brand-gold)')}>
                      <Calendar size={24} color="white" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Aulas & Laboratorios</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Agenda el laboratorio de computación, el laboratorio de física o auditorio sin cruces de horarios.
                    </p>
                  </div>

                  <div className="glass-card text-center glow-card-cyan" style={featureCardStyle}>
                    <div style={featureIconContainerStyle('var(--color-success)')}>
                      <ShieldCheck size={24} color="white" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Perfiles Jerárquicos</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Roles específicos para estudiantes y docentes con flujos de reserva simplificados.
                    </p>
                  </div>

                  <div className="glass-card text-center glow-card-gold" style={featureCardStyle}>
                    <div style={featureIconContainerStyle('#6366F1')}>
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

        // --- SOBRE NOSOTROS VIEW ---
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
                  <Logo size={70} />
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

        // --- PUBLIC CATALOG VIEW ---
        case 'catalogo':
          return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
              <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Catálogo Oficial de Recursos Educativos</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Revisa el listado activo de guías, laptops, kits y proyectores de la escuela. Para reservar, inicia sesión con tu cuenta institucional.
                </p>
              </div>
              <CatalogoRecursos isPublic={true} />
            </div>
          );

        // --- PUBLIC SPACES VIEW ---
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
                    {publicEspacios.map(esp => (
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

        // --- FAQ ACCORDION VIEW ---
        case 'faq':
          const faqs = [
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
                {faqs.map((faq, idx) => (
                  <div key={idx} className="faq-item" style={{ transition: 'all 0.3s ease' }}>
                    <button 
                      onClick={() => toggleFaq(idx)} 
                      className="faq-question-btn"
                    >
                      <span>{faq.q}</span>
                      {faqOpenIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {faqOpenIndex === idx && (
                      <div className="faq-answer-panel" style={{ animation: 'slideInDownFaq 0.25s ease-out' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );

        // --- CONTACT VIEW ---
        case 'contacto':
          return (
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1rem' }}>
              <div className="text-center" style={{ marginBottom: '3rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Centro de Contacto PRRE</h2>
                <p style={{ color: 'var(--text-secondary)' }}>¿Tiene algún problema con su cuenta institucional o desea reportar un desperfecto? Escríbanos.</p>
              </div>

              <div className="contact-layout">
                {/* Form Card */}
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Enviar Mensaje</h3>
                  <form onSubmit={handleContactSubmit}>
                    <div className="form-group">
                      <label className="form-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ej. María Quiroga" 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Correo Institucional</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="m.quiroga@colegio.edu.bo" 
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Detalle de la consulta / Reporte</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Escriba aquí los detalles..." 
                        rows="4"
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ gap: '0.5rem' }}>
                      <Send size={16} />
                      <span>Enviar Formulario</span>
                    </button>
                  </form>
                </div>

                {/* Info Card */}
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
      <div style={landingWrapperStyle}>
        {/* Public Announcement Bar */}
        {showAnnouncement && (
          <div style={announcementBarStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexGrow: 1, padding: '0 1rem' }}>
              <AlertTriangle size={16} />
              <span>
                <b>Aviso:</b> El sábado 12 de julio se realizará el mantenimiento preventivo anual de las laptops HP ProBook. Tomar previsiones.
              </span>
            </div>
            <button onClick={() => setShowAnnouncement(false)} style={announcementCloseButtonStyle}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Navigation Bar */}
        <header style={landingHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Mobile Hamburger Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="public-mobile-toggle"
              style={publicMobileToggleStyle}
              title="Abrir Menú"
            >
              <Menu size={20} />
            </button>

            <Logo size={36} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={landingLogoTextStyle}>PRRE</span>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                U.E. GERMAN BUSCH B
              </span>
            </div>
          </div>

          {/* Public Views Header Navigation Options */}
          <nav className="header-nav">
            <button 
              onClick={() => setLandingTab('inicio')}
              className={`header-nav-link ${landingTab === 'inicio' ? 'active' : ''}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => setLandingTab('nosotros')}
              className={`header-nav-link ${landingTab === 'nosotros' ? 'active' : ''}`}
            >
              Sobre el Portal
            </button>
            <button 
              onClick={() => setLandingTab('catalogo')}
              className={`header-nav-link ${landingTab === 'catalogo' ? 'active' : ''}`}
            >
              Catálogo de Recursos
            </button>
            <button 
              onClick={() => setLandingTab('espacios')}
              className={`header-nav-link ${landingTab === 'espacios' ? 'active' : ''}`}
            >
              Aulas & Espacios
            </button>
            <button 
              onClick={() => setLandingTab('faq')}
              className={`header-nav-link ${landingTab === 'faq' ? 'active' : ''}`}
            >
              Preguntas Frecuentes
            </button>
            <button 
              onClick={() => setLandingTab('contacto')}
              className={`header-nav-link ${landingTab === 'contacto' ? 'active' : ''}`}
            >
              Contacto
            </button>
          </nav>

          {/* Authentication & Theme Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleTheme} 
              style={landingThemeToggleButtonStyle} 
              title="Cambiar Tema"
            >
              {isDark ? <Sun size={18} color="#FF9F1C" /> : <Moon size={18} color="#00B4D8" />}
            </button>

            <button 
              onClick={() => { setAuthTab('login'); setAuthModalOpen(true); }}
              className="btn btn-secondary"
            >
              Iniciar Sesión
            </button>
            
            <button 
              onClick={() => { setAuthTab('register'); setAuthModalOpen(true); }}
              className="btn btn-primary"
            >
              Crear Cuenta
            </button>
          </div>
        </header>

        {/* Public View Body */}
        <main style={{ flexGrow: 1 }}>
          {renderPublicTab()}
        </main>

        {/* Footer */}
        <footer style={landingFooterStyle}>
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

        {/* Auth Modals */}
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          initialTab={authTab} 
        />

        {/* Mobile Navigation Drawer Overlay (Completeness Support) */}
        {mobileMenuOpen && (
          <>
            <div 
              onClick={() => setMobileMenuOpen(false)}
              style={mobileMenuBackdropStyle}
            />
            <div style={mobileMenuDrawerStyle}>
              <div style={mobileMenuDrawerHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Logo size={28} />
                  <span style={{ fontWeight: '800', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Menú Público</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={mobileMenuCloseButtonStyle}>
                  <X size={20} />
                </button>
              </div>
              
              <nav style={mobileMenuNavStyle}>
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
                      setMobileMenuOpen(false);
                    }}
                    style={mobileMenuNavLinkStyle(landingTab === item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                <button 
                  onClick={() => { setAuthTab('login'); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                  className="btn btn-secondary w-full"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => { setAuthTab('register'); setAuthModalOpen(true); setMobileMenuOpen(false); }}
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

  // 3. Portal Dashboard Area (If Logged In)
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} />;
      case 'recursos':
        return <RecursosModule onReserveRedirect={handleReserveRedirect} />;
      case 'espacios':
        return <EspaciosModule onReserveRedirect={handleReserveRedirectSpace} />;
      case 'reservas':
        return (
          <ReservasModule 
            preselectedItem={preselectedResource} 
            onClearPreselected={() => setPreselectedResource(null)} 
          />
        );
      case 'historial':
        return <HistorialModule />;
      case 'roles':
        if (currentUser?.rol !== 'Administrador') {
          setCurrentTab('dashboard');
          return <Dashboard setCurrentTab={setCurrentTab} />;
        }
        return <RolesModule />;
      default:
        return <Dashboard setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderTabContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

// Inline Styles for Landing components
const landingWrapperStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--bg-primary)',
};

const landingHeaderStyle = {
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

const landingLogoTextStyle = {
  fontSize: '1.35rem',
  fontWeight: '800',
  letterSpacing: '0.05em',
  background: 'linear-gradient(135deg, var(--color-brand-cyan), var(--color-brand-gold))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1'
};

const landingThemeToggleButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  border: '1px solid var(--border-color)',
};

const heroSectionStyle = {
  padding: '5rem 2rem 4rem 2rem',
  textAlign: 'center',
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at top, rgba(0, 229, 255, 0.04) 0%, transparent 70%)',
};

const heroContentStyle = {
  maxWidth: '850px',
  width: '100%',
};

const heroBadgeStyle = {
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

const heroTitleStyle = {
  fontSize: '3.25rem',
  fontWeight: '850',
  lineHeight: '1.15',
  color: 'var(--text-primary)',
  marginBottom: '1.5rem',
  letterSpacing: '-0.02em',
};

const heroSubtitleStyle = {
  fontSize: '1.125rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.65',
  marginBottom: '2.5rem',
  maxWidth: '720px',
  margin: '0 auto 2.5rem auto'
};

const featuresSectionStyle = {
  padding: '4rem 2rem',
  backgroundColor: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border-color)',
  borderBottom: '1px solid var(--border-color)',
};

const featureCardStyle = {
  padding: '2rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const featureIconContainerStyle = (color) => ({
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

const landingFooterStyle = {
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: 'var(--bg-primary)',
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  borderTop: '1px solid var(--border-color)'
};

/* Additional Style Components (Completeness Additions) */
const announcementBarStyle = {
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

const announcementCloseButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#070B13',
  display: 'flex',
  alignItems: 'center',
  padding: '0.125rem',
};

const statsStripStyle = {
  backgroundColor: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border-color)',
  borderBottom: '1px solid var(--border-color)',
  padding: '2rem 1rem',
};

const statsStripGridStyle = {
  maxWidth: '1000px',
  margin: '0 auto',
  gap: '1.5rem',
  textAlign: 'center',
};

const statsStripItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const statsStripNumberStyle = {
  fontSize: '2rem',
  fontWeight: '900',
  color: 'var(--color-brand-cyan-muted)',
  letterSpacing: '-0.02em',
  lineHeight: '1',
  marginBottom: '0.25rem',
  filter: 'drop-shadow(0 2px 8px rgba(0, 229, 255, 0.15))'
};

const statsStripLabelStyle = {
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  fontWeight: '600',
};

const guideSectionStyle = {
  padding: '5rem 2rem',
  backgroundColor: 'var(--bg-primary)',
};

const guideItemStyle = {
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

const guideNumberStyle = {
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

/* Mobile Responsive Drawer Overlay Styles */
const mobileMenuBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(5, 8, 16, 0.45)',
  backdropFilter: 'blur(4px)',
  zIndex: 1400,
};

const mobileMenuDrawerStyle = {
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

const mobileMenuDrawerHeaderStyle = {
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const mobileMenuCloseButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const mobileMenuNavStyle = {
  padding: '1.5rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
};

const mobileMenuNavLinkStyle = (isActive) => ({
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--border-radius-sm)',
  background: isActive ? 'rgba(0, 229, 255, 0.08)' : 'none',
  border: 'none',
  color: isActive ? 'var(--color-brand-cyan-muted)' : 'var(--text-primary)',
  textAlign: 'left',
  fontWeight: '700',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

const publicMobileToggleStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  padding: '0.35rem',
  borderRadius: 'var(--border-radius-sm)',
  display: 'none',
  alignItems: 'center',
};

// Add responsive media query styles dynamically
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
