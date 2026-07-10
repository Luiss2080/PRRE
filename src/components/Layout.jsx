import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Clock,
  User as UserIcon
} from 'lucide-react';

export default function Layout({ children, currentTab, setCurrentTab }) {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'recursos', label: 'Recursos', icon: Package, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'espacios', label: 'Espacios', icon: MapPin, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'reservas', label: 'Reservar', icon: CalendarCheck, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'historial', label: 'Historial', icon: History, roles: ['Administrador', 'Docente'] },
    { id: 'roles', label: 'Usuarios & Roles', icon: Users, roles: ['Administrador'] },
  ];

  // Filter items by role
  const filteredMenuItems = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.rol)
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // High Fidelity SVG Shield Logo representing U.E. Germán Busch B 1993 epdb
  const ShieldLogo = ({ size = 36 }) => (
    <svg 
      width={size} 
      height={size * 1.15} 
      viewBox="0 0 100 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 2px 8px rgba(0, 229, 255, 0.2))' }}
    >
      {/* Outer Shield Border */}
      <path d="M50 5 L90 20 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V20 L50 5 Z" fill="#070B13" stroke="#FF9F1C" strokeWidth="4" />
      
      {/* Left section (Gold gradient) */}
      <path d="M50 5 L10 20 V65 C10 82.5 28 99.5 45 109 C48 102 50 92 50 80 V5 Z" fill="url(#leftGold)" opacity="0.95" />
      
      {/* Bottom-right section (Vibrant Blue) */}
      <path d="M50 80 C50 92 52 102 55 109 C72 99.5 90 82.5 90 65 V20 L50 5 V80 Z" fill="#0077B6" opacity="0.85" />
      
      {/* Central Portrait (Sky blue circle + silhouette) */}
      <circle cx="50" cy="50" r="22" fill="#00B4D8" stroke="#FF9F1C" strokeWidth="2.5" />
      
      {/* Silhouette of military officer */}
      <path d="M50 38 C53 38 55 40 55 43 C55 47 53 50 50 50 C47 50 45 47 45 43 C45 40 47 38 50 38 Z" fill="#070B13" />
      <path d="M36 65 C36 57 42 53 50 53 C58 53 64 57 64 65 H36 Z" fill="#070B13" />
      <circle cx="50" cy="59" r="2" fill="#FF9F1C" />
      
      {/* Top book with feather */}
      <path d="M38 18 C38 16 44 15 50 17 C56 15 62 16 62 18 V26 C62 24 56 23 50 25 C44 23 38 24 38 26 V18 Z" fill="#FF9F1C" />
      <path d="M54 13 L60 21" stroke="#E65F00" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* EPDB lettering logo at the bottom */}
      <g transform="translate(28, 85)">
        <text x="0" y="15" fill="#EF4444" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="900">e</text>
        <text x="11" y="15" fill="#FF9F1C" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="900">p</text>
        <text x="23" y="15" fill="#3B82F6" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="900">d</text>
        <text x="35" y="15" fill="#10B981" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="900">b</text>
      </g>

      <defs>
        <linearGradient id="leftGold" x1="10" y1="5" x2="50" y2="109" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9F1C" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="app-container">
      {/* Main header standard navigation */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Collapsible Sidebar Toggler (Desktop/Mobile) */}
          <button onClick={toggleSidebar} style={sidebarToggleButtonStyle(sidebarOpen)} title="Información y Soporte">
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
          
          <div style={logoContainerStyle}>
            <ShieldLogo size={32} />
            <div style={titleWrapperStyle}>
              <span style={logoTextStyle}>PRRE</span>
              <span style={logoSubtitleStyle}>Portal de Reserva</span>
            </div>
          </div>

          {/* Desktop Navigation Links directly in the Header */}
          <nav className="header-nav">
            {filteredMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`header-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Theme Switcher Toggle (Vibrant sun/moon toggle button in header) */}
          <button 
            onClick={toggleTheme} 
            style={headerThemeToggleStyle} 
            title={isDark ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
          >
            {isDark ? <Sun size={18} color="#FF9F1C" /> : <Moon size={18} color="#00B4D8" />}
          </button>

          {/* Notifications */}
          <div style={notificationBadgeContainerStyle}>
            <button style={headerIconButtonStyle}>
              <Bell size={18} />
            </button>
            <div style={redDotStyle} />
          </div>

          {/* User profile dropdown button */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={headerProfileButtonStyle}
            >
              <div style={headerAvatarStyle}>
                {currentUser?.nombre ? currentUser.nombre.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <div style={profileNameWrapperStyle}>
                <span style={headerProfileNameStyle}>{currentUser?.nombre}</span>
                <span style={headerProfileRoleStyle}>{currentUser?.rol}</span>
              </div>
            </button>

            {showProfileMenu && (
              <>
                <div 
                  onClick={() => setShowProfileMenu(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                />
                <div style={profileMenuStyle}>
                  <div style={profileMenuHeaderStyle}>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{currentUser?.nombre}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser?.email}</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />
                  <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <span>Rol Actual:</span>
                    <span className="badge badge-info" style={{ fontSize: '0.625rem', padding: '0.2rem 0.5rem' }}>{currentUser?.rol}</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    style={profileMenuLogoutItemStyle}
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

      {/* Main Container including Collapsible Drawer & View Body */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative', minHeight: `calc(100vh - var(--header-height))` }}>
        {/* Drawer Sidebar - Collapsible Side Panel */}
        <aside style={sidebarDrawerStyle(sidebarOpen)}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              {/* Drawer header */}
              <div style={sidebarDrawerHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldLogo size={24} />
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: '800' }}>U.E. Germán Busch B</h3>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-brand-cyan-muted)', fontWeight: '700' }}>Panel del Operador</span>
                  </div>
                </div>
                <button onClick={closeSidebar} style={sidebarDrawerCloseButtonStyle}>
                  <X size={16} />
                </button>
              </div>

              {/* Mobile Navigation List (Visible only on small screens inside sidebar) */}
              <div className="mobile-only-nav" style={{ display: 'none', padding: '1rem 0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={sidebarSectionTitleStyle}>Navegación</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                  {filteredMenuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          closeSidebar();
                        }}
                        style={mobileNavItemStyle(isActive)}
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Telemetry & Statistics */}
              <div style={{ padding: '1rem' }}>
                <span style={sidebarSectionTitleStyle}>Monitoreo del Sistema</span>
                
                <div style={telemetryCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Recursos Operativos</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-cyan)', fontWeight: '700' }}>95%</span>
                  </div>
                  <div style={progressContainerStyle}>
                    <div style={{ ...progressBarStyle, width: '95%', backgroundColor: 'var(--color-brand-cyan)' }} />
                  </div>
                </div>

                <div style={telemetryCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Espacios Disponibles</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-gold)', fontWeight: '700' }}>75%</span>
                  </div>
                  <div style={progressContainerStyle}>
                    <div style={{ ...progressBarStyle, width: '75%', backgroundColor: 'var(--color-brand-gold)' }} />
                  </div>
                </div>

                {/* Notification Feed */}
                <span style={{ ...sidebarSectionTitleStyle, marginTop: '1.5rem', display: 'block' }}>Alertas Recientes</span>
                <div style={notificationFeedStyle}>
                  <div style={notificationFeedItemStyle}>
                    <AlertCircle size={14} color="var(--color-brand-gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                      <b>Kit Robótica 5</b> en mantenimiento hasta el lunes.
                    </p>
                  </div>
                  <div style={notificationFeedItemStyle}>
                    <Clock size={14} color="var(--color-brand-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                      <b>Lab Computación B</b> reservado para exámenes de las 14:00.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpdesk link in sidebar footer */}
            <div style={sidebarDrawerFooterStyle}>
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

        {/* Dynamic page container shifts slightly when sidebar is open */}
        <div style={bodyWrapperStyle(sidebarOpen)} className="body-wrapper">
          {/* Main page children rendering */}
          <main className="page-body">
            {children}
          </main>

          {/* Footer */}
          <footer style={footerStyle}>
            <div>
              <b>PRRE</b> - Portal de Reserva de Recursos Educativos • Escuela Alternativa EPDB
            </div>
            <div>
              &copy; 2026 U.E. Germán Busch B • Todos los derechos reservados.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

// Inline Styles for Modern Multi-View Layout
const headerStyle = {
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

const sidebarToggleButtonStyle = (isOpen) => ({
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: 'var(--border-radius-sm)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isOpen ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
  transition: 'all 0.2s ease',
  marginRight: '0.5rem',
});

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const titleWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const logoTextStyle = {
  fontSize: '1.35rem',
  fontWeight: '800',
  letterSpacing: '0.05em',
  background: 'linear-gradient(135deg, var(--color-brand-cyan), var(--color-brand-gold))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1',
};

const logoSubtitleStyle = {
  fontSize: '0.625rem',
  color: 'var(--text-muted)',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginTop: '0.15rem',
};

const headerThemeToggleStyle = {
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
  transition: 'all 0.2s',
};

const headerIconButtonStyle = {
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

const notificationBadgeContainerStyle = {
  position: 'relative',
};

const redDotStyle = {
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

const headerProfileButtonStyle = {
  background: 'none',
  border: 'none',
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

const headerAvatarStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#00B4D8',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '800',
  fontSize: '0.8125rem',
  boxShadow: '0 2px 8px rgba(0, 180, 216, 0.2)',
};

const profileNameWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
};

const headerProfileNameStyle = {
  fontSize: '0.8125rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
};

const headerProfileRoleStyle = {
  fontSize: '0.625rem',
  color: 'var(--color-brand-gold)',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const profileMenuStyle = {
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

const profileMenuHeaderStyle = {
  padding: '0.85rem 1rem',
  display: 'flex',
  flexDirection: 'column',
};

const profileMenuLogoutItemStyle = {
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

// Collapsible Drawer Sidebar
const sidebarDrawerStyle = (isOpen) => ({
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
  transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
});

const sidebarDrawerHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: '1rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
};

const sidebarDrawerCloseButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  padding: '0.25rem',
};

const sidebarSectionTitleStyle = {
  fontSize: '0.6875rem',
  color: 'rgba(255, 255, 255, 0.4)',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  display: 'block',
  marginBottom: '0.75rem',
};

const telemetryCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '0.75rem',
  borderRadius: 'var(--border-radius-sm)',
  marginBottom: '0.75rem',
};

const progressContainerStyle = {
  width: '100%',
  height: '5px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: '10px',
  overflow: 'hidden',
};

const progressBarStyle = {
  height: '100%',
  borderRadius: '10px',
};

const notificationFeedStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
};

const notificationFeedItemStyle = {
  display: 'flex',
  gap: '0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
  padding: '0.625rem',
  borderRadius: 'var(--border-radius-sm)',
};

const sidebarDrawerFooterStyle = {
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  paddingTop: '1rem',
};

const bodyWrapperStyle = (sidebarOpen) => ({
  flexGrow: 1,
  paddingLeft: sidebarOpen ? 'var(--sidebar-width)' : '0',
  transition: 'padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const mobileNavItemStyle = (isActive) => ({
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
  backgroundColor: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
  color: isActive ? 'var(--color-brand-cyan)' : 'rgba(255, 255, 255, 0.8)',
});

const footerStyle = {
  padding: '1.5rem',
  backgroundColor: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border-color)',
  textAlign: 'center',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  marginTop: 'auto',
};

// Add responsive media query classes for hiding/showing elements dynamically
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .mobile-only-nav {
        display: block !important;
      }
      .body-wrapper {
        padding-left: 0 !important;
      }
      aside {
        z-index: 1200 !important;
        height: 100vh !important;
        position: fixed !important;
      }
    }
  `;
  document.head.appendChild(style);
}
