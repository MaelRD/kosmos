import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Starfield from '../components/Starfield';
import Header from '../components/Header';
import BoardView from '../components/BoardView';
import BacklogView from '../components/BacklogView';
import ReportsView from '../components/ReportsView';
import AgendaView from '../components/AgendaView';
import CrewView from '../components/CrewView';
import TaskModal from '../components/TaskModal';
import CreateModal from '../components/CreateModal';
import {
  assignCompanies,
  createTask,
  deleteTask,
  listCompanies,
  listCompanyAssignments,
  listTasks,
  listUsers,
  moveTask,
  updateTask,
} from '../api';

const SHOW_POINTS = true;
const COMPACT = false;

function emptyNewTask(assignee) {
  return {
    title: '',
    type: 'task',
    priority: 'medium',
    assignee: assignee || '',
    column: 'todo',
    points: '3',
    label: 'Navegación',
  };
}

export default function BoardPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [taskError, setTaskError] = useState('');
  const [filters, setFilters] = useState({ search: '', assignee: 'all', priorities: [] });
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState(emptyNewTask());
  const [dragTaskId, setDragTaskId] = useState(null);
  const [dragOverInfo, setDragOverInfo] = useState(null);
  const [viewMode, setViewMode] = useState('status');
  const [activeNav, setActiveNav] = useState('board');
  const [rawUser, setRawUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [members, setMembers] = useState({});
  const [membersList, setMembersList] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyAssignments, setCompanyAssignments] = useState({});

  useEffect(() => {
    let token = null;
    let stored = null;
    try {
      token = localStorage.getItem('kosmos_token');
      stored = JSON.parse(localStorage.getItem('kosmos_user'));
    } catch {
      // malformed storage — treated as logged out below
    }
    if (!token || !stored) {
      navigate('/');
      return;
    }
    setRawUser(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!rawUser) return;
    listUsers()
      .then((users) => {
        const map = Object.fromEntries(users.map((u) => [u.name, u.colorHex]));
        setMembers(map);
        setMembersList(users);
        setNewTask((nt) => (nt.assignee ? nt : { ...nt, assignee: rawUser.name }));
      })
      .catch(() => {
        // crew list failed to load — board still works, just without real member colors/options
      });
    listTasks()
      .then(setTasks)
      .catch((err) => setTaskError(err.message));
    listCompanies()
      .then(setCompanies)
      .catch(() => {
        // company catalog failed to load — crew view still works, just without assignment
      });
    listCompanyAssignments()
      .then((rows) => {
        const map = Object.fromEntries(rows.map((r) => [r.userId, r.companyIds]));
        setCompanyAssignments(map);
      })
      .catch(() => {
        // assignments failed to load — crew view still works, just shows none assigned
      });
  }, [rawUser]);

  const handleAssignCompanies = (userId, companyIds) => {
    setCompanyAssignments((prev) => ({ ...prev, [userId]: companyIds }));
    assignCompanies(userId, companyIds).catch((err) => setTaskError(err.message));
  };

  const currentUser = rawUser && {
    name: rawUser.name,
    email: rawUser.email,
    initial: rawUser.name.charAt(0).toUpperCase(),
    color: members[rawUser.name] || '#9B7BFF',
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('kosmos_user');
      localStorage.removeItem('kosmos_token');
    } catch {
      // localStorage unavailable — nothing to clean up
    }
    navigate('/');
  };

  const cardGap = COMPACT ? '8px' : '12px';
  const boardGap = COMPACT ? '12px' : '18px';

  const weight = (t) => parseInt(t.points, 10) || 1;
  const doneCounts = {};
  tasks.forEach((t) => {
    if (t.column === 'done') doneCounts[t.assignee] = (doneCounts[t.assignee] || 0) + weight(t);
  });
  let topPerformerName = null;
  let topCount = 0;
  Object.keys(doneCounts).forEach((name) => {
    if (doneCounts[name] > topCount) {
      topCount = doneCounts[name];
      topPerformerName = name;
    }
  });

  const onCardDragStart = (e, taskId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    setDragTaskId(taskId);
  };

  const onCardDragOver = (e, taskId, columnId) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY - rect.top < rect.height / 2 ? 'before' : 'after';
    setDragOverInfo((cur) => {
      if (!cur || cur.taskId !== taskId || cur.position !== position) {
        return { column: columnId, taskId, position };
      }
      return cur;
    });
  };

  const onColumnDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverInfo((cur) => {
      if (!cur || cur.column !== columnId || cur.taskId !== null) {
        return { column: columnId, taskId: null };
      }
      return cur;
    });
  };

  const onCardDragEnd = () => {
    setDragTaskId(null);
    setDragOverInfo(null);
  };

  const onDrop = (e, currentViewMode) => {
    e.preventDefault();
    if (!dragTaskId) return;
    const field = currentViewMode === 'person' ? 'assignee' : 'column';
    const list = tasks.slice();
    const fromIdx = list.findIndex((t) => t.id === dragTaskId);
    if (fromIdx === -1) {
      setDragTaskId(null);
      setDragOverInfo(null);
      return;
    }
    const [moved] = list.splice(fromIdx, 1);
    const targetColumn = (dragOverInfo && dragOverInfo.column) || moved[field];
    moved[field] = targetColumn;
    let insertIdx = list.length;
    if (dragOverInfo && dragOverInfo.taskId) {
      const overIdx = list.findIndex((t) => t.id === dragOverInfo.taskId);
      if (overIdx !== -1) insertIdx = dragOverInfo.position === 'before' ? overIdx : overIdx + 1;
    } else if (dragOverInfo) {
      let lastIdx = -1;
      list.forEach((t, i) => {
        if (t[field] === targetColumn) lastIdx = i;
      });
      insertIdx = lastIdx + 1;
    }
    list.splice(insertIdx, 0, moved);
    setTasks(list);
    setDragTaskId(null);
    setDragOverInfo(null);

    const targetPosition = list.slice(0, insertIdx).filter((t) => t.column === moved.column).length;
    moveTask(moved.id, { targetColumn: moved.column, targetAssignee: moved.assignee, targetPosition })
      .then((updated) => setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t))))
      .catch((err) => setTaskError(err.message));
  };

  const updateSelectedTask = (field, value) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTaskId ? { ...t, [field]: value } : t))
    );
  };

  const closeTaskModal = () => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    setSelectedTaskId(null);
    if (!task) return;
    updateTask(task.id, task)
      .then((updated) => setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t))))
      .catch((err) => setTaskError(err.message));
  };

  const deleteSelectedTask = () => {
    const id = selectedTaskId;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSelectedTaskId(null);
    deleteTask(id).catch((err) => setTaskError(err.message));
  };

  const openCreateFromColumn = (columnId, assignee) => {
    setNewTask((nt) => ({ ...nt, column: columnId, assignee: assignee || nt.assignee }));
    setIsCreating(true);
  };

  const submitNewTask = () => {
    if (!newTask.title.trim()) return;
    setIsCreating(false);
    createTask(newTask)
      .then((created) => {
        setTasks((prev) => [...prev, created]);
        setNewTask(emptyNewTask(currentUser?.name));
      })
      .catch((err) => setTaskError(err.message));
  };

  const selectedTask = selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff8ec',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: "'Nunito', sans-serif",
        color: '#1e1b16',
      }}
    >
      <Starfield />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header
          activeNav={activeNav}
          onNavChange={setActiveNav}
          currentUser={currentUser}
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={() => setUserMenuOpen((open) => !open)}
          onLogout={handleLogout}
        />

        {taskError && (
          <div
            style={{
              margin: '0 28px',
              fontSize: 12.5,
              fontWeight: 700,
              color: '#1e1b16',
              background: '#ffe1e1',
              border: '2px solid #1e1b16',
              borderRadius: 10,
              padding: '9px 11px',
            }}
          >
            {taskError}
          </div>
        )}

        {activeNav === 'board' && (
          <BoardView
            tasks={tasks}
            members={members}
            filters={filters}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            topPerformerName={topPerformerName}
            cardGap={cardGap}
            boardGap={boardGap}
            showPoints={SHOW_POINTS}
            dragTaskId={dragTaskId}
            dragOverInfo={dragOverInfo}
            onCardDragStart={onCardDragStart}
            onCardDragOver={onCardDragOver}
            onColumnDragOver={onColumnDragOver}
            onCardDragEnd={onCardDragEnd}
            onDrop={onDrop}
            onOpenTask={setSelectedTaskId}
            onOpenCreateFromColumn={openCreateFromColumn}
            onOpenCreateFromHeader={() => setIsCreating(true)}
          />
        )}

        {activeNav === 'backlog' && (
          <BacklogView
            tasks={tasks}
            members={members}
            onOpenTask={setSelectedTaskId}
            onCreate={() => openCreateFromColumn('todo')}
          />
        )}

        {activeNav === 'reports' && (
          <ReportsView tasks={tasks} members={members} topPerformerName={topPerformerName} />
        )}

        {activeNav === 'agenda' && (
          <AgendaView currentUser={currentUser} membersList={membersList} />
        )}

        {activeNav === 'crew' && (
          <CrewView
            tasks={tasks}
            membersList={membersList}
            companies={companies}
            companyAssignments={companyAssignments}
            onAssignCompanies={handleAssignCompanies}
            onOpenTask={setSelectedTaskId}
          />
        )}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          members={members}
          onClose={closeTaskModal}
          onChange={updateSelectedTask}
          onDelete={deleteSelectedTask}
        />
      )}

      {isCreating && (
        <CreateModal
          newTask={newTask}
          members={members}
          onChange={(field, value) => setNewTask((nt) => ({ ...nt, [field]: value }))}
          onClose={() => setIsCreating(false)}
          onSubmit={submitNewTask}
        />
      )}
    </div>
  );
}
