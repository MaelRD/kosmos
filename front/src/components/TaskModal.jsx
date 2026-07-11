import TypeIcon from './TypeIcon';
import { LABELS } from '../constants';

const selectStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#fffdf8',
  border: '2.5px solid #1e1b16',
  borderRadius: 10,
  color: '#1e1b16',
  fontFamily: 'inherit',
  fontSize: 12.5,
  fontWeight: 700,
  padding: '9px 10px',
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

export default function TaskModal({ task, members, onClose, onChange, onDelete }) {
  const typeColor = task.type === 'story' ? '#FFCB3D' : task.type === 'task' ? '#3E8EDE' : '#FF4D4D';

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
          maxWidth: 560,
          maxHeight: '85vh',
          overflow: 'auto',
          background: '#ffffff',
          border: '3px solid #1e1b16',
          borderRadius: 22,
          padding: 26,
          boxShadow: '8px 8px 0 #1e1b16',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e1b16',
              background: typeColor,
              border: '2px solid #1e1b16',
            }}
          >
            <TypeIcon type={task.type} />
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b6558',
              fontSize: 22,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <input
          value={task.title}
          onChange={(e) => onChange('title', e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: 'transparent',
            border: 'none',
            borderBottom: '2.5px solid #1e1b16',
            color: '#1e1b16',
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 19,
            fontWeight: 700,
            padding: '6px 0 10px',
            outline: 'none',
            marginBottom: 16,
          }}
        />

        <textarea
          value={task.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Añade una descripción…"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            minHeight: 80,
            background: '#fffdf8',
            border: '2.5px solid #1e1b16',
            borderRadius: 12,
            color: '#1e1b16',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            padding: 12,
            outline: 'none',
            resize: 'vertical',
            marginBottom: 18,
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={fieldLabel}>Estado</div>
            <select value={task.column} onChange={(e) => onChange('column', e.target.value)} style={selectStyle}>
              <option value="backlog">Backlog</option>
              <option value="todo">Por explorar</option>
              <option value="progress">En tránsito</option>
              <option value="review">En revisión</option>
              <option value="done">Completado</option>
            </select>
          </div>
          <div>
            <div style={fieldLabel}>Tipo</div>
            <select value={task.type} onChange={(e) => onChange('type', e.target.value)} style={selectStyle}>
              <option value="story">Historia</option>
              <option value="task">Tarea</option>
              <option value="bug">Error</option>
            </select>
          </div>
          <div>
            <div style={fieldLabel}>Prioridad</div>
            <select value={task.priority} onChange={(e) => onChange('priority', e.target.value)} style={selectStyle}>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
          <div>
            <div style={fieldLabel}>Responsable</div>
            <select value={task.assignee} onChange={(e) => onChange('assignee', e.target.value)} style={selectStyle}>
              {Object.keys(members).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div style={fieldLabel}>Puntos</div>
            <select value={task.points} onChange={(e) => onChange('points', e.target.value)} style={selectStyle}>
              {['1', '2', '3', '5', '8'].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div style={fieldLabel}>Etiqueta</div>
            <select value={task.label} onChange={(e) => onChange('label', e.target.value)} style={selectStyle}>
              {LABELS.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
          <button
            onClick={onDelete}
            style={{
              background: '#ffffff',
              border: '2.5px solid #1e1b16',
              color: '#ff4d4d',
              fontSize: 12.5,
              fontWeight: 800,
              padding: '9px 16px',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #1e1b16',
            }}
          >
            Eliminar tarea
          </button>
        </div>
      </div>
    </div>
  );
}
