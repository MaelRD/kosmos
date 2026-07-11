import { useEffect, useState } from 'react';
import AgendaEventModal from './AgendaEventModal';
import GoogleCalendarConnectModal from './GoogleCalendarConnectModal';
import ExternalEventDetailModal from './ExternalEventDetailModal';
import { createAgendaEvent, deleteAgendaEvent, listAgendaEvents, listExternalEvents, updateAgendaEvent } from '../api';
import {
  HOUR_START,
  HOUR_END,
  addDays,
  combineDayAndHour,
  dayLabel,
  formatHour,
  formatTime,
  isSameDay,
  startOfWeek,
  weekDays,
  weekRangeLabel,
} from '../dateUtils';

const HOUR_HEIGHT = 56;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

export default function AgendaView({ currentUser, membersList }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [events, setEvents] = useState([]);
  const [externalEvents, setExternalEvents] = useState([]);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [externalDetail, setExternalDetail] = useState(null);

  const days = weekDays(weekStart);
  const members = membersList || [];

  useEffect(() => {
    const from = weekStart.toISOString();
    const to = addDays(weekStart, 7).toISOString();
    listAgendaEvents(from, to)
      .then((data) =>
        setEvents(
          data.map((ev) => ({ ...ev, startsAt: new Date(ev.startsAt), endsAt: new Date(ev.endsAt) }))
        )
      )
      .catch((err) => setError(err.message));
    listExternalEvents(from, to)
      .then((data) =>
        setExternalEvents(
          data.map((ev) => ({ ...ev, startsAt: new Date(ev.startsAt), endsAt: new Date(ev.endsAt) }))
        )
      )
      .catch(() => setExternalEvents([]));
  }, [weekStart]);

  const memberByEmail = (email) => members.find((m) => m.email === email);

  const openCreateModal = (day, hour) => {
    if (members.length === 0) return;
    const start = combineDayAndHour(day, hour);
    const end = combineDayAndHour(day, hour + 1);
    setModal({
      mode: 'create',
      initial: { title: '', startsAt: start, endsAt: end, assigneeEmail: currentUser?.email },
    });
  };

  const openEditModal = (event) => {
    setModal({
      mode: 'edit',
      eventId: event.id,
      initial: {
        title: event.title,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        assigneeEmail: event.assigneeEmail,
      },
    });
  };

  const closeModal = () => setModal(null);

  const refetch = () => {
    const from = weekStart.toISOString();
    const to = addDays(weekStart, 7).toISOString();
    listAgendaEvents(from, to).then((data) =>
      setEvents(data.map((ev) => ({ ...ev, startsAt: new Date(ev.startsAt), endsAt: new Date(ev.endsAt) })))
    );
  };

  const refetchExternal = () => {
    const from = weekStart.toISOString();
    const to = addDays(weekStart, 7).toISOString();
    listExternalEvents(from, to)
      .then((data) =>
        setExternalEvents(data.map((ev) => ({ ...ev, startsAt: new Date(ev.startsAt), endsAt: new Date(ev.endsAt) })))
      )
      .catch(() => setExternalEvents([]));
  };

  const handleSave = async (payload) => {
    if (modal.mode === 'edit') {
      await updateAgendaEvent(modal.eventId, payload);
    } else {
      await createAgendaEvent(payload);
    }
    closeModal();
    refetch();
  };

  const handleDelete = async () => {
    await deleteAgendaEvent(modal.eventId);
    closeModal();
    refetch();
  };

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
            Agenda
          </div>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 28, fontWeight: 800, marginTop: 4 }}>
            Semana de la misión
          </div>
        </div>
        <button
          onClick={() => setCalendarModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#ffffff',
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
          <svg width="16" height="16" viewBox="0 0 48 48" style={{ marginRight: 8, verticalAlign: -3 }}>
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l6-6C33.6 6.5 29 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.5-.2-2.9-.4-4.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c2.8 0 5.3 1 7.3 2.7l6-6C33.6 6.5 29 4.5 24 4.5c-7.6 0-14.1 4.3-17.7 10.2z"
            />
            <path
              fill="#4CAF50"
              d="M24 45.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.6 26.7 37.5 24 37.5c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.8 40.9 16.3 45.5 24 45.5z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C40.9 36 44.5 31 44.5 25c0-1.5-.2-2.9-.4-4.5z"
            />
          </svg>
          Conectar con Google Calendar
        </button>
      </div>

      {calendarModalOpen && (
        <GoogleCalendarConnectModal
          onClose={() => {
            setCalendarModalOpen(false);
            refetchExternal();
          }}
        />
      )}

      {members.length === 0 && (
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: '#6b6558',
            marginBottom: 16,
          }}
        >
          Cargando tripulación…
        </div>
      )}

      {error && (
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: '#1e1b16',
            background: '#ffe1e1',
            border: '2px solid #1e1b16',
            borderRadius: 10,
            padding: '9px 11px',
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setWeekStart((w) => addDays(w, -7))}
            style={navButtonStyle}
          >
            ← Anterior
          </button>
          <button onClick={() => setWeekStart(startOfWeek(new Date()))} style={navButtonStyle}>
            Hoy
          </button>
          <button onClick={() => setWeekStart((w) => addDays(w, 7))} style={navButtonStyle}>
            Siguiente →
          </button>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1e1b16' }}>{weekRangeLabel(weekStart)}</div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '2.5px solid #1e1b16',
          borderRadius: 18,
          boxShadow: '5px 5px 0 #1e1b16',
          overflow: 'auto',
        }}
      >
        <div style={{ display: 'flex', minWidth: 760 }}>
          <div style={{ width: 56, flex: 'none' }}>
            <div style={{ height: 40 }} />
            {HOURS.map((h) => (
              <div
                key={h}
                style={{
                  height: HOUR_HEIGHT,
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: '#b8b0a0',
                  textAlign: 'right',
                  paddingRight: 8,
                  boxSizing: 'border-box',
                  borderTop: '1.5px solid #f0e9d8',
                }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>

          {days.map((day) => {
            const today = isSameDay(day, new Date());
            const dayEvents = events.filter((ev) => isSameDay(ev.startsAt, day));
            const dayExternalEvents = externalEvents.filter((ev) => isSameDay(ev.startsAt, day));
            return (
              <div key={day.toISOString()} style={{ flex: 1, minWidth: 96, borderLeft: '1.5px solid #f0e9d8' }}>
                <div
                  style={{
                    height: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: today ? '#1e1b16' : '#6b6558',
                    background: today ? '#fff1d8' : 'transparent',
                  }}
                >
                  <div>{dayLabel(day)}</div>
                  <div>{day.getDate()}</div>
                </div>

                <div style={{ position: 'relative', height: HOUR_HEIGHT * HOURS.length }}>
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      onClick={() => openCreateModal(day, h)}
                      style={{
                        height: HOUR_HEIGHT,
                        borderTop: '1.5px solid #f0e9d8',
                        cursor: members.length ? 'pointer' : 'default',
                      }}
                    />
                  ))}

                  {dayEvents.map((ev) => {
                    const startMinutes = (ev.startsAt.getHours() - HOUR_START) * 60 + ev.startsAt.getMinutes();
                    const durationMinutes = (ev.endsAt - ev.startsAt) / 60000;
                    const top = (startMinutes / 60) * HOUR_HEIGHT;
                    const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 24);
                    const member = memberByEmail(ev.assigneeEmail);
                    const color = member?.colorHex || '#9B7BFF';
                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(ev);
                        }}
                        style={{
                          position: 'absolute',
                          top,
                          height,
                          left: 3,
                          right: 3,
                          background: color,
                          border: '2px solid #1e1b16',
                          borderRadius: 8,
                          padding: '3px 6px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          boxShadow: '2px 2px 0 #1e1b16',
                        }}
                      >
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: '#1e1b16', lineHeight: 1.2 }}>
                          {ev.title}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#1e1b16', opacity: 0.75 }}>
                          {formatTime(ev.startsAt)}–{formatTime(ev.endsAt)}
                        </div>
                      </div>
                    );
                  })}

                  {dayExternalEvents.map((ev) => {
                    const startMinutes = (ev.startsAt.getHours() - HOUR_START) * 60 + ev.startsAt.getMinutes();
                    const durationMinutes = (ev.endsAt - ev.startsAt) / 60000;
                    const top = (startMinutes / 60) * HOUR_HEIGHT;
                    const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 24);
                    return (
                      <div
                        key={ev.uid || `${ev.sourceLabel}-${ev.startsAt.toISOString()}`}
                        title={`${ev.sourceLabel}: ${ev.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExternalDetail(ev);
                        }}
                        style={{
                          position: 'absolute',
                          top,
                          height,
                          left: 3,
                          right: 3,
                          background: 'repeating-linear-gradient(45deg, #e9e4d6, #e9e4d6 6px, #f7f3e7 6px, #f7f3e7 12px)',
                          border: '2px dashed #6b6558',
                          borderRadius: 8,
                          padding: '3px 6px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: '#6b6558', lineHeight: 1.2 }}>
                          📅 {ev.title} {ev.meetUrl ? '🎥' : ''}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#6b6558', opacity: 0.75 }}>
                          {formatTime(ev.startsAt)}–{formatTime(ev.endsAt)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modal && (
        <AgendaEventModal
          mode={modal.mode}
          initial={modal.initial}
          members={members}
          onSave={handleSave}
          onDelete={modal.mode === 'edit' ? handleDelete : undefined}
          onClose={closeModal}
        />
      )}

      {externalDetail && (
        <ExternalEventDetailModal event={externalDetail} onClose={() => setExternalDetail(null)} />
      )}
    </div>
  );
}

const navButtonStyle = {
  background: '#ffffff',
  border: '2px solid #1e1b16',
  color: '#1e1b16',
  fontFamily: 'inherit',
  fontSize: 12.5,
  fontWeight: 800,
  padding: '7px 12px',
  borderRadius: 10,
  cursor: 'pointer',
};
