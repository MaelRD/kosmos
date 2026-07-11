import { useState } from 'react';
import { toLocalInputValue } from '../dateUtils';

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#fffdf8',
  border: '2.5px solid #1e1b16',
  borderRadius: 12,
  color: '#1e1b16',
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  padding: '11px 13px',
  outline: 'none',
};

const fieldLabel = {
  fontSize: 11,
  fontWeight: 800,
  color: '#6b6558',
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  marginBottom: 6,
};

export default function AgendaEventModal({ mode, initial, members, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(initial.title || '');
  const [startsAt, setStartsAt] = useState(toLocalInputValue(initial.startsAt));
  const [endsAt, setEndsAt] = useState(toLocalInputValue(initial.endsAt));
  const [assigneeEmail, setAssigneeEmail] = useState(initial.assigneeEmail || members[0]?.email || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(endsAt) <= new Date(startsAt)) {
      setError('La hora de fin debe ser después del inicio.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: '',
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        assigneeEmail,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
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
          maxWidth: 420,
          background: '#ffffff',
          border: '3px solid #1e1b16',
          borderRadius: 22,
          padding: 26,
          boxShadow: '8px 8px 0 #1e1b16',
        }}
      >
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 19, fontWeight: 800, marginBottom: 18 }}>
          {mode === 'edit' ? 'Editar evento' : 'Nuevo evento'}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <div style={fieldLabel}>Título</div>
            <input
              type="text"
              required
              placeholder="Ej: Daily de la tripulación"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <div style={fieldLabel}>Inicio</div>
              <input
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <div style={fieldLabel}>Fin</div>
              <input
                type="datetime-local"
                required
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={fieldLabel}>Responsable</div>
            <select
              required
              value={assigneeEmail}
              onChange={(e) => setAssigneeEmail(e.target.value)}
              style={inputStyle}
            >
              {members.map((m) => (
                <option key={m.email} value={m.email}>
                  {m.name}
                </option>
              ))}
            </select>
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

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            {mode === 'edit' ? (
              <button
                type="button"
                onClick={onDelete}
                style={{
                  background: '#ffffff',
                  border: '2.5px solid #1e1b16',
                  color: '#ff4d4d',
                  fontSize: 12.5,
                  fontWeight: 800,
                  padding: '10px 16px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0 #1e1b16',
                }}
              >
                Eliminar
              </button>
            ) : (
              <div />
            )}

            <div style={{ display: 'flex', gap: 10 }}>
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
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#ffcb3d',
                  color: '#1e1b16',
                  border: '2.5px solid #1e1b16',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 800,
                  padding: '11px 18px',
                  borderRadius: 12,
                  cursor: saving ? 'default' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  boxShadow: '4px 4px 0 #1e1b16',
                }}
              >
                {saving ? 'Guardando…' : mode === 'edit' ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
