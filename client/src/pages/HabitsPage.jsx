import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import { getHabits, createHabit, updateHabit, deleteHabit } from '../api';
import { useNavigate } from 'react-router-dom';

export default function HabitsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', target_per_week: 3 });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', category: '', target_per_week: 3 });
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

  const startEdit = (habit) => {
    setEditingId(habit.id);
    setEditForm({
      name: habit.name,
      category: habit.category || '',
      target_per_week: habit.target_per_week ?? '',
    });
  };

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    try {
      const updated = await updateHabit(id, {
        ...editForm,
        target_per_week:
          editForm.target_per_week === '' ? null : Number(editForm.target_per_week),
      });
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update habit');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this habit and all its entries?')) return;
    try {
      await deleteHabit(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete habit');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Your Habits</h1>
      {error && <p style={{ color: 'red' }}>{String(error)}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Habit name"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (e.g. Health, Learning)"
        />
        <input
          name="target_per_week"
          type="number"
          value={form.target_per_week}
          onChange={handleChange}
          placeholder="Target times per week"
          min="0"
        />
        <button type="submit">Add habit</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {habits.map((h) => (
          <li
            key={h.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {editingId === h.id ? (
              <div style={{ flex: 1, marginRight: '1rem' }}>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Habit name"
                />
                <input
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  placeholder="Category"
                />
                <input
                  name="target_per_week"
                  type="number"
                  value={editForm.target_per_week}
                  onChange={handleEditChange}
                  placeholder="Target per week"
                  min="0"
                />
              </div>
            ) : (
              <div style={{ textAlign: 'left' }}>
                <div><strong>{h.name}</strong></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                  {h.category || 'No category'} · target per week:{' '}
                  {h.target_per_week ?? '—'}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editingId === h.id ? (
                <>
                  <button type="button" onClick={() => saveEdit(h.id)}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    style={{ backgroundColor: '#ccc', color: '#000' }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => startEdit(h)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(h.id)}
                    style={{ backgroundColor: '#b91c1c' }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}