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

export default function CreateModal({ newTask, members, onChange, onClose, onSubmit }) {
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
          background: '#ffffff',
          border: '3px solid #1e1b16',
          borderRadius: 22,
          padding: 26,
          boxShadow: '8px 8px 0 #1e1b16',
        }}
      >
        <div
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 19,
            fontWeight: 800,
            marginBottom: 18,
          }}
        >
          Nueva tarea
        </div>

        <input
          placeholder="Título de la tarea…"
          value={newTask.title}
          onChange={(e) => onChange('title', e.target.value)}
          style={{
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
            marginBottom: 14,
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <select value={newTask.type} onChange={(e) => onChange('type', e.target.value)} style={selectStyle}>
            <option value="story">Historia</option>
            <option value="task">Tarea</option>
            <option value="bug">Error</option>
          </select>
          <select
            value={newTask.priority}
            onChange={(e) => onChange('priority', e.target.value)}
            style={selectStyle}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
          <select
            value={newTask.assignee}
            onChange={(e) => onChange('assignee', e.target.value)}
            style={selectStyle}
          >
            {Object.keys(members).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={newTask.column}
            onChange={(e) => onChange('column', e.target.value)}
            style={selectStyle}
          >
            <option value="backlog">Backlog</option>
            <option value="todo">Por explorar</option>
            <option value="progress">En tránsito</option>
            <option value="review">En revisión</option>
            <option value="done">Completado</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
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
            onClick={onSubmit}
            style={{
              background: '#FFCB3D',
              color: '#1e1b16',
              border: '2.5px solid #1e1b16',
              fontFamily: "'Nunito', sans-serif",
              fontSize: 13.5,
              fontWeight: 800,
              padding: '11px 18px',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '4px 4px 0 #1e1b16',
            }}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
