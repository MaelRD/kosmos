import { COLUMNS, PRIORITIES } from '../constants';
import TaskCard from './TaskCard';

const selectStyle = {
  background: '#ffffff',
  border: '2.5px solid #1e1b16',
  borderRadius: 12,
  padding: '10px 14px',
  color: '#1e1b16',
  fontSize: 13,
  fontWeight: 700,
  fontFamily: 'inherit',
  outline: 'none',
};

export default function BoardView({
  tasks,
  members,
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  topPerformerName,
  cardGap,
  boardGap,
  showPoints,
  dragTaskId,
  dragOverInfo,
  onCardDragStart,
  onCardDragOver,
  onColumnDragOver,
  onCardDragEnd,
  onDrop,
  onOpenTask,
  onOpenCreateFromColumn,
  onOpenCreateFromHeader,
}) {
  const filtered = tasks.filter((t) => {
    const matchesSearch =
      !filters.search || t.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesAssignee = filters.assignee === 'all' || t.assignee === filters.assignee;
    const matchesPriority =
      filters.priorities.length === 0 || filters.priorities.includes(t.priority);
    return matchesSearch && matchesAssignee && matchesPriority;
  });

  const columns =
    viewMode === 'person'
      ? Object.keys(members).map((name) => ({
          id: name,
          title: name,
          tasks: filtered.filter((t) => t.assignee === name),
          avatarInitial: name.charAt(0),
          avatarColor: members[name],
        }))
      : COLUMNS.map((col) => ({
          ...col,
          tasks: filtered.filter((t) => t.column === col.id),
        }));

  const hasActiveFilters = !!(
    filters.search ||
    filters.assignee !== 'all' ||
    filters.priorities.length
  );

  const clearFilters = () => onFiltersChange({ search: '', assignee: 'all', priorities: [] });

  const togglePriority = (id) => {
    const has = filters.priorities.includes(id);
    const priorities = has
      ? filters.priorities.filter((x) => x !== id)
      : [...filters.priorities, id];
    onFiltersChange({ ...filters, priorities });
  };

  return (
    <>
      <div style={{ padding: '28px 28px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
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
              Misión
            </div>
            <div
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: 30,
                fontWeight: 800,
                marginTop: 4,
              }}
            >
              Cinturón de Kuiper
            </div>
          </div>
          <button
            onClick={onOpenCreateFromHeader}
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
            + Nueva tarea
          </button>
        </div>

        {topPerformerName && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 14,
              background: '#fff1d8',
              border: '2.5px solid #1e1b16',
              borderRadius: 14,
              padding: '8px 14px 8px 8px',
              boxShadow: '3px 3px 0 #1e1b16',
            }}
          >
            <img
              src="/assets/workaholic-pup.png"
              alt=""
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2.5px solid #1e1b16',
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1e1b16' }}>
              👑 El workaholic del día es{' '}
              <span style={{ color: '#ff6fa5' }}>{topPerformerName}</span>
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginTop: 22,
          }}
        >
          <input
            type="text"
            placeholder="Buscar tareas…"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            style={{
              flex: '0 0 240px',
              background: '#ffffff',
              border: '2.5px solid #1e1b16',
              borderRadius: 12,
              padding: '10px 14px',
              color: '#1e1b16',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />

          <select
            value={filters.assignee}
            onChange={(e) => onFiltersChange({ ...filters, assignee: e.target.value })}
            style={selectStyle}
          >
            <option value="all">Toda la tripulación</option>
            {Object.keys(members).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {Object.keys(PRIORITIES).map((id) => {
              const active = filters.priorities.includes(id);
              const pr = PRIORITIES[id];
              return (
                <button
                  key={id}
                  onClick={() => togglePriority(id)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 20,
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: '2px solid #1e1b16',
                    background: active ? pr.color : '#ffffff',
                    color: '#1e1b16',
                  }}
                >
                  {pr.label}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b6558',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Limpiar filtros
            </button>
          )}

          <div style={{ flex: 1 }} />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              background: '#ffffff',
              border: '2.5px solid #1e1b16',
              borderRadius: 12,
              padding: 3,
            }}
          >
            <button
              onClick={() => onViewModeChange('status')}
              style={{
                padding: '7px 14px',
                borderRadius: 9,
                border: 'none',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
                background: viewMode === 'status' ? '#ffcb3d' : 'transparent',
                color: '#1e1b16',
              }}
            >
              Por estado
            </button>
            <button
              onClick={() => onViewModeChange('person')}
              style={{
                padding: '7px 14px',
                borderRadius: 9,
                border: 'none',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
                background: viewMode === 'person' ? '#ffcb3d' : 'transparent',
                color: '#1e1b16',
              }}
            >
              Por persona
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: boardGap,
          padding: '24px 28px 60px',
          overflowX: 'auto',
          alignItems: 'flex-start',
        }}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            data-column={column.id}
            onDragOver={(e) => onColumnDragOver(e, column.id)}
            onDrop={(e) => onDrop(e, viewMode)}
            style={{
              flex: '0 0 290px',
              background:
                dragOverInfo && dragOverInfo.column === column.id ? '#fff1d8' : '#fffdf8',
              border: '2.5px solid #1e1b16',
              borderRadius: 18,
              padding: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2px 4px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {viewMode === 'person' && (
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#1e1b16',
                      background: column.avatarColor,
                      border: '2px solid #1e1b16',
                      flex: 'none',
                    }}
                  >
                    {column.avatarInitial}
                  </div>
                )}
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1e1b16' }}>
                  {column.title}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: '#6b6558',
                    background: '#fff1d8',
                    border: '2px solid #1e1b16',
                    padding: '2px 8px',
                    borderRadius: 20,
                  }}
                >
                  {column.tasks.length}
                </div>
              </div>
              <button
                onClick={() => onOpenCreateFromColumn(viewMode === 'person' ? 'todo' : column.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b6558',
                  fontSize: 20,
                  fontWeight: 800,
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: '2px 6px',
                }}
              >
                +
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: cardGap, minHeight: 60 }}>
              {column.tasks.map((task) => {
                const indicator =
                  dragOverInfo && dragOverInfo.taskId === task.id ? dragOverInfo.position : null;
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    members={members}
                    columnId={column.id}
                    showPoints={showPoints}
                    showColumnTag={viewMode === 'person'}
                    columnLabel={
                      (COLUMNS.find((c) => c.id === task.column) || {}).title || ''
                    }
                    isDragging={task.id === dragTaskId}
                    dropIndicator={indicator}
                    onClick={() => onOpenTask(task.id)}
                    onDragStart={(e) => onCardDragStart(e, task.id)}
                    onDragOver={(e) => onCardDragOver(e, task.id, column.id)}
                    onDragEnd={onCardDragEnd}
                  />
                );
              })}

              {column.tasks.length === 0 && (
                <div
                  style={{
                    padding: '18px 8px',
                    textAlign: 'center',
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#b8b0a0',
                    border: '2.5px dashed #d8cdb2',
                    borderRadius: 14,
                  }}
                >
                  Sin tareas aquí
                </div>
              )}

              <button
                onClick={() => onOpenCreateFromColumn(viewMode === 'person' ? 'todo' : column.id)}
                style={{
                  marginTop: 2,
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  color: '#6b6558',
                  fontSize: 12.5,
                  fontWeight: 800,
                  padding: '8px 6px',
                  cursor: 'pointer',
                  borderRadius: 8,
                }}
              >
                + Añadir tarea
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
