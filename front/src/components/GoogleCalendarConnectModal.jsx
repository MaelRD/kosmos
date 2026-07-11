import { useEffect, useState } from 'react';
import { addExternalCalendar, deleteExternalCalendar, getAgendaFeedUrl, listExternalCalendars } from '../api';

const stepStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: '#1e1b16',
  lineHeight: 1.5,
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#fffdf8',
  border: '2.5px solid #1e1b16',
  borderRadius: 12,
  color: '#1e1b16',
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 600,
  padding: '10px 12px',
  outline: 'none',
};

export default function GoogleCalendarConnectModal({ onClose }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [subscriptions, setSubscriptions] = useState([]);
  const [label, setLabel] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [importError, setImportError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadSubscriptions = () => listExternalCalendars().then(setSubscriptions).catch(() => setSubscriptions([]));

  useEffect(() => {
    getAgendaFeedUrl()
      .then(setUrl)
      .catch((err) => setError(err.message));
    loadSubscriptions();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSubscription = async (e) => {
    e.preventDefault();
    setImportError('');
    setSaving(true);
    try {
      await addExternalCalendar({ label: label.trim(), sourceUrl: sourceUrl.trim() });
      setLabel('');
      setSourceUrl('');
      await loadSubscriptions();
    } catch (err) {
      setImportError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSubscription = async (id) => {
    await deleteExternalCalendar(id);
    loadSubscriptions();
  };

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
          maxWidth: 460,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          border: '3px solid #1e1b16',
          borderRadius: 22,
          padding: 26,
          boxShadow: '8px 8px 0 #1e1b16',
        }}
      >
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 19, fontWeight: 800, marginBottom: 14 }}>
          Conectar con Google Calendar
        </div>

        <div style={{ ...stepStyle, marginBottom: 6, fontWeight: 800 }}>1. Kosmos → Google Calendar</div>
        <div style={{ ...stepStyle, marginBottom: 14 }}>
          Tu agenda se sincroniza vía una URL de calendario personal. Copiala y pegala en Google
          Calendar para verla ahí (se actualiza sola cada hora).
        </div>

        {error && (
          <div
            style={{
              fontSize: 12.5,
              color: '#1e1b16',
              fontWeight: 700,
              background: '#ffe1e1',
              border: '2px solid #1e1b16',
              borderRadius: 10,
              padding: '9px 11px',
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        )}

        {!error && (
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              readOnly
              value={url || 'Generando URL…'}
              onFocus={(e) => e.target.select()}
              style={{
                ...inputStyle,
                fontFamily: 'monospace',
                fontSize: 12.5,
                marginBottom: 10,
              }}
            />
            <button
              type="button"
              onClick={handleCopy}
              disabled={!url}
              style={{
                background: copied ? '#e6f9f4' : '#ffcb3d',
                border: '2.5px solid #1e1b16',
                color: '#1e1b16',
                fontSize: 13,
                fontWeight: 800,
                padding: '10px 16px',
                borderRadius: 12,
                cursor: url ? 'pointer' : 'default',
                boxShadow: '3px 3px 0 #1e1b16',
              }}
            >
              {copied ? '✅ Copiada' : 'Copiar URL'}
            </button>
          </div>
        )}

        <ol style={{ ...stepStyle, margin: '0 0 20px', paddingLeft: 18 }}>
          <li>Entrá a Google Calendar en la web.</li>
          <li>
            Abajo a la izquierda, en "Otros calendarios", tocá el <strong>+</strong> y elegí{' '}
            <strong>Desde URL</strong>.
          </li>
          <li>Pegá la URL copiada y tocá <strong>Añadir calendario</strong>.</li>
        </ol>

        <div style={{ borderTop: '2px dashed #e9e4d6', margin: '0 0 18px' }} />

        <div style={{ ...stepStyle, marginBottom: 6, fontWeight: 800 }}>2. Google Calendar → Kosmos</div>
        <div style={{ ...stepStyle, marginBottom: 12 }}>
          Traé eventos de un calendario público de Google (pegá su link para compartir o su ID) para
          verlos junto a tu agenda, en modo lectura.
        </div>

        <form onSubmit={handleAddSubscription} style={{ marginBottom: 14 }}>
          <input
            type="text"
            required
            placeholder="Nombre (ej: Trabajo)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{ ...inputStyle, marginBottom: 8 }}
          />
          <input
            type="text"
            required
            placeholder="Link de Google Calendar (con cid=...) o URL .ics"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            style={{ ...inputStyle, marginBottom: 8 }}
          />
          {importError && (
            <div
              style={{
                fontSize: 12.5,
                color: '#1e1b16',
                fontWeight: 700,
                background: '#ffe1e1',
                border: '2px solid #1e1b16',
                borderRadius: 10,
                padding: '9px 11px',
                marginBottom: 8,
              }}
            >
              {importError}
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            style={{
              background: '#9B7BFF',
              border: '2.5px solid #1e1b16',
              color: '#1e1b16',
              fontSize: 13,
              fontWeight: 800,
              padding: '10px 16px',
              borderRadius: 12,
              cursor: saving ? 'default' : 'pointer',
              boxShadow: '3px 3px 0 #1e1b16',
            }}
          >
            {saving ? 'Agregando…' : '+ Agregar calendario'}
          </button>
        </form>

        {subscriptions.length > 0 && (
          <div style={{ marginBottom: 4 }}>
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  background: '#f7f3e7',
                  border: '2px solid #1e1b16',
                  borderRadius: 10,
                  padding: '8px 10px',
                  marginBottom: 8,
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 800, color: '#1e1b16' }}>📅 {sub.label}</div>
                <button
                  type="button"
                  onClick={() => handleRemoveSubscription(sub.id)}
                  style={{
                    background: '#ffffff',
                    border: '2px solid #1e1b16',
                    color: '#ff4d4d',
                    fontSize: 11.5,
                    fontWeight: 800,
                    padding: '5px 10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
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
