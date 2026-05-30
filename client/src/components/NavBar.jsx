import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.75rem 1.5rem',
  borderBottom: '1px solid var(--border)',
  backgroundColor: 'var(--accent)',
  color: 'white',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 500,
};

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav style={navStyle}>
      <Link
        to="/"
        style={{
          ...linkStyle,
          fontWeight: 700,
          fontSize: '1.2rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginRight: '1.5rem',
        }}
      >
        HabitFlow
      </Link>

      <Link to="/" style={linkStyle}>
        Today
      </Link>
      <Link to="/habits" style={linkStyle}>
        Habits
      </Link>

      <div style={{ marginLeft: 'auto' }}>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>{user.username}</span>
            <button
              onClick={logout}
              style={{
                backgroundColor: 'white',
                color: 'var(--accent)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '0.25rem 0.75rem',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>{' '}
            <Link to="/signup" style={linkStyle}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}