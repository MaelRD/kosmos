import { PRIORITIES } from '../constants';

const th = {
  textAlign: 'left',
  padding: '12px 14px',
  fontSize: 11,
  fontWeight: 800,
  color: '#6b6558',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  borderBottom: '2.5px solid #1e1b16',
};

const thRight = { ...th, textAlign: 'right' };

export default function ReportsView({ tasks, members, topPerformerName }) {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.column === 'done').length;
  const progressTasks = tasks.filter((t) => t.column === 'progress').length;
  const pctDone = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const doneTasksWithTime = tasks.filter(
    (t) => t.column === 'done' && typeof t.resolutionDays === 'number'
  );
  const avgResolutionDays = doneTasksWithTime.length
    ? Math.round(
        (doneTasksWithTime.reduce((sum, t) => sum + t.resolutionDays, 0) /
          doneTasksWithTime.length) *
          10
      ) / 10
    : null;

  const weight = (t) => parseInt(t.points, 10) || 1;

  const totalPoints = tasks.reduce((sum, t) => sum + weight(t), 0);
  const donePoints = tasks.filter((t) => t.column === 'done').reduce((sum, t) => sum + weight(t), 0);
  const pctPointsDone = totalPoints ? Math.round((donePoints / totalPoints) * 100) : 0;

  let mostActiveName = null;
  let mostActiveWeight = 0;
  Object.keys(members).forEach((name) => {
    const w = tasks.filter((t) => t.assignee === name).reduce((sum, t) => sum + weight(t), 0);
    if (w > mostActiveWeight) {
      mostActiveWeight = w;
      mostActiveName = name;
    }
  });

  const summaryCards = [
    { label: 'Total de tareas', value: totalTasks, color: '#1e1b16' },
    { label: 'Completadas', value: doneTasks, color: '#2ec4b6' },
    { label: 'En tránsito', value: progressTasks, color: '#3e8ede' },
    { label: '% completado', value: pctDone + '%', color: '#ff6fa5' },
    {
      label: 'Puntos completados',
      value: `${donePoints} / ${totalPoints} (${pctPointsDone}%)`,
      color: '#2ec4b6',
    },
    {
      label: 'Tiempo prom. resolución',
      value: avgResolutionDays !== null ? avgResolutionDays + ' días' : '—',
      color: '#9b7bff',
    },
    {
      label: 'Más carga de trabajo',
      value: mostActiveName ? `${mostActiveName} (${mostActiveWeight} pts)` : '—',
      color: '#ffb238',
    },
  ];

  const memberStats = Object.keys(members)
    .map((name) => {
      const assignedTasks = tasks.filter((t) => t.assignee === name);
      const doneCount = assignedTasks.filter((t) => t.column === 'done').length;
      const pct = assignedTasks.length ? Math.round((doneCount / assignedTasks.length) * 100) : 0;
      const assignedPoints = assignedTasks.reduce((sum, t) => sum + weight(t), 0);
      const donePointsForMember = assignedTasks
        .filter((t) => t.column === 'done')
        .reduce((sum, t) => sum + weight(t), 0);
      const doneWithTime = assignedTasks.filter(
        (t) => t.column === 'done' && typeof t.resolutionDays === 'number'
      );
      const avgDays = doneWithTime.length
        ? Math.round(
            (doneWithTime.reduce((sum, t) => sum + t.resolutionDays, 0) / doneWithTime.length) * 10
          ) / 10
        : null;
      return {
        name,
        assigned: assignedTasks.length,
        done: doneCount,
        pct,
        pointsLabel: `${donePointsForMember} / ${assignedPoints}`,
        avgDaysLabel: avgDays !== null ? avgDays + ' d' : '—',
        isTop: name === topPerformerName,
        isMostActive: name === mostActiveName,
      };
    })
    .sort((a, b) => b.done - a.done);

  const priorityStats = Object.keys(PRIORITIES).map((id) => {
    const pr = PRIORITIES[id];
    const count = tasks.filter((t) => t.priority === id).length;
    const pct = totalTasks ? Math.round((count / totalTasks) * 100) : 0;
    return { label: pr.label, count, pct, color: pr.color };
  });

  return (
    <div style={{ padding: '28px 28px 60px' }}>
      <div
        style={{
          fontSize: 12,
          letterSpacing: 1.5,
          color: '#6b6558',
          fontWeight: 800,
          textTransform: 'uppercase',
        }}
      >
        Informes
      </div>
      <div
        style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          marginTop: 4,
          marginBottom: 22,
        }}
      >
        Indicadores de la misión
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {summaryCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: '#ffffff',
              border: '2.5px solid #1e1b16',
              borderRadius: 16,
              padding: 16,
              boxShadow: '4px 4px 0 #1e1b16',
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 800,
                color: '#6b6558',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: 30,
                fontWeight: 800,
                marginTop: 6,
                color: card.color,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '2.5px solid #1e1b16',
          borderRadius: 18,
          padding: 6,
          boxShadow: '5px 5px 0 #1e1b16',
          marginBottom: 24,
          overflow: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={th}>Tripulante</th>
              <th style={thRight}>Asignadas</th>
              <th style={thRight}>Completadas</th>
              <th style={thRight}>% Completado</th>
              <th style={thRight}>Tiempo prom.</th>
              <th style={thRight}>Puntos (peso)</th>
            </tr>
          </thead>
          <tbody>
            {memberStats.map((row) => (
              <tr key={row.name} style={{ borderBottom: '1.5px solid #f0e9d8' }}>
                <td
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontWeight: 800,
                    color: '#1e1b16',
                  }}
                >
                  <div
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
                      background: members[row.name],
                      border: '2px solid #1e1b16',
                      flex: 'none',
                    }}
                  >
                    {row.name.charAt(0)}
                  </div>
                  {row.name}
                  {row.isTop && <span>👑</span>}
                  {row.isMostActive && (
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        color: '#1e1b16',
                        background: '#ffb238',
                        border: '1.5px solid #1e1b16',
                        padding: '1px 6px',
                        borderRadius: 8,
                      }}
                    >
                      MÁS CARGA
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#1e1b16' }}>
                  {row.assigned}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#1e1b16' }}>
                  {row.done}
                </td>
                <td
                  style={{
                    padding: '12px 14px',
                    textAlign: 'right',
                    fontWeight: 800,
                    color: row.pct >= 70 ? '#2ec4b6' : row.pct >= 40 ? '#3e8ede' : '#ff4d4d',
                  }}
                >
                  {row.pct}%
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#6b6558' }}>
                  {row.avgDaysLabel}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#9b7bff' }}>
                  {row.pointsLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '2.5px solid #1e1b16',
          borderRadius: 18,
          padding: 20,
          boxShadow: '5px 5px 0 #1e1b16',
        }}
      >
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 16, fontWeight: 800, marginBottom: 14 }}>
          Tareas por prioridad
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {priorityStats.map((p) => (
            <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 80, fontSize: 12.5, fontWeight: 800, color: '#1e1b16' }}>
                {p.label}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 16,
                  background: '#f4efe2',
                  border: '2px solid #1e1b16',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <div style={{ height: '100%', width: `${p.pct}%`, background: p.color }} />
              </div>
              <div style={{ width: 26, textAlign: 'right', fontSize: 12.5, fontWeight: 800, color: '#1e1b16' }}>
                {p.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
