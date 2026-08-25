'use client';

import { useEffect, useState } from 'react';

const emptyForm = { title: '', description: '', deadline: '' };

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all | active | completed | overdue

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to load todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.deadline) {
      setError('Title and deadline are required.');
      return;
    }

    try {
      if (editingId) {
        const res = await fetch(`/api/todos/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Failed to update todo');
        const updated = await res.json();
        setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const res = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Failed to create todo');
        const created = await res.json();
        setTodos((prev) => [...prev, created].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleComplete(todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (!res.ok) return setError('Failed to update todo');
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function deleteTodo(id) {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) return setError('Failed to delete todo');
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setForm({
      title: todo.title,
      description: todo.description || '',
      deadline: toLocalInputValue(todo.deadline),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function isOverdue(todo) {
    return !todo.completed && new Date(todo.deadline) < new Date();
  }

  const visibleTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'overdue') return isOverdue(t);
    return true;
  });

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Todos</h1>
      <p className="text-sm text-gray-400 mb-6">Deadlines, sorted soonest first.</p>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3 bg-gray-900 border border-gray-800 rounded-lg p-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
        />
        <input
          type="datetime-local"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 rounded px-4 py-2 text-sm font-medium">
            {editingId ? 'Save changes' : 'Add todo'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2 text-sm">
              Cancel
            </button>
          )}
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>

      <div className="flex gap-2 mb-4 text-sm">
        {['all', 'active', 'completed', 'overdue'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${filter === f ? 'bg-blue-600' : 'bg-gray-800 text-gray-400'}`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {!loading && visibleTodos.length === 0 && (
        <p className="text-gray-500 text-sm">Nothing here. Add a todo above.</p>
      )}

      <ul className="space-y-2">
        {visibleTodos.map((todo) => (
          <li
            key={todo.id}
            className={`border rounded-lg p-3 flex items-start gap-3 ${
              isOverdue(todo) ? 'border-red-800 bg-red-950/30' : 'border-gray-800 bg-gray-900'
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </p>
              {todo.description && <p className="text-xs text-gray-400 mt-0.5">{todo.description}</p>}
              <p className={`text-xs mt-1 ${isOverdue(todo) ? 'text-red-400' : 'text-gray-500'}`}>
                {isOverdue(todo) ? 'Overdue — ' : 'Due '}
                {new Date(todo.deadline).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              <button onClick={() => startEdit(todo)} className="text-gray-400 hover:text-white">
                Edit
              </button>
              <button onClick={() => deleteTodo(todo.id)} className="text-gray-400 hover:text-red-400">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

// datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time, not the ISO
// string Postgres/Supabase gives back — this converts between the two.
function toLocalInputValue(isoString) {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}
