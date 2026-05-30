import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import { getToday, createHabitEntry, updateHabitEntry } from '../api';
import { useNavigate } from 'react-router-dom';

export default function TodayPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  const loadToday = () => {
    if (!user) return;
    getToday().then(setItems).catch(console.error);
  };

  useEffect(() => {
    loadToday();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const markStatus = async (habitId, entry, status) => {
    try {
      setSavingId(habitId);
      if (entry) {
        await updateHabitEntry(entry.id, { status });
      } else {
        await createHabitEntry(habitId, { status });
      }
      await loadToday();
    } catch (err) {
      console.error(err);
      alert('Failed to update entry');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Today</h1>
      {items.length === 0 && <p>No habits yet. Add one on the Habits page.</p>}
      {items.map(({ habit, entry }) => (
        <div
          key={habit.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <strong>{habit.name}</strong>
            <div style={{ fontSize: '0.9rem' }}>
              Status:{' '}
              {entry ? entry.status : 'Not logged'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              disabled={savingId === habit.id}
              onClick={() => markStatus(habit.id, entry, 'done')}
            >
              Mark done
            </button>
            <button
              type="button"
              disabled={savingId === habit.id}
              onClick={() => markStatus(habit.id, entry, 'missed')}
              style={{ backgroundColor: '#e5e7eb', color: '#111827' }}
            >
              Mark missed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}