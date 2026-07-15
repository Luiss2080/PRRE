import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  FileText, 
  MessageSquare,
  ShieldAlert
} from 'lucide-react';

/**
 * ModuloAyuda
 * Módulo informativo y manual de usuario del sistema PRRE
 */
export default function ModuloAyuda() {
  const [faqActiva, setFaqActiva] = useState(null);

  const faqs = [
    {
      pregunta: '¿Cómo realizar una nueva solicitud de préstamo?',
      respuesta: 'Dirígete a la pestaña "Reservar" desde el menú superior o lateral, haz clic en el botón "Nueva Reserva". Luego completa los campos del formulario especificando el tipo de recurso, cantidad, motivo y el rango de horario disponible (entre 08:00 y 19:00). Las fechas se eligen mediante listas desplegables que corresponden a los próximos 10 días.'
    },
    {
      pregunta: '¿Cuáles son los horarios límites para realizar reservas?',
      respuesta: 'El sistema permite registrar reservas de forma estricta entre las 08:00 y las 19:00 horas. Las reservas se estructuran en bloques fijos de cada 1 hora o cada 2 horas para evitar traslapes entre docentes.'
    },
    {
      pregunta: '¿Quién aprueba mis solicitudes?',
      respuesta: 'Las solicitudes pasan por una validación de stock automático. Si hay stock disponible, el estado inicial será "Aprobada" o "Pendiente de confirmación" en caso de que sea un recurso crítico o espacio físico que dependa del Administrador del Sistema.'
    },
    {
      pregunta: '¿Qué sucede si un recurso se encuentra en Mantenimiento?',
      respuesta: 'Los recursos marcados con el estado "Mantenimiento" no se mostrarán disponibles para reserva en los selectores del formulario y en el catálogo aparecerán bloqueados para garantizar la seguridad.'
    },
    {
      pregunta: '¿Cómo puedo cancelar una reserva ya aprobada?',
      respuesta: 'En la pestaña "Reservar", busca tu solicitud en la tabla de registros. Si la reserva está activa o pendiente, se mostrará un botón con un icono de aspa "Cancelar". Al pulsarlo, el recurso volverá a estar disponible inmediatamente en el inventario.'
    }
  ];

  const alternarFaq = (index) => {
    if (faqActiva === index) {
      setFaqActiva(null);
    } else {
      setFaqActiva(index);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '850', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Centro de Ayuda y Soporte
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Manual de usuario, reglamentos de préstamo de equipos e información de contacto del administrador.
        </p>
      </div>

      <div className="grid-cols-3" style={{ gap: '1.5rem', alignItems: 'start', marginBottom: '2rem' }}>
        {/* Columna Izquierda: FAQs Acordeón */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '850', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} color="var(--color-brand-cyan-muted)" />
            Preguntas Frecuentes (FAQs)
          </h3>

          {faqs.map((faq, i) => {
            const isOpen = faqActiva === i;
            return (
              <div 
                key={i} 
                className="glass-card" 
                style={{ 
                  padding: '1rem', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isOpen ? '1px solid var(--color-brand-cyan-muted)' : '1px solid var(--border-color)'
                }}
                onClick={() => alternarFaq(i)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '750', color: 'var(--text-primary)' }}>
                    {faq.pregunta}
                  </span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {isOpen && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.5', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    {faq.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Columna Derecha: Reglas y Contacto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tarjeta Normativas */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-brand-gold)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '850', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} color="var(--color-brand-gold)" />
              Reglamento del Sistema
            </h4>
            <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.4' }}>
              <li>Los equipos deben ser devueltos en el mismo estado de limpieza y funcionamiento.</li>
              <li>Las solicitudes de espacio virtual deben ser de carácter pedagógico y contar con justificación.</li>
              <li>Si reporta alguna falla técnica en un equipo, notifíquelo de inmediato al soporte.</li>
            </ul>
          </div>

          {/* Tarjeta Canales de Soporte */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-brand-cyan-muted)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '850', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} color="var(--color-brand-cyan-muted)" />
              Soporte del Sistema
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: '1.4' }}>
              Si tienes problemas técnicos para acceder o programar reservas, comunícate con el canal de soporte.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <b>Email:</b> soporte@prre.sistema.edu<br />
              <b>Extensión:</b> Ext. 104 (Oficina de TI)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
