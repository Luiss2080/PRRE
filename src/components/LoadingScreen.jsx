import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading for 1.8 seconds, then trigger fadeout
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for the fade-out CSS animation to finish
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
        {/* Custom SVG Shield Logo inspired by U.E. Germán Busch B */}
        <div style={logoWrapperStyle}>
          <svg
            width="120"
            height="140"
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={svgStyle}
          >
            {/* Outer Shield Border */}
            <path
              d="M50 5 L90 20 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V20 L50 5 Z"
              fill="#0B2545"
              stroke="#F59E0B"
              strokeWidth="3"
            />
            {/* Left Gold Section */}
            <path
              d="M50 5 L10 20 V65 C10 82.5 28 99.5 45 109 C48 102 50 92 50 80 V5 Z"
              fill="url(#goldGradient)"
              opacity="0.95"
            />
            {/* Center Blue Circle */}
            <circle cx="50" cy="50" r="22" fill="#00B4D8" stroke="#F59E0B" strokeWidth="2" />
            {/* Book symbol inside circle */}
            <path
              d="M40 48 C40 46 45 45 50 48 C55 45 60 46 60 48 V58 C60 56 55 55 50 57 C45 55 40 56 40 58 V48 Z"
              fill="white"
            />
            <path d="M50 48 V57" stroke="#0B2545" strokeWidth="1.5" />
            
            {/* Right Sky Blue Area */}
            <path
              d="M50 5 L90 20 V65 C90 82.5 72 99.5 55 109 C52 102 50 92 50 80 V5 Z"
              fill="url(#blueGradient)"
              opacity="0.4"
            />

            {/* Gradients definitions */}
            <defs>
              <linearGradient id="goldGradient" x1="10" y1="5" x2="50" y2="109" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="blueGradient" x1="90" y1="20" x2="50" y2="109" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00B4D8" />
                <stop offset="100%" stopColor="#0077B6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 style={titleStyle}>PRRE</h1>
        <p style={subtitleStyle}>Portal de Reserva de Recursos Educativos</p>
        
        <div style={schoolBadgeStyle}>
          <span>U. E. GERMÁN BUSCH B</span>
        </div>

        {/* Dynamic visual loading indicator */}
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
  backgroundColor: '#090d16', // Always dark for premium load feel
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
  filter: 'drop-shadow(0 0 25px rgba(0, 180, 216, 0.4))',
  animation: 'pulseLogo 2s infinite ease-in-out',
};

const svgStyle = {
  display: 'block',
};

const titleStyle = {
  fontSize: '3rem',
  fontWeight: '800',
  letterSpacing: '0.15em',
  background: 'linear-gradient(135deg, #00B4D8 0%, #F59E0B 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '0.25rem',
};

const subtitleStyle = {
  fontSize: '0.95rem',
  color: '#94A3B8',
  fontWeight: '500',
  letterSpacing: '0.05em',
  marginBottom: '1.5rem',
  textTransform: 'uppercase',
};

const schoolBadgeStyle = {
  backgroundColor: 'rgba(245, 158, 11, 0.1)',
  border: '1px solid rgba(245, 158, 11, 0.3)',
  padding: '0.4rem 1rem',
  borderRadius: '50px',
  color: '#F59E0B',
  fontSize: '0.75rem',
  fontWeight: '700',
  letterSpacing: '0.1em',
  marginBottom: '3rem',
};

const loaderContainerStyle = {
  width: '180px',
  height: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  overflow: 'hidden',
  position: 'relative',
};

const loaderBarStyle = {
  width: '70%',
  height: '100%',
  backgroundColor: '#00B4D8',
  borderRadius: '10px',
  position: 'absolute',
  animation: 'loadingProgress 1.6s ease-in-out infinite',
  boxShadow: '0 0 8px #00B4D8',
};

// Add standard keyframe animations inline via stylesheet injection
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes pulseLogo {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(0, 180, 216, 0.3)); }
      50% { transform: scale(1.05); filter: drop-shadow(0 0 30px rgba(245, 158, 11, 0.5)); }
    }
    @keyframes loadingProgress {
      0% { left: -100%; width: 30%; }
      50% { width: 50%; }
      100% { left: 100%; width: 30%; }
    }
  `;
  document.head.appendChild(styleTag);
}
