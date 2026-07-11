import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      const finishTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
      return () => clearTimeout(finishTimer);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={containerStyle(fadeOut)}>
      <div style={contentStyle}>
        {/* LogoPRRE.png integrated in loading screen */}
        <div style={logoWrapperStyle}>
          <img 
            src="/LogoPRRE.png" 
            alt="Logo U.E. Germán Busch B" 
            style={logoImageStyle} 
          />
        </div>

        <h1 style={titleStyle}>PRRE</h1>
        <p style={subtitleStyle}>Portal de Reserva de Recursos Educativos</p>
        
        <div style={schoolBadgeStyle}>
          <span>U. E. GERMÁN BUSCH B</span>
        </div>

        <div style={loaderContainerStyle}>
          <div style={loaderBarStyle}></div>
        </div>
      </div>
    </div>
  );
}

// Inline Styles for Loading Screen
const containerStyle = (fadeOut) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#05080e', // Obsidian deep black
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  opacity: fadeOut ? 0 : 1,
  visibility: fadeOut ? 'hidden' : 'visible',
  transition: 'opacity 0.5s ease, visibility 0.5s ease',
  textAlign: 'center',
  padding: '1.5rem',
});

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '450px',
  width: '100%',
};

const logoWrapperStyle = {
  marginBottom: '1.5rem',
  filter: 'drop-shadow(0 0 25px rgba(0, 229, 255, 0.4))',
  animation: 'pulseLogo 2s infinite ease-in-out',
};

const logoImageStyle = {
  width: '140px',
  height: 'auto',
  display: 'block',
};

const titleStyle = {
  fontSize: '3.25rem',
  fontWeight: '900',
  letterSpacing: '0.12em',
  background: 'linear-gradient(135deg, #00e5ff 0%, #FF9F1C 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '0.25rem',
  filter: 'drop-shadow(0 4px 12px rgba(0, 229, 255, 0.15))'
};

const subtitleStyle = {
  fontSize: '0.875rem',
  color: '#94A3B8',
  fontWeight: '700',
  letterSpacing: '0.1em',
  marginBottom: '1.5rem',
  textTransform: 'uppercase',
};

const schoolBadgeStyle = {
  backgroundColor: 'rgba(255, 159, 28, 0.15)',
  border: '1px solid rgba(255, 159, 28, 0.3)',
  padding: '0.45rem 1.25rem',
  borderRadius: '50px',
  color: '#FF9F1C',
  fontSize: '0.75rem',
  fontWeight: '800',
  letterSpacing: '0.12em',
  marginBottom: '3rem',
  boxShadow: '0 0 15px rgba(255, 159, 28, 0.1)'
};

const loaderContainerStyle = {
  width: '180px',
  height: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '10px',
  overflow: 'hidden',
  position: 'relative',
};

const loaderBarStyle = {
  width: '70%',
  height: '100%',
  backgroundColor: '#00e5ff',
  borderRadius: '10px',
  position: 'absolute',
  animation: 'loadingProgress 1.6s ease-in-out infinite',
  boxShadow: '0 0 10px #00e5ff',
};

// Injection of keyframes
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes pulseLogo {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(0, 229, 255, 0.3)); }
      50% { transform: scale(1.05); filter: drop-shadow(0 0 30px rgba(255, 159, 28, 0.45)); }
    }
  `;
  document.head.appendChild(styleTag);
}
