import React, { useState } from 'react';
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
import { Laptop, Calendar, ShieldCheck, Sun, Moon } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, currentUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  
  const [showLoading, setShowLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [currentTab, setCurrentTab] = useState('dashboard');

  // 1. Loading Screen
  if (showLoading) {
    return <LoadingScreen onFinish={() => setShowLoading(false)} />;
  }

  // 2. Landing Presentation Page (If Not Logged In)
  if (!isAuthenticated) {
    return (
      <div style={landingWrapperStyle}>
        {/* Navigation Bar */}
        <header style={landingHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="32" height="36" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5 L90 20 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V20 L50 5 Z" fill="#00B4D8" stroke="#F59E0B" strokeWidth="4" />
              <path d="M50 5 L10 20 V65 C10 82.5 28 99.5 45 109 C48 102 50 92 50 80 V5 Z" fill="#F59E0B" opacity="0.9" />
            </svg>
            <span style={landingLogoTextStyle}>PRRE</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              style={landingThemeToggleButtonStyle} 
              title="Cambiar Tema"
            >
              {isDark ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#00B4D8" />}
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

        {/* Hero Section */}
        <section style={heroSectionStyle}>
          <div style={heroContentStyle}>
            <div style={heroBadgeStyle}>
              SISTEMA DE RESERVAS • U. E. GERMÁN BUSCH B
            </div>
            <h1 style={heroTitleStyle}>
              Optimiza el acceso a los <span className="gradient-text">recursos educativos</span> de tu colegio
            </h1>
            <p style={heroSubtitleStyle}>
              Un portal moderno, intuitivo y eficiente diseñado para que docentes y estudiantes puedan reservar laboratorios, proyectores, laptops y materiales didácticos sin complicaciones.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setAuthTab('login'); setAuthModalOpen(true); }}
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Empezar a Reservar
              </button>
              <button 
                onClick={() => { setAuthTab('register'); setAuthModalOpen(true); }}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Registrar Cuenta Institucional
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={featuresSectionStyle}>
          <div className="grid-cols-4" style={{ maxWidth: '1200px', margin: '0 auto', gap: '1.5rem' }}>
            <div className="glass-card text-center" style={featureCardStyle}>
              <div style={featureIconContainerStyle('#00B4D8')}>
                <Laptop size={24} color="white" />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Gestión de Recursos</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Controla el inventario disponible de laptops, proyectores y kits de robótica en tiempo real.
              </p>
            </div>

            <div className="glass-card text-center" style={featureCardStyle}>
              <div style={featureIconContainerStyle('#F59E0B')}>
                <Calendar size={24} color="white" />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Aulas & Espacios</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Reserva el laboratorio de computación, el auditorio o laboratorios científicos con un par de clics.
              </p>
            </div>

            <div className="glass-card text-center" style={featureCardStyle}>
              <div style={featureIconContainerStyle('#10B981')}>
                <ShieldCheck size={24} color="white" />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Roles & Permisos</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Roles estructurados para estudiantes, docentes y administradores con flujos de aprobación claros.
              </p>
            </div>

            <div className="glass-card text-center" style={featureCardStyle}>
              <div style={featureIconContainerStyle('#6366F1')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Tasa de Disponibilidad</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Evita reservas duplicadas o conflictos de horarios gracias a nuestro sistema de validación inteligente.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={landingFooterStyle}>
          <div>
            <b>Portal PRRE</b> • U. E. Germán Busch B • Escuela Alternativa EPDB
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            &copy; 2026 Reservas Escolares. Todos los derechos reservados.
          </div>
        </footer>

        {/* Auth Modals */}
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          initialTab={authTab} 
        />
      </div>
    );
  }

  // 3. Portal Dashboard Area (If Logged In)
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} />;
      case 'recursos':
        return <RecursosModule />;
      case 'espacios':
        return <EspaciosModule />;
      case 'reservas':
        return <ReservasModule />;
      case 'historial':
        return <HistorialModule />;
      case 'roles':
        // Fallback protection
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
  height: '75px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2rem',
  backgroundColor: 'var(--bg-secondary)',
  borderBottom: '1px solid var(--border-color)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: 'var(--shadow-sm)'
};

const landingLogoTextStyle = {
  fontSize: '1.6rem',
  fontWeight: '900',
  letterSpacing: '0.08em',
  background: 'linear-gradient(135deg, #00B4D8 0%, #F59E0B 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
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
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border-color)',
};

const heroSectionStyle = {
  padding: '6rem 2rem 4rem 2rem',
  textAlign: 'center',
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at top, rgba(0, 180, 216, 0.04) 0%, transparent 70%)',
};

const heroContentStyle = {
  maxWidth: '850px',
  width: '100%',
};

const heroBadgeStyle = {
  display: 'inline-block',
  backgroundColor: 'var(--color-warning-bg)',
  border: '1px solid rgba(245, 158, 11, 0.3)',
  color: 'var(--color-brand-gold-hover)',
  padding: '0.4rem 1rem',
  borderRadius: '50px',
  fontSize: '0.75rem',
  fontWeight: '700',
  letterSpacing: '0.1em',
  marginBottom: '1.5rem',
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
  lineHeight: '1.6',
  marginBottom: '2.5rem',
  maxWidth: '700px',
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
  transition: 'transform 0.3s ease',
};

// Add hover scale animation to head for landing feature cards
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .glass-card.text-center:hover {
      transform: translateY(-5px);
    }
    @media (max-width: 768px) {
      h1 {
        font-size: 2.25rem !important;
      }
    }
  `;
  document.head.appendChild(style);
}

const featureIconContainerStyle = (color) => ({
  width: '48px',
  height: '48px',
  borderRadius: 'var(--border-radius-md)',
  backgroundColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.25rem',
  boxShadow: `0 4px 10px ${color}35`,
});

const landingFooterStyle = {
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: 'var(--bg-primary)',
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  borderTop: '1px solid var(--border-color)'
};
