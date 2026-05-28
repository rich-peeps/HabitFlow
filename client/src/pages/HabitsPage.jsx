import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { getHabits, createHabit } from '../api';
import { useNavigate } from 'react-router-dom';

export default function HabitsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', target_per_week: 3 });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    getHabits().then(setHabits).catch(console.error);
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const newHabit = await createHabit({
        ...form,
        target_per_week: Number(form.target_per_week) || null,
      });
      setHabits((prev) => [...prev, newHabit]);
      setForm({ name: '', category: '', target_per_week: 3 });
    } catch (err) {
      setError(JSON.stringify(err));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Your Habits</h1>
      {error && <p style={{ color: 'red' }}>{String(error)}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Habit name" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
        <input name="target_per_week" type="number" value={form.target_per_week} onChange={handleChange} />
        <button type="submit">Add habit</button>
      </form>
      <ul>
        {habits.map((h) => (
          <li key={h.id}>{h.name} ({h.category})</li>
        ))}
      </ul>
    </div>
  );
}
