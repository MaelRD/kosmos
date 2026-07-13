import { useState } from 'react';
import { COLUMNS, PRIORITIES } from '../constants';

export default function CrewView({
  tasks,
  membersList,
  companies,
  companyAssignments,
  onAssignCompanies,
  onOpenTask,
}) {
  const [openPickerId, setOpenPickerId] = useState(null);

  const weight = (t) => parseInt(t.points, 10) || 1;
  const columnLabel = (id) => (COLUMNS.find((c) => c.id === id) || {}).title || id;

  const crew = membersList.map((member) => {
    const assigned = tasks.filter((t) => t.assignee === member.name);
    const done = assigned.filter((t) => t.column === 'done');
    const active = assigned.filter((t) => t.column !== 'done');
    const points = assigned.reduce((sum, t) => sum + weight(t), 0);
    const donePoints = done.reduce((sum, t) => sum + weight(t), 0);
    const pct = assigned.length ? Math.round((done.length / assigned.length) * 100) : 0;
    const companyIds = companyAssignments[member.id] || [];
    const assignedCompanies = companies.filter((c) => companyIds.includes(c.id));
    const availableCompanies = companies.filter((c) => !companyIds.includes(c.id));
    return { ...member, assigned, done, active, points, donePoints, pct, companyIds, assignedCompanies, availableCompanies };
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
        Tripulación
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
        La nave y su gente
      </div>

      {crew.length === 0 && (
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
          Sin tripulantes todavía.
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 18,
        }}
      >
        {crew.map((member) => (
          <div
            key={member.id}
            style={{
              background: '#ffffff',
              border: '2.5px solid #1e1b16',
              borderRadius: 18,
              padding: 18,
              boxShadow: '5px 5px 0 #1e1b16',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#1e1b16',
                  background: member.colorHex,
                  border: '2.5px solid #1e1b16',
                  flex: 'none',
                }}
              >
                {member.initial}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#1e1b16',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {member.name}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: '#6b6558',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {member.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#1e1b16',
                  background: '#e9f0ff',
                  border: '1.5px solid #1e1b16',
                  padding: '4px 10px',
                  borderRadius: 20,
                }}
              >
                {member.assigned.length} asignadas
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#1e1b16',
                  background: '#e4f9f0',
                  border: '1.5px solid #1e1b16',
                  padding: '4px 10px',
                  borderRadius: 20,
                }}
              >
                {member.done.length} completadas ({member.pct}%)
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#1e1b16',
                  background: '#f4efe2',
                  border: '1.5px solid #d8cdb2',
                  padding: '4px 10px',
                  borderRadius: 20,
                }}
              >
                {member.donePoints} / {member.points} pts
              </div>
            </div>

            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#6b6558', marginBottom: 8 }}>
              EMPRESAS A CARGO
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {member.assignedCompanies.length === 0 && (
                <div style={{ fontSize: 12, fontWeight: 700, color: '#b8b0a0' }}>
                  Ninguna asignada.
                </div>
              )}
              {member.assignedCompanies.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#1e1b16',
                    background: '#fff1d8',
                    border: '1.5px solid #1e1b16',
                    padding: '4px 6px 4px 10px',
                    borderRadius: 20,
                  }}
                >
                  {c.name}
                  <button
                    onClick={() =>
                      onAssignCompanies(
                        member.id,
                        member.companyIds.filter((id) => id !== c.id)
                      )
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#6b6558',
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div style={{ position: 'relative', marginBottom: 18 }}>
              <button
                onClick={() => setOpenPickerId(openPickerId === member.id ? null : member.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b6558',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                + Empresa
              </button>
              {openPickerId === member.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 6,
                    background: '#ffffff',
                    border: '2.5px solid #1e1b16',
                    borderRadius: 12,
                    boxShadow: '4px 4px 0 #1e1b16',
                    padding: 6,
                    zIndex: 10,
                    maxHeight: 220,
                    overflowY: 'auto',
                    minWidth: 220,
                  }}
                >
                  {member.availableCompanies.length === 0 && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#b8b0a0', padding: '6px 10px' }}>
                      Todas asignadas.
                    </div>
                  )}
                  {member.availableCompanies.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onAssignCompanies(member.id, [...member.companyIds, c.id]);
                        setOpenPickerId(null);
                      }}
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: '#1e1b16',
                        padding: '7px 10px',
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#6b6558', marginBottom: 8 }}>
              EN CURSO
            </div>
            {member.active.length === 0 && (
              <div style={{ fontSize: 12, fontWeight: 700, color: '#b8b0a0', marginBottom: 14 }}>
                Nada pendiente ahora mismo.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {member.active.map((task) => {
                const pr = PRIORITIES[task.priority];
                return (
                  <div
                    key={task.id}
                    onClick={() => onOpenTask(task.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      padding: '6px 8px',
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: pr.color,
                        border: '1.5px solid #1e1b16',
                        flex: 'none',
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: '#1e1b16',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {task.title}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#6b6558', flex: 'none' }}>
                      {columnLabel(task.column)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#6b6558', marginBottom: 8 }}>
              COMPLETADAS
            </div>
            {member.done.length === 0 && (
              <div style={{ fontSize: 12, fontWeight: 700, color: '#b8b0a0' }}>
                Todavía ninguna.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {member.done.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onOpenTask(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    padding: '6px 8px',
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontSize: 12.5, flex: 'none' }}>✅</div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#6b6558',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {task.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
