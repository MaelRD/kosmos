function navButtonStyle(active) {
  return {
    padding: '8px 14px',
    borderRadius: 10,
    border: '2px solid',
    borderColor: active ? '#1e1b16' : 'transparent',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    background: active ? '#ffcb3d' : 'transparent',
    color: '#1e1b16',
  };
}

export default function Header({
  activeNav,
  onNavChange,
  currentUser,
  userMenuOpen,
  onToggleUserMenu,
  onLogout,
}) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 24px',
        height: 66,
        background: '#fffaf0',
        borderBottom: '3px solid #1e1b16',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src="/assets/mascot-crayon.png"
          alt="Kosmos mascot"
          style={{
            width: 36,
            height: 36,
            objectFit: 'contain',
            animation: 'bob 3.6s ease-in-out infinite',
          }}
        />
        <div
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 800,
            fontSize: 19,
            letterSpacing: 0.5,
          }}
        >
          KOSMOS
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
        <button onClick={() => onNavChange('board')} style={navButtonStyle(activeNav === 'board')}>
          Tablero
        </button>
        <button onClick={() => onNavChange('backlog')} style={navButtonStyle(activeNav === 'backlog')}>
          Backlog
        </button>
        <button onClick={() => onNavChange('agenda')} style={navButtonStyle(activeNav === 'agenda')}>
          Agenda
        </button>
        <button
          onClick={() => onNavChange('reports')}
          style={navButtonStyle(activeNav === 'reports')}
        >
          Informes
        </button>
      </div>

      <div style={{ flex: 1 }} />

      {currentUser && (
        <div style={{ position: 'relative' }}>
          <div
            onClick={onToggleUserMenu}
            title={currentUser.name}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 800,
              color: '#1e1b16',
              background: currentUser.color,
              border: '2px solid #1e1b16',
              flex: 'none',
              cursor: 'pointer',
            }}
          >
            {currentUser.initial}
          </div>
          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 40,
                right: 0,
                zIndex: 30,
                background: '#ffffff',
                border: '2.5px solid #1e1b16',
                borderRadius: 14,
                padding: 10,
                minWidth: 180,
                boxShadow: '4px 4px 0 #1e1b16',
              }}
            >
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: '#1e1b16',
                  padding: '4px 8px 8px',
                  borderBottom: '1.5px solid #f0e9d8',
                  marginBottom: 6,
                }}
              >
                {currentUser.name}
              </div>
              <button
                onClick={onLogout}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#fff1d8',
                  border: '2px solid #1e1b16',
                  color: '#1e1b16',
                  fontFamily: 'inherit',
                  fontSize: 12.5,
                  fontWeight: 800,
                  padding: '8px 10px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
