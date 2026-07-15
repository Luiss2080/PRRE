import React, { useState } from 'react';
import { useAutenticacion } from '../context/ContextoAutenticacion';
import { useTema } from '../context/ContextoTema';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  CalendarCheck, 
  History, 
  Users, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Bell, 
  ChevronLeft,
  AlertCircle,
  HelpCircle,
  Clock,
  User,
  Settings
} from 'lucide-react';

/**
 * DisenoEstructura
 * Componente contenedor principal que define el marco visual (Layout) de la aplicación,
 * incluyendo la barra de navegación superior (Navbar) y el panel lateral colapsable (Sidebar/Drawer).
 */
export default function DisenoEstructura({ children, pestañaActual, establecerPestañaActiva }) {
  const { usuarioActual, cerrarSesion } = useAutenticacion();
  const { alternarTema, esOscuro } = useTema();
  const [menuLateralAbierto, setMenuLateralAbierto] = useState(false);
  const [mostrarMenuPerfil, setMostrarMenuPerfil] = useState(false);
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false);
  const [modalConfigAbierto, setModalConfigAbierto] = useState(false);
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [recibirAlertas, setRecibirAlertas] = useState(true);

  const alGuardarConfiguracion = (e) => {
    e.preventDefault();
    if (nuevoPassword !== confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    if (nuevoPassword.trim().length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    
    const usuarioActualizado = { ...usuarioActual, password: nuevoPassword };
    const usuarios = JSON.parse(localStorage.getItem('prre_usuarios') || '[]');
    const idx = usuarios.findIndex(u => u.id === usuarioActual.id);
    if (idx !== -1) {
      usuarios[idx].password = nuevoPassword;
      localStorage.setItem('prre_usuarios', JSON.stringify(usuarios));
    }
    
    localStorage.setItem('prre_session', JSON.stringify(usuarioActualizado));
    localStorage.setItem('prre_notif_alertas', recibirAlertas ? 'true' : 'false');
    
    alert('Configuración guardada exitosamente.');
    setModalConfigAbierto(false);
    setNuevoPassword('');
    setConfirmarPassword('');
  };

  // Definición de las opciones del menú de navegación según el rol
  const opcionesMenu = [
    { id: 'dashboard', etiqueta: 'Inicio', icono: LayoutDashboard, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'recursos', etiqueta: 'Recursos', icono: Package, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'espacios', etiqueta: 'Espacios', icono: MapPin, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'reservas', etiqueta: 'Reservar', icono: CalendarCheck, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'historial', etiqueta: 'Historial', icono: History, roles: ['Administrador', 'Docente'] },
    { id: 'roles', etiqueta: 'Usuarios & Roles', icono: Users, roles: ['Administrador'] },
  ];

  // Filtra las opciones de navegación que el rol del usuario tiene permitido ver
  const opcionesMenuFiltradas = opcionesMenu.filter(opcion => 
    usuarioActual && opcion.roles.includes(usuarioActual.rol)
  );

  const alternarMenuLateral = () => setMenuLateralAbierto(!menuLateralAbierto);
  const cerrarMenuLateral = () => setMenuLateralAbierto(false);

  // Componente interno para renderizar el logo institucional
  const ImagenLogo = ({ tamaño = 32 }) => (
    <img 
      src="/LogoPRRE.png" 
      alt="Logo PRRE U.E. Germán Busch B" 
      style={{ 
        width: `${tamaño}px`, 
        height: 'auto', 
        display: 'block',
        filter: 'drop-shadow(0 2px 8px rgba(0, 229, 255, 0.2))' 
      }} 
    />
  );

  return (
    <div className="app-container">
      {/* Barra de Navegación Superior */}
      <header style={estiloEncabezado}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Botón de alternancia de la barra lateral (Desktop/Móvil) */}
          <button onClick={alternarMenuLateral} style={estiloBotonAlternarSidebar(menuLateralAbierto)} title="Información y Soporte">
            {menuLateralAbierto ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
          
          <div style={estiloContenedorLogo}>
            <ImagenLogo tamaño={32} />
            <div style={estiloEnvolturaTitulo}>
              <span style={estiloTextoLogo}>PRRE</span>
              <span style={estiloSubtituloLogo}>Portal de Reserva</span>
            </div>
          </div>

          {/* Menú de navegación horizontal para computadoras de escritorio */}
          <nav className="header-nav">
            {opcionesMenuFiltradas.map(opcion => {
              const Icono = opcion.icono;
              const estaActivo = pestañaActual === opcion.id;
              return (
                <button
                  key={opcion.id}
                  onClick={() => establecerPestañaActiva(opcion.id)}
                  className={`header-nav-link ${estaActivo ? 'active' : ''}`}
                >
                  <Icono size={16} />
                  <span>{opcion.etiqueta}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Controles de la parte derecha del encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Botón para cambiar el Tema visual */}
          <button 
            onClick={alternarTema} 
            style={estiloAlternarTemaEncabezado} 
            title={esOscuro ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
          >
            {esOscuro ? <Sun size={18} color="#FF9F1C" /> : <Moon size={18} color="#00B4D8" />}
          </button>

          {/* Icono de Campana de Notificaciones */}
          <div style={estiloContenedorCampanaNotificacion}>
            <button style={estiloBotonIconoEncabezado}>
              <Bell size={18} />
            </button>
            <div style={estiloPuntoNotificacionRojo} />
          </div>

          {/* Perfil del usuario y menú desplegable */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setMostrarMenuPerfil(!mostrarMenuPerfil)}
              style={estiloBotonPerfilEncabezado}
            >
              <div style={estiloAvatarEncabezado}>
                <User size={16} color="white" />
              </div>
              <div style={estiloEnvolturaNombrePerfil}>
                <span style={estiloNombrePerfilEncabezado}>{usuarioActual?.nombre}</span>
                <span style={estiloRolPerfilEncabezado}>{usuarioActual?.rol}</span>
              </div>
            </button>

            {mostrarMenuPerfil && (
              <>
                {/* Capa invisible para cerrar el menú haciendo clic afuera */}
                <div 
                  onClick={() => setMostrarMenuPerfil(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                />
                <div style={estiloMenuPerfil}>
                  <div style={estiloCabeceraMenuPerfil}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <div style={{ ...estiloAvatarEncabezado, width: '36px', height: '36px', minWidth: '36px', backgroundColor: 'var(--color-brand-cyan-muted)', cursor: 'default' }}>
                        <User size={18} color="white" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usuarioActual?.nombre}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usuarioActual?.email}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />
                  
                  {/* Opciones del Desplegable */}
                  <button 
                    onClick={() => {
                      setMostrarMenuPerfil(false);
                      setModalPerfilAbierto(true);
                    }}
                    className="profile-menu-row"
                    style={estiloFilaMenuPerfil}
                  >
                    <User size={14} color="var(--color-brand-cyan-muted)" />
                    <span>Mi Perfil</span>
                  </button>

                  <button 
                    onClick={() => {
                      setMostrarMenuPerfil(false);
                      setModalConfigAbierto(true);
                    }}
                    className="profile-menu-row"
                    style={estiloFilaMenuPerfil}
                  >
                    <Settings size={14} color="var(--color-brand-gold)" />
                    <span>Configuración</span>
                  </button>

                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />
                  
                  <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <span>Rol Actual:</span>
                    <span className="badge badge-info" style={{ fontSize: '0.625rem', padding: '0.2rem 0.5rem' }}>{usuarioActual?.rol}</span>
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />
                  
                  <button 
                    onClick={() => {
                      setMostrarMenuPerfil(false);
                      cerrarSesion();
                    }}
                    style={estiloLogoutMenuPerfil}
                  >
                    <LogOut size={14} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Contenedor del Cuerpo Principal con la barra lateral colapsable */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative', minHeight: `calc(100vh - var(--header-height))` }}>
        {/* Barra lateral colapsable (Panel Drawer) */}
        <aside style={estiloMenuLateralDrawer(menuLateralAbierto)}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              {/* Encabezado del panel lateral */}
              <div style={estiloCabeceraSidebar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ImagenLogo tamaño={24} />
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '850' }}>U.E. Germán Busch B</h3>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-brand-cyan-muted)', fontWeight: '700' }}>Panel del Operador</span>
                  </div>
                </div>
                <button onClick={cerrarMenuLateral} style={estiloBotonCerrarSidebar}>
                  <X size={16} />
                </button>
              </div>

              {/* Enlace de navegación para móviles o cuando se abre el panel lateral */}
              <div className="sidebar-nav-menu" style={{ display: 'block', padding: '1rem 0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={estiloTituloSeccionSidebar}>Navegación</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                  {opcionesMenuFiltradas.map(opcion => {
                    const Icono = opcion.icono;
                    const estaActivo = pestañaActual === opcion.id;
                    return (
                      <button
                        key={opcion.id}
                        onClick={() => {
                          establecerPestañaActiva(opcion.id);
                          cerrarMenuLateral();
                        }}
                        style={estiloItemNavegacionMovil(estaActivo)}
                      >
                        <Icono size={16} />
                        <span>{opcion.etiqueta}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Telemetría y estadísticas de los recursos en la barra lateral */}
              <div style={{ padding: '1rem' }}>
                <span style={estiloTituloSeccionSidebar}>Monitoreo del Sistema</span>
                
                <div style={estiloTarjetaTelemetria}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Recursos Operativos</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-cyan)', fontWeight: '700' }}>95%</span>
                  </div>
                  <div style={estiloContenedorProgreso}>
                    <div style={{ ...estiloBarraProgreso, width: '95%', backgroundColor: 'var(--color-brand-cyan)' }} />
                  </div>
                </div>

                <div style={estiloTarjetaTelemetria}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Espacios Disponibles</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-gold)', fontWeight: '700' }}>75%</span>
                  </div>
                  <div style={estiloContenedorProgreso}>
                    <div style={{ ...estiloBarraProgreso, width: '75%', backgroundColor: 'var(--color-brand-gold)' }} />
                  </div>
                </div>

                {/* Historial de alertas recientes */}
                <span style={{ ...estiloTituloSeccionSidebar, marginTop: '1.5rem', display: 'block' }}>Alertas Recientes</span>
                <div style={estiloHistorialAlertas}>
                  <div style={estiloTarjetaAlertaFeed}>
                    <AlertCircle size={14} color="var(--color-brand-gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                      <b>Kit Robótica 5</b> en mantenimiento hasta el lunes.
                    </p>
                  </div>
                  <div style={estiloTarjetaAlertaFeed}>
                    <Clock size={14} color="var(--color-brand-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                      <b>Lab Computación B</b> reservado para exámenes de las 14:00.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Soporte Técnico en el pie de página de la barra lateral */}
            <div style={estiloPiePaginaSidebar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                <HelpCircle size={16} color="var(--color-brand-cyan)" />
                <div>
                  <span style={{ fontWeight: '700', display: 'block' }}>Soporte Técnico</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Telf: 2-224455 (EPDB)</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenedor dinámico del cuerpo de las páginas. Cambia su margen cuando se despliega la barra lateral */}
        <div style={estiloContenedorCuerpo(menuLateralAbierto)} className="body-wrapper">
          {/* Contenido dinámico del componente */}
          <main className="page-body" style={{ flexGrow: 1 }}>
            {children}
          </main>

          {/* Pie de página institucional enriquecido respetando la barra lateral */}
          <footer style={estiloPiePaginaFijo}>
            <div style={estiloContenidoFooterGrid}>
              {/* Columna 1: Escuela y Misión */}
              <div style={estiloColumnaFooter}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ImagenLogo tamaño={24} />
                  <b style={{ fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>PORTAL PRRE</b>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', maxWidth: '320px' }}>
                  Optimización digital del préstamo de laptops, proyectores y laboratorios didácticos para la U.E. Germán Busch B, en cooperación con las Escuelas Populares Don Bosco (EPDB).
                </p>
              </div>

              {/* Columna 2: Enlaces del Portal */}
              <div style={estiloColumnaFooter}>
                <h4 style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Módulos del Sistema
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                  <span style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => establecerPestañaActiva('dashboard')}>Panel de Inicio</span>
                  <span style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => establecerPestañaActiva('recursos')}>Catálogo de Recursos</span>
                  <span style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => establecerPestañaActiva('espacios')}>Aulas & Laboratorios</span>
                  <span style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => establecerPestañaActiva('reservas')}>Solicitar Préstamo</span>
                </div>
              </div>

              {/* Columna 3: Información de Soporte */}
              <div style={estiloColumnaFooter}>
                <h4 style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Soporte y Contacto
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <b>Oficina TI:</b> Bloque Norte, Planta Baja<br />
                  <b>Línea Directa:</b> 2-224455 (Ext. 104)<br />
                  <b>Correo:</b> ti.soporte@colegio.edu.bo
                </p>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0 0.75rem 0' }} />
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              &copy; 2026 U.E. Germán Busch B • Convenio Escuelas Populares Don Bosco. Todos los derechos reservados.
            </div>
          </footer>
        </div>
      </div>

      {/* Modal de Mi Perfil */}
      {modalPerfilAbierto && (
        <div style={estiloOverlayModal}>
          <div className="glass-card" style={estiloTarjetaModal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <User size={20} color="var(--color-brand-cyan-muted)" />
                Mi Perfil de Operador
              </h3>
              <button onClick={() => setModalPerfilAbierto(false)} style={estiloBotonCerrarModal}>
                <X size={18} />
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-brand-cyan-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow-cyan)' }}>
                <User size={30} color="white" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 0.25rem 0' }}>{usuarioActual?.nombre}</h4>
                <span className="badge badge-info" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>{usuarioActual?.rol}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Correo Electrónico:</span>
                <b style={{ color: 'var(--text-primary)' }}>{usuarioActual?.email}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estado de Cuenta:</span>
                <b style={{ color: 'var(--color-success)' }}>Activa / Operativa</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Institución:</span>
                <b style={{ color: 'var(--text-primary)' }}>U.E. Germán Busch B</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Base de datos:</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-gold)', fontWeight: '700' }}>Local (Simulada / LocalStorage)</span>
              </div>
            </div>

            <button onClick={() => setModalPerfilAbierto(false)} className="btn btn-secondary w-full" style={{ padding: '0.5rem 1rem' }}>
              Cerrar Vista
            </button>
          </div>
        </div>
      )}

      {/* Modal de Configuración */}
      {modalConfigAbierto && (
        <div style={estiloOverlayModal}>
          <div className="glass-card" style={estiloTarjetaModal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Settings size={20} color="var(--color-brand-gold)" />
                Configuración del Sistema
              </h3>
              <button onClick={() => setModalConfigAbierto(false)} style={estiloBotonCerrarModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={alGuardarConfiguracion}>
              {/* Sección Alertas */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', marginBottom: '0.75rem' }}>Preferencias de Notificación</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input 
                    type="checkbox" 
                    checked={recibirAlertas}
                    onChange={(e) => setRecibirAlertas(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span>Recibir alertas sonoras y de sistema en tiempo real</span>
                </label>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }} />

              {/* Sección Contraseña */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', marginBottom: '0.75rem' }}>Cambiar Contraseña de Ingreso</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Nueva Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      style={{ width: '100%', fontSize: '0.875rem' }}
                      value={nuevoPassword}
                      onChange={(e) => setNuevoPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Confirmar Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      style={{ width: '100%', fontSize: '0.875rem' }}
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      placeholder="Repita la nueva contraseña"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalConfigAbierto(false)} className="btn btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos CSS en línea para la estructura principal
const estiloEncabezado = {
  height: 'var(--header-height)',
  backgroundColor: 'var(--bg-secondary)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1.5rem',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  boxShadow: 'var(--shadow-sm)',
};

const estiloBotonAlternarSidebar = (estaAbierto) => ({
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: 'var(--border-radius-sm)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: estaAbierto ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
  transition: 'all 0.2s ease',
  marginRight: '0.5rem',
});

const estiloContenedorLogo = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const estiloEnvolturaTitulo = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const estiloTextoLogo = {
  fontSize: '1.35rem',
  fontWeight: '800',
  letterSpacing: '0.05em',
  background: 'linear-gradient(135deg, var(--color-brand-cyan), var(--color-brand-gold))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1',
};

const estiloSubtituloLogo = {
  fontSize: '0.625rem',
  color: 'var(--text-muted)',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginTop: '0.15rem',
};

const estiloAlternarTemaEncabezado = {
  background: 'none',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  border: '1px solid var(--border-color)',
  transition: 'all 0.2s',
};

const estiloBotonIconoEncabezado = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s',
};

const estiloContenedorCampanaNotificacion = {
  position: 'relative',
};

const estiloPuntoNotificacionRojo = {
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '8px',
  height: '8px',
  backgroundColor: 'var(--color-danger)',
  borderRadius: '50%',
  border: '2px solid var(--bg-secondary)',
  boxShadow: '0 0 5px var(--color-danger)',
};

const estiloBotonPerfilEncabezado = {
  background: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  cursor: 'pointer',
  padding: '0.35rem 0.75rem',
  borderRadius: 'var(--border-radius-md)',
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  border: '1px solid var(--border-color)',
  transition: 'all 0.2s',
};

const estiloAvatarEncabezado = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#00b4d8',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '800',
  fontSize: '0.8125rem',
  boxShadow: '0 2px 8px rgba(0, 180, 216, 0.2)',
};

const estiloEnvolturaNombrePerfil = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
};

const estiloNombrePerfilEncabezado = {
  fontSize: '0.8125rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
};

const estiloRolPerfilEncabezado = {
  fontSize: '0.625rem',
  color: 'var(--color-brand-gold)',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const estiloMenuPerfil = {
  position: 'absolute',
  right: 0,
  top: '45px',
  backgroundColor: 'var(--bg-secondary-solid)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-lg)',
  width: '220px',
  zIndex: 1500,
  overflow: 'hidden',
  animation: 'scaleUp 0.15s ease-out',
};

const estiloCabeceraMenuPerfil = {
  padding: '0.85rem 1rem',
  display: 'flex',
  flexDirection: 'column',
};

const estiloLogoutMenuPerfil = {
  width: '100%',
  padding: '0.85rem 1rem',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  color: 'var(--color-danger)',
  fontSize: '0.875rem',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'background-color 0.2s',
};

// Panel Lateral (Sidebar Drawer)
const estiloMenuLateralDrawer = (estaAbierto) => ({
  width: 'var(--sidebar-width)',
  height: `calc(100vh - var(--header-height))`,
  backgroundColor: 'var(--bg-sidebar)',
  color: 'white',
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 900,
  borderRight: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '1.25rem 1rem',
  transform: estaAbierto ? 'translateX(0)' : 'translateX(-100%)',
  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
});

const estiloCabeceraSidebar = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: '1rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
};

const estiloBotonCerrarSidebar = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  padding: '0.25rem',
};

const estiloTituloSeccionSidebar = {
  fontSize: '0.6875rem',
  color: 'rgba(255, 255, 255, 0.4)',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  display: 'block',
  marginBottom: '0.75rem',
};

const estiloTarjetaTelemetria = {
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '0.75rem',
  borderRadius: 'var(--border-radius-sm)',
  marginBottom: '0.75rem',
};

const estiloContenedorProgreso = {
  width: '100%',
  height: '5px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: '10px',
  overflow: 'hidden',
};

const estiloBarraProgreso = {
  height: '100%',
  borderRadius: '10px',
};

const estiloHistorialAlertas = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
};

const estiloTarjetaAlertaFeed = {
  display: 'flex',
  gap: '0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
  padding: '0.625rem',
  borderRadius: 'var(--border-radius-sm)',
};

const estiloPiePaginaSidebar = {
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  paddingTop: '1rem',
};

const estiloContenedorCuerpo = (estaAbierto) => ({
  flexGrow: 1,
  paddingLeft: estaAbierto ? 'var(--sidebar-width)' : '0',
  transition: 'padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const estiloItemNavegacionMovil = (estaActivo) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.625rem 0.85rem',
  borderRadius: 'var(--border-radius-sm)',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '0.8125rem',
  fontWeight: '600',
  backgroundColor: estaActivo ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
  color: estaActivo ? 'var(--color-brand-cyan)' : 'rgba(255, 255, 255, 0.8)',
});

const estiloPiePaginaFijo = {
  padding: '1.25rem 1.5rem 1rem 1.5rem',
  backgroundColor: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border-color)',
  marginTop: 'auto',
  width: '100%',
  zIndex: 100,
  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
};

const estiloContenidoFooterGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.25rem',
  maxWidth: '1400px',
  margin: '0 auto',
  textAlign: 'left',
  width: '100%',
};

const estiloColumnaFooter = {
  display: 'flex',
  flexDirection: 'column',
};

// Inyección de la clase responsiva del menú en CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .body-wrapper {
        padding-left: 0 !important;
      }
      aside {
        z-index: 1200 !important;
        height: 100vh !important;
        position: fixed !important;
      }
    }
    .profile-menu-row:hover {
      background-color: rgba(255, 255, 255, 0.04) !important;
      color: var(--text-primary) !important;
    }
  `;
  document.head.appendChild(style);
}

const estiloFilaMenuPerfil = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.65rem 1rem',
  border: 'none',
  background: 'none',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  transition: 'all 0.2s ease',
};

const estiloOverlayModal = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000,
  padding: '1rem',
};

const estiloTarjetaModal = {
  maxWidth: '450px',
  width: '100%',
  padding: '1.75rem',
  background: 'var(--bg-secondary)',
  borderRadius: 'var(--border-radius-lg)',
  boxShadow: 'var(--shadow-xl)',
  border: '1px solid var(--border-color)',
};

const estiloBotonCerrarModal = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '0.25rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
};
