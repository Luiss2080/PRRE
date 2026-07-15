import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Calendar,
  AlertCircle
} from 'lucide-react';

/**
 * ModuloReportes
 * Módulo para visualizar estadísticas y descargar reportes del sistema PRRE
 */
export default function ModuloReportes() {
  const [descargando, setDescargando] = useState(null);
  const [descargaExitosa, setDescargaExitosa] = useState(null);

  const reportes = [
    {
      id: 'general',
      titulo: 'Reporte General de Reservas',
      descripcion: 'Listado completo de todas las solicitudes, aprobaciones y devoluciones del periodo actual.',
      formato: 'PDF',
      tamanio: '2.4 MB',
      color: 'var(--color-brand-cyan-muted)'
    },
    {
      id: 'inventario',
      titulo: 'Inventario y Estado de Recursos',
      descripcion: 'Detalle de stock, cantidad disponible, estado de conservación y recursos en mantenimiento.',
      formato: 'EXCEL',
      tamanio: '1.8 MB',
      color: 'var(--color-brand-gold)'
    },
    {
      id: 'docentes',
      titulo: 'Uso de Recursos por Docente',
      descripcion: 'Estadísticas acumuladas de horas de préstamo y volumen de solicitudes clasificadas por docente.',
      formato: 'CSV',
      tamanio: '620 KB',
      color: 'var(--color-success)'
    },
    {
      id: 'aulas',
      titulo: 'Ocupación de Espacios y Aulas',
      descripcion: 'Porcentaje de ocupación y distribución de reservas de laboratorios, auditorios y aulas virtuales.',
      formato: 'PDF',
      tamanio: '3.1 MB',
      color: 'var(--color-danger)'
    }
  ];

  const iniciarDescarga = (id, titulo) => {
    setDescargando(id);
    setDescargaExitosa(null);
    setTimeout(() => {
      setDescargando(null);
      setDescargaExitosa(titulo);
      setTimeout(() => setDescargaExitosa(null), 3000);
    }, 2000);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '850', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Reportes y Estadísticas
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Monitoreo analítico del flujo de reservas y descarga de informes ejecutivos del sistema.
        </p>
      </div>

      {/* Tarjetas de Métricas de Resumen */}
      <div className="grid-cols-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card glow-card-cyan" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(0, 229, 255, 0.08)', color: 'var(--color-brand-cyan-muted)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>Tasa de Aprobación</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>92.4%</span>
          </div>
        </div>

        <div className="glass-card glow-card-gold" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(255, 159, 28, 0.08)', color: 'var(--color-brand-gold)' }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>Uso de Dispositivos</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>184 horas</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(46, 196, 182, 0.08)', color: 'var(--color-success)' }}>
            <Calendar size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>Reservas Concluidas</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>48 Solicitudes</span>
          </div>
        </div>
      </div>

      {/* Descarga Exitosa Notification Toast */}
      {descargaExitosa && (
        <div 
          className="glass-card animate-slide-in" 
          style={{ 
            padding: '0.85rem 1.25rem', 
            marginBottom: '1.5rem', 
            borderLeft: '4px solid var(--color-success)', 
            backgroundColor: 'rgba(46, 196, 182, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <CheckCircle2 size={18} color="var(--color-success)" />
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: '600' }}>
            ¡Descarga finalizada! El archivo <b>{descargaExitosa}</b> se guardó en su carpeta local.
          </span>
        </div>
      )}

      {/* Listado de Reportes Descargables */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: '850', color: 'var(--text-primary)', marginBottom: '1rem' }}>
        Exportar Reportes del Sistema
      </h3>
      
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        {reportes.map(rep => {
          const isDownloading = descargando === rep.id;
          return (
            <div 
              key={rep.id} 
              className="glass-card" 
              style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                gap: '1rem',
                borderLeft: `4px solid ${rep.color}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {rep.titulo}
                  </h4>
                  <span 
                    style={{ 
                      fontSize: '0.625rem', 
                      fontWeight: '800', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      backgroundColor: 'var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {rep.formato} • {rep.tamanio}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {rep.descripcion}
                </p>
              </div>

              <button
                disabled={descargando !== null}
                onClick={() => iniciarDescarga(rep.id, rep.titulo)}
                className={`btn w-full ${rep.formato === 'PDF' ? 'btn-primary' : (rep.formato === 'EXCEL' ? 'btn-accent' : 'btn-secondary')}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  padding: '0.6rem'
                }}
              >
                {isDownloading ? (
                  <>
                    <div className="loader" style={{ width: '14px', height: '14px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>Generando informe...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Descargar {rep.formato}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
