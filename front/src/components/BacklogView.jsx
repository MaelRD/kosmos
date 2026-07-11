import TypeIcon from './TypeIcon';
import { PRIORITIES } from '../constants';

const typeColor = (type) =>
  type === 'story' ? '#FFCB3D' : type === 'task' ? '#3E8EDE' : '#FF4D4D';

export default function BacklogView({ tasks, members, onOpenTask, onCreate }) {
  const items = tasks.filter((t) => t.column === 'backlog');

  return (
    <div style={{ padding: '28px 28px 60px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 1.5,
              color: '#6b6558',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            Backlog
          </div>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 28, fontWeight: 800, marginTop: 4 }}>
            Lo pendiente
          </div>
        </div>
        <button
          onClick={onCreate}
          style={{
            background: '#FFCB3D',
            border: '2.5px solid #1e1b16',
            color: '#1e1b16',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 800,
            padding: '10px 16px',
            borderRadius: 12,
            cursor: 'pointer',
            boxShadow: '3px 3px 0 #1e1b16',
          }}
        >
          + Nuevo pendiente
        </button>
      </div>

      {items.length === 0 && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#6b6558',
            background: '#ffffff',
            border: '2.5px solid #1e1b16',
            borderRadius: 16,
            padding: 20,
            textAlign: 'center',
          }}
        >
          Sin pendientes en el backlog. Todo lo capturado ya está en marcha.
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {items.map((task) => {
          const pr = PRIORITIES[task.priority];
          const memberColor = members[task.assignee] || '#9B7BFF';
          return (
            <div
              key={task.id}
              onClick={() => onOpenTask(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#ffffff',
                border: '2.5px solid #1e1b16',
                borderRadius: 14,
                padding: '12px 16px',
                cursor: 'pointer',
                boxShadow: '3px 3px 0 #1e1b16',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1e1b16',
                  background: typeColor(task.type),
                  border: '2px solid #1e1b16',
                  flex: 'none',
                }}
              >
                <TypeIcon type={task.type} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: '#1e1b16',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {task.title}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 'none' }}>
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: pr.color,
                    border: '1.5px solid #1e1b16',
                  }}
                />
                <div style={{ fontSize: 10.5, color: '#6b6558', fontWeight: 800 }}>{pr.label}</div>
              </div>

              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: '#1e1b16',
                  background: '#f4efe2',
                  border: '1.5px solid #d8cdb2',
                  padding: '3px 8px',
                  borderRadius: 20,
                  flex: 'none',
                }}
              >
                {task.label}
              </div>

              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: '#1e1b16',
                  background: '#e9f0ff',
                  border: '1.5px solid #1e1b16',
                  padding: '2px 7px',
                  borderRadius: 8,
                  flex: 'none',
                }}
              >
                {task.points}
              </div>

              <div
                title={task.assignee}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: '#1e1b16',
                  background: memberColor,
                  border: '2px solid #1e1b16',
                  flex: 'none',
                }}
              >
                {task.assignee.charAt(0)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
