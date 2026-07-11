import TypeIcon from './TypeIcon';
import { PRIORITIES } from '../constants';

const typeColor = (type) =>
  type === 'story' ? '#FFCB3D' : type === 'task' ? '#3E8EDE' : '#FF4D4D';

export default function TaskCard({
  task,
  members,
  columnId,
  compact,
  showPoints,
  showColumnTag,
  columnLabel,
  isDragging,
  dropIndicator,
  onClick,
  onDragStart,
  onDragOver,
  onDragEnd,
}) {
  const pr = PRIORITIES[task.priority];
  const memberColor = members[task.assignee] || '#9B7BFF';

  return (
    <div
      data-task-id={task.id}
      data-column={columnId}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={{
        padding: compact ? 10 : 14,
        borderRadius: 16,
        cursor: 'grab',
        background: '#ffffff',
        border: '2.5px solid #1e1b16',
        boxShadow: '4px 4px 0 #1e1b16',
        opacity: isDragging ? 0.4 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
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
            background: typeColor(task.type),
            border: '2px solid #1e1b16',
          }}
        >
          <TypeIcon type={task.type} />
        </div>
        {dropIndicator && (
          <div
            style={{
              position: 'relative',
              top: dropIndicator === 'before' ? -9 : 9,
              width: '100%',
              height: 3,
              background: '#FFCB3D',
              borderRadius: 2,
            }}
          />
        )}
      </div>

      <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.4, color: '#1e1b16' }}>
        {task.title}
      </div>

      {showColumnTag && (
        <div style={{ marginTop: 8 }}>
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 800,
              color: '#6b6558',
              background: '#f4efe2',
              border: '1.5px solid #d8cdb2',
              padding: '2px 7px',
              borderRadius: 8,
            }}
          >
            {columnLabel}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            color: '#1e1b16',
            background: '#fff1d8',
            border: '1.5px solid #1e1b16',
            padding: '3px 8px',
            borderRadius: 20,
          }}
        >
          {task.label}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showPoints && (
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                color: '#1e1b16',
                background: '#e9f0ff',
                border: '1.5px solid #1e1b16',
                padding: '2px 7px',
                borderRadius: 8,
              }}
            >
              {task.points}
            </div>
          )}
          <div
            title={task.assignee}
            style={{
              width: 24,
              height: 24,
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
      </div>
    </div>
  );
}
