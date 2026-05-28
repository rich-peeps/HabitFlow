import { Link } from 'react-router-dom';
import { useAuth } from '../auth';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '0.5rem 1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/">Today</Link>
      <Link to="/habits">Habits</Link>
      <div style={{ marginLeft: 'auto' }}>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>{user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>{' '}
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}