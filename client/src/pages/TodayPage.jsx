import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { getToday } from '../api';
import { useNavigate } from 'react-router-dom';

export default function TodayPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    getToday().then(setItems).catch(console.error);
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Today</h1>
      {items.map(({ habit, entry }) => (
        <div key={habit.id}>
          <strong>{habit.name}</strong> — {entry ? entry.status : 'not logged'}
        </div>
      ))}
    </div>
  );
}
