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
  User as UserIcon
} from 'lucide-react';

export default function Layout({ children, currentTab, setCurrentTab }) {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'recursos', label: 'Recursos', icon: Package, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'espacios', label: 'Espacios', icon: MapPin, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'reservas', label: 'Mis Reservas', icon: CalendarCheck, roles: ['Administrador', 'Docente', 'Estudiante'] },
    { id: 'historial', label: 'Historial', icon: History, roles: ['Administrador', 'Docente'] },
    { id: 'roles', label: 'Roles y Permisos', icon: Users, roles: ['Administrador'] },
  ];

  // Filter menu based on user role
  const filteredMenuItems = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.rol)
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-container">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={sidebarStyle(sidebarOpen)}>
        <div>
          {/* Logo & Header */}
          <div style={sidebarHeaderStyle}>
            <div style={logoContainerStyle}>
              <svg width="32" height="36" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L90 20 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V20 L50 5 Z" fill="#00B4D8" stroke="#F59E0B" strokeWidth="4" />
                <path d="M50 5 L10 20 V65 C10 82.5 28 99.5 45 109 C48 102 50 92 50 80 V5 Z" fill="#F59E0B" opacity="0.9" />
              </svg>
              <span style={logoTextStyle}>PRRE</span>
            </div>
            <button onClick={closeSidebar} style={sidebarCloseButtonStyle}>
              <X size={20} />
            </button>
          </div>

          <div style={colegioSubtitleStyle}>
            U.E. Germán Busch B
          </div>

          {/* Navigation Links */}
          <nav style={navStyle}>
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
                  style={navItemStyle(isActive)}
                >
                  <Icon size={18} style={navIconStyle(isActive)} />
                  <span>{item.label}</span>
                  {isActive && <div style={activeIndicatorStyle} />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Theme toggle & Profile Logout) */}
        <div style={sidebarFooterStyle}>
          {/* Theme Switcher Toggle (matching the design in the user screenshot) */}
          <div style={themeToggleContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isDark ? <Moon size={18} color="#00B4D8" /> : <Sun size={18} color="#F59E0B" />}
              <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>
                {isDark ? 'Modo Oscuro' : 'Modo Claro'}
              </span>
            </div>
            <label style={switchStyle}>
              <input type="checkbox" checked={isDark} onChange={toggleTheme} style={switchInputStyle} />
              <span style={switchSliderStyle(isDark)}></span>
            </label>
          </div>

          {/* User info & Logout */}
          <div style={userCardStyle}>
            <div style={userAvatarContainerStyle}>
              <UserIcon size={16} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
              <span style={userNameStyle}>{currentUser?.nombre || 'Usuario'}</span>
              <span style={userRoleStyle}>{currentUser?.rol}</span>
            </div>
            <button onClick={logout} style={logoutButtonStyle} title="Cerrar Sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Header */}
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleSidebar} style={hamburgerStyle}>
              <Menu size={22} />
            </button>
            <h2 style={headerTitleStyle}>
              {menuItems.find(item => item.id === currentTab)?.label || 'Inicio'}
            </h2>
          </div>

          {/* Header Action Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Global Search (Simulated) */}
            <div className="search-container" style={{ display: 'none' /* Hidden on mobile, can show conditionally */ }}>
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Buscar reservas, recursos..." className="search-input" />
            </div>

            {/* Notification bell */}
            <div style={notificationBadgeContainerStyle}>
              <button style={headerIconButtonStyle}>
                <Bell size={18} />
              </button>
              <div style={redDotStyle} />
            </div>

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={headerProfileButtonStyle}
              >
                <div style={headerAvatarStyle}>
                  {currentUser?.nombre ? currentUser.nombre.substring(0,2).toUpperCase() : 'U'}
                </div>
                <span style={headerProfileNameStyle}>{currentUser?.nombre}</span>
              </button>

              {showProfileMenu && (
                <>
                  <div 
                    onClick={() => setShowProfileMenu(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                  />
                  <div style={profileMenuStyle}>
                    <div style={profileMenuHeaderStyle}>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{currentUser?.nombre}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser?.email}</span>
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />
                    <div style={profileMenuBodyStyle}>
                      <div style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Rol Actual:</span>
                        <span className="badge badge-info" style={{ textTransform: 'uppercase', fontSize: '0.6875rem' }}>{currentUser?.rol}</span>
                      </div>
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

        {/* View Content */}
        <main className="page-body">
          {children}
        </main>

        {/* Footer */}
        <footer style={footerStyle}>
          <div>
            <b>PRRE</b> - Portal de Reserva de Recursos Educativos V1.0
          </div>
          <div>
            &copy; 2026 U.E. Germán Busch B • Escuela Alternativa EPDB • Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}

// Inline Styles for Layout Components
const sidebarStyle = (isOpen) => ({
  width: 'var(--sidebar-width)',
  height: '100vh',
  backgroundColor: 'var(--bg-sidebar)',
  color: 'white',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 999,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: isOpen ? 'translateX(0)' : 'translateX(0)', // Default CSS handles responsive hides
  borderRight: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '1.5rem 1rem',
});

// Use CSS sheet insertion to handle responsive hiding/showing of sidebar cleanly
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      aside {
        transform: translateX(-100%) !important;
      }
      .app-container aside {
        transform: translateX(-100%) !important;
      }
      .app-container .sidebar-open ~ aside,
      aside[style*="translateX(0px)"] {
        transform: translateX(0) !important;
      }
    }
  `;
  document.head.appendChild(style);
}

const sidebarHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.25rem',
  padding: '0 0.5rem',
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const logoTextStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  letterSpacing: '0.08em',
  background: 'linear-gradient(135deg, #00B4D8 0%, #F59E0B 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const sidebarCloseButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.6)',
  cursor: 'pointer',
  display: 'none', // Shown in CSS media queries
};

const colegioSubtitleStyle = {
  fontSize: '0.7rem',
  color: '#00B4D8',
  fontWeight: '700',
  letterSpacing: '0.12em',
  padding: '0 0.5rem',
  marginBottom: '2rem',
  textTransform: 'uppercase',
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
};

const navItemStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--border-radius-sm)',
  background: isActive ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.15), rgba(0, 119, 182, 0.05))' : 'none',
  color: isActive ? '#00B4D8' : 'rgba(255, 255, 255, 0.7)',
  border: 'none',
  textAlign: 'left',
  width: '100%',
  cursor: 'pointer',
  fontWeight: isActive ? '700' : '500',
  fontSize: '0.875rem',
  position: 'relative',
  transition: 'all 0.2s ease',
});

const navIconStyle = (isActive) => ({
  color: isActive ? '#00B4D8' : 'rgba(255, 255, 255, 0.5)',
  transition: 'color 0.2s ease',
});

const activeIndicatorStyle = {
  position: 'absolute',
  right: '0',
  top: '20%',
  bottom: '20%',
  width: '4px',
  backgroundColor: '#00B4D8',
  borderRadius: '4px 0 0 4px',
  boxShadow: '0 0 10px #00B4D8',
};

const sidebarFooterStyle = {
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  paddingTop: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const themeToggleContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  padding: '0.625rem 0.875rem',
  borderRadius: 'var(--border-radius-sm)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
};

const switchStyle = {
  position: 'relative',
  display: 'inline-block',
  width: '40px',
  height: '20px',
  cursor: 'pointer',
};

const switchInputStyle = {
  opacity: 0,
  width: 0,
  height: 0,
};

const switchSliderStyle = (isDark) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255,255,255,0.2)',
  transition: '.3s',
  borderRadius: '34px',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
  border: '1px solid rgba(255,255,255,0.1)',
  '::before': {
    position: 'absolute',
    content: '""',
    height: '14px',
    width: '14px',
    left: isDark ? '22px' : '3px',
    bottom: '2px',
    backgroundColor: isDark ? '#00B4D8' : '#F59E0B',
    transition: '.3s',
    borderRadius: '50%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
  }
});

// Custom styles override for switch slider selector helper
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    label span::before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 2px;
      bottom: 2px;
      background-color: #F59E0B;
      transition: .3s;
      border-radius: 50%;
    }
    input:checked + span::before {
      transform: translateX(20px);
      background-color: #00B4D8 !important;
    }
    input:checked + span {
      background-color: rgba(0, 180, 216, 0.15) !important;
      border-color: rgba(0, 180, 216, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
}

const userCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  padding: '0.75rem',
  borderRadius: 'var(--border-radius-md)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  overflow: 'hidden',
};

const userAvatarContainerStyle = {
  width: '32px',
  height: '32px',
  borderRadius: 'var(--border-radius-sm)',
  backgroundColor: '#0077B6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const userNameStyle = {
  fontSize: '0.8125rem',
  fontWeight: '700',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'white',
};

const userRoleStyle = {
  fontSize: '0.6875rem',
  color: '#F59E0B',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const logoutButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.4)',
  cursor: 'pointer',
  padding: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.2s',
};

const headerStyle = {
  height: 'var(--header-height)',
  backgroundColor: 'var(--bg-secondary)',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  position: 'sticky',
  top: 0,
  zIndex: 90,
  boxShadow: 'var(--shadow-sm)',
};

const hamburgerStyle = {
  display: 'none', // Handled responsively in CSS
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  padding: '0.25rem',
};

const headerTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
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
  border: '2px solid var(--bg-secondary)'
};

const headerProfileButtonStyle = {
  background: 'none',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  cursor: 'pointer',
  padding: '0.25rem 0.5rem',
  borderRadius: 'var(--border-radius-sm)',
  transition: 'background-color 0.2s',
};

const headerAvatarStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-brand-cyan)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '0.875rem',
  border: '2px solid var(--border-color)',
};

const headerProfileNameStyle = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: 'var(--text-secondary)',
};

const profileMenuStyle = {
  position: 'absolute',
  right: 0,
  top: '40px',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-lg)',
  width: '220px',
  zIndex: 100,
  overflow: 'hidden',
  animation: 'scaleUp 0.15s ease-out',
};

const profileMenuHeaderStyle = {
  padding: '0.75rem 1rem',
  display: 'flex',
  flexDirection: 'column',
};

const profileMenuBodyStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const profileMenuLogoutItemStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  color: 'var(--color-danger)',
  fontSize: '0.875rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'background-color 0.2s',
};

const footerStyle = {
  padding: '1.5rem 2rem',
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

// Add responsive media query styles to head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      aside {
        transform: translateX(-100%);
      }
      .main-content {
        margin-left: 0 !important;
      }
      button[style*="display: none"] {
        display: block !important;
      }
      /* Hamburger menu display */
      header button:first-child {
        display: block !important;
      }
    }
  `;
  document.head.appendChild(style);
}
