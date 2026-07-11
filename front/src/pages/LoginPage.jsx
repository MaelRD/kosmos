import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginStarfield from '../components/LoginStarfield';
import { register, login, googleAuth } from '../api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CONFIGURED = !!GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'REPLACE_WITH_GOOGLE_CLIENT_ID';

const inputStyle = {
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
};

const fieldLabel = {
  fontSize: 11.5,
  fontWeight: 800,
  color: '#6b6558',
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  marginBottom: 6,
};

function saveSession({ token, user }) {
  try {
    localStorage.setItem('kosmos_token', token);
    localStorage.setItem('kosmos_user', JSON.stringify(user));
  } catch {
    // localStorage unavailable (private mode, etc) — non-fatal, session just won't persist
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showForgotMessage, setShowForgotMessage] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthResult = (result) => {
    saveSession(result);
    navigate('/board');
  };

  const handleGoogleCredential = async (response) => {
    setError('');
    try {
      const result = await googleAuth(response.credential);
      handleAuthResult(result);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!GOOGLE_CONFIGURED) return;

    let cancelled = false;
    const tryInit = () => {
      if (cancelled) return;
      if (!window.google?.accounts?.id) {
        setTimeout(tryInit, 200);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 336,
        });
      }
    };
    tryInit();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'register' ? await register({ email, name, password }) : await login({ email, password });
      handleAuthResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotMessage(true);
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setShowForgotMessage(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff8ec',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Nunito', sans-serif",
        color: '#1e1b16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <LoginStarfield />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            marginBottom: 26,
          }}
        >
          <img
            src="/assets/mascot-crayon.png"
            alt="Kosmos mascot"
            style={{
              width: 64,
              height: 64,
              objectFit: 'contain',
              animation: 'bob 3.6s ease-in-out infinite',
            }}
          />
          <div
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: 0.5,
              color: '#1e1b16',
            }}
          >
            KOSMOS
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '3px solid #1e1b16',
            borderRadius: 24,
            padding: '30px 28px',
            boxShadow: '6px 6px 0 #1e1b16',
          }}
        >
          <div
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {mode === 'register' ? 'Únete a la tripulación' : 'Bienvenido de vuelta'}
          </div>
          <div style={{ fontSize: 13.5, color: '#6b6558', marginBottom: 22, fontWeight: 600 }}>
            {mode === 'register'
              ? 'Crea tu cuenta para empezar la misión'
              : 'Inicia sesión para continuar tu misión'}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: 14 }}>
                <div style={fieldLabel}>Nombre</div>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <div style={fieldLabel}>Correo</div>
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <div style={fieldLabel}>Contraseña</div>
                {mode === 'login' && (
                  <a
                    href="#"
                    onClick={handleForgotPassword}
                    style={{
                      fontSize: 12,
                      color: '#3e8ede',
                      textDecoration: 'none',
                      fontWeight: 800,
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                )}
              </div>
              <input
                type="password"
                required
                minLength={mode === 'register' ? 8 : undefined}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            {showForgotMessage && (
              <div
                style={{
                  fontSize: 12.5,
                  color: '#1e1b16',
                  fontWeight: 700,
                  background: '#fff1d8',
                  border: '2px solid #1e1b16',
                  borderRadius: 10,
                  padding: '9px 11px',
                  marginTop: 10,
                }}
              >
                Te enviamos un enlace de recuperación a tu correo. 🚀
              </div>
            )}

            {error && (
              <div
                style={{
                  fontSize: 12.5,
                  color: '#1e1b16',
                  fontWeight: 700,
                  background: '#ffe1e1',
                  border: '2px solid #1e1b16',
                  borderRadius: 10,
                  padding: '9px 11px',
                  marginTop: 10,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                marginTop: 18,
                background: '#ffcb3d',
                color: '#1e1b16',
                border: '2.5px solid #1e1b16',
                fontFamily: 'inherit',
                fontSize: 15,
                fontWeight: 800,
                padding: 12,
                borderRadius: 14,
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '4px 4px 0 #1e1b16',
              }}
            >
              {loading ? 'Un momento…' : mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
            <div style={{ flex: 1, height: 2.5, background: '#1e1b16', borderRadius: 2 }} />
            <div style={{ fontSize: 11, color: '#6b6558', fontWeight: 800 }}>O CONTINÚA CON</div>
            <div style={{ flex: 1, height: 2.5, background: '#1e1b16', borderRadius: 2 }} />
          </div>

          {GOOGLE_CONFIGURED ? (
            <div ref={googleButtonRef} style={{ display: 'flex', justifyContent: 'center' }} />
          ) : (
            <button
              type="button"
              onClick={() =>
                setError(
                  'Google Sign-In no está configurado todavía (falta VITE_GOOGLE_CLIENT_ID).'
                )
              }
              style={{
                width: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: '#ffffff',
                border: '2.5px solid #1e1b16',
                color: '#1e1b16',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 800,
                padding: 11,
                borderRadius: 14,
                cursor: 'pointer',
                boxShadow: '3px 3px 0 #1e1b16',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 48 48">
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
              Continuar con Google
            </button>
          )}
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 13,
            color: '#6b6558',
            fontWeight: 700,
          }}
        >
          {mode === 'register' ? (
            <>
              ¿Ya tienes cuenta?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  switchMode('login');
                }}
                style={{ color: '#3e8ede', fontWeight: 800, textDecoration: 'none' }}
              >
                Inicia sesión
              </a>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  switchMode('register');
                }}
                style={{ color: '#3e8ede', fontWeight: 800, textDecoration: 'none' }}
              >
                Regístrate
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
