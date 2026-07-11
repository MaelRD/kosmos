const labelStyle = {
  fontSize: 11,
  fontWeight: 800,
  color: '#6b6558',
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  marginBottom: 4,
};

const valueStyle = {
  fontSize: 13.5,
  fontWeight: 600,
  color: '#1e1b16',
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
};

export default function ExternalEventDetailModal({ event, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(30,27,22,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          border: '3px solid #1e1b16',
          borderRadius: 22,
          padding: 26,
          boxShadow: '8px 8px 0 #1e1b16',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#6b6558',
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            marginBottom: 4,
          }}
        >
          📅 {event.sourceLabel}
        </div>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 19, fontWeight: 800, marginBottom: 16 }}>
          {event.title}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={labelStyle}>Horario</div>
          <div style={valueStyle}>
            {event.startsAt.toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })} —{' '}
            {event.endsAt.toLocaleString('es-AR', { timeStyle: 'short' })}
          </div>
        </div>

        {event.location && (
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>Ubicación</div>
            <div style={valueStyle}>{event.location}</div>
          </div>
        )}

        {event.description && (
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>Descripción</div>
            <div style={valueStyle}>{event.description}</div>
          </div>
        )}

        {event.meetUrl && (
          <a
            href={event.meetUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#e6f9f4',
              border: '2.5px solid #1e1b16',
              color: '#1e1b16',
              fontSize: 13,
              fontWeight: 800,
              padding: '10px 16px',
              borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '3px 3px 0 #1e1b16',
              marginBottom: 14,
            }}
          >
            🎥 Unirse a Google Meet
          </a>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '2.5px solid #1e1b16',
              color: '#1e1b16',
              fontSize: 13,
              fontWeight: 800,
              padding: '10px 16px',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
