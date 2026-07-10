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
      <path d="M50 5 L10 20 V65 C10 82.5 28 99.5 45 109 C48 102 50 92 50 80 V5 Z" fill="url(#landingGold)" opacity="0.95" />
      
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
        <linearGradient id="landingGold" x1="10" y1="5" x2="50" y2="109" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9F1C" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );

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
            <ShieldLogo size={36} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={landingLogoTextStyle}>PRRE</span>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                U.E. GERMAN BUSCH B
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Theme Toggle */}
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

        {/* Hero Section */}
        <section style={heroSectionStyle}>
          <div style={heroContentStyle}>
            <div style={heroBadgeStyle}>
              PORTAL DE RESERVAS • U. E. GERMÁN BUSCH B
            </div>
            <h1 style={heroTitleStyle}>
              PRRE: <span className="gradient-text">Portal de Reserva</span> de Recursos Educativos
            </h1>
            <p style={heroSubtitleStyle}>
              Un entorno tecnológico y estandarizado diseñado para gestionar reservas de laboratorios, proyectores, computadoras y material didáctico. Diseñado para optimizar los procesos de enseñanza y aprendizaje.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setAuthTab('login'); setAuthModalOpen(true); }}
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Acceder al Portal
              </button>
              <button 
                onClick={() => { setAuthTab('register'); setAuthModalOpen(true); }}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={featuresSectionStyle}>
          <div className="grid-cols-4" style={{ maxWidth: '1200px', margin: '0 auto', gap: '1.5rem' }}>
            <div className="glass-card text-center glow-card-cyan" style={featureCardStyle}>
              <div style={featureIconContainerStyle('var(--color-brand-cyan-muted)')}>
                <Laptop size={24} color="white" />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Recursos Tecnológicos</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Revisa la disponibilidad de proyectores multimedia, portátiles HP, kits Arduino y tabletas.
              </p>
            </div>

            <div className="glass-card text-center glow-card-gold" style={featureCardStyle}>
              <div style={featureIconContainerStyle('var(--color-brand-gold)')}>
                <Calendar size={24} color="white" />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Espacios Temáticos</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Agenda de laboratorios de computación, ciencias físicas/químicas o auditorios de forma nítida.
              </p>
            </div>

            <div className="glass-card text-center glow-card-cyan" style={featureCardStyle}>
              <div style={featureIconContainerStyle('var(--color-success)')}>
                <ShieldCheck size={24} color="white" />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Control Operativo</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Estructura de perfiles para Estudiantes, Docentes y Administradores con bitácora de auditoría.
              </p>
            </div>

            <div className="glass-card text-center glow-card-gold" style={featureCardStyle}>
              <div style={featureIconContainerStyle('#6366F1')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Disponibilidad Activa</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Algoritmo de cálculo de stock en tiempo real que previene cruces de horarios y sobreventa.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={landingFooterStyle}>
          <div>
            <b>Portal PRRE</b> • U. E. Germán Busch B • Convenio EPDB
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            &copy; 2026 Reservas Educativas. Desarrollado en cooperación con Escuelas Populares Don Bosco.
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
  padding: '0 2rem',
  backgroundColor: 'var(--bg-secondary)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid var(--border-color)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: 'var(--shadow-sm)'
};

const landingLogoTextStyle = {
  fontSize: '1.6rem',
  fontWeight: '900',
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
  padding: '6rem 2rem 4rem 2rem',
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
