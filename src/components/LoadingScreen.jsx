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
        {/* Refined SVG Shield Logo representing U.E. Germán Busch B 1993 epdb */}
        <div style={logoWrapperStyle}>
          <svg 
            width="130" 
            height="150" 
            viewBox="0 0 100 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={svgStyle}
          >
            {/* Outer Shield Border */}
            <path d="M50 5 L90 20 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V20 L50 5 Z" fill="#070B13" stroke="#FF9F1C" strokeWidth="4" />
            
            {/* Left section (Gold gradient) */}
            <path d="M50 5 L10 20 V65 C10 82.5 28 99.5 45 109 C48 102 50 92 50 80 V5 Z" fill="url(#loadingGold)" opacity="0.95" />
            
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
              <linearGradient id="loadingGold" x1="10" y1="5" x2="50" y2="109" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF9F1C" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>
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
  filter: 'drop-shadow(0 0 35px rgba(0, 229, 255, 0.45))',
  animation: 'pulseLogo 2s infinite ease-in-out',
};

const svgStyle = {
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
