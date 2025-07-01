import React, { useEffect, useState } from 'react';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import { getToken, setToken, removeToken } from './auth';
import './App.css';

const API_URL = 'http://localhost:8080/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Fetch user info after login
  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      return;
    }
    fetch('http://localhost:8080/api/me', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setUser)
      .catch(() => setUser(null));
  }, [isLoggedIn]);

  // Fetch tasks only if logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then(setTasks)
      .catch(err => {
        console.error(err);
        alert('Could not load tasks from server.');
      });
  }, [isLoggedIn]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ text: newTask })
      });
      if (!res.ok) throw new Error('Failed to add task');
      const task = await res.json();
      setTasks([...tasks, task]);
      setNewTask('');
    } catch (err) {
      console.error(err);
      alert('Could not add task.');
    }
  };

  const deleteTask = async (_id) => {
    try {
      const res = await fetch(`${API_URL}/${_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t._id !== _id));
    } catch (err) {
      console.error(err);
      alert('Could not delete task.');
    }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await fetch(`${API_URL}/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();
      setTasks(tasks.map(t => t._id === task._id ? updated : t));
    } catch (err) {
      console.error(err);
      alert('Could not update task.');
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditingText(task.text);
  };

  const saveEdit = async (_id) => {
    try {
      const res = await fetch(`${API_URL}/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ text: editingText })
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();
      setTasks(tasks.map(t => t._id === _id ? updated : t));
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      console.error(err);
      alert('Could not update task.');
    }
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setShowProfile(false);
  };

  if (!isLoggedIn) {
    return showRegister ? (
      <Register
        onRegister={() => setShowRegister(false)}
        onShowLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login onLogin={() => setIsLoggedIn(true)} onShowRegister={() => setShowRegister(true)} />
    );
  }
  return (
    <div className="app-bg">
      <div className="todo-glass-card">
        <div className="todo-header">
          <span className="todo-title">To-Do List</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Profile Icon */}
            <button
              className="profile-icon-btn"
              onClick={() => setShowProfile(true)}
              title="Profile"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '50%',
                padding: 0,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
              }}
            >
              <span role="img" aria-label="profile" style={{ fontSize: 28 }}>👤</span>
            </button>
          </div>
        </div>
        <form onSubmit={addTask} className="add-task-form">
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="add-task-input"
          />
          <button type="submit" className="add-task-btn">Add</button>
        </form>
        <ul className="todo-list">
          {tasks.map(task => (
            <li key={task._id} className="todo-list-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
                className="todo-checkbox"
              />
              {editingId === task._id ? (
                <>
                  <input
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    className="todo-edit-input"
                  />
                  <button onClick={() => saveEdit(task._id)} className="todo-btn save">Save</button>
                  <button onClick={() => setEditingId(null)} className="todo-btn cancel">Cancel</button>
                </>
              ) : (
                <>
                  <span
                    className={`todo-task-text${task.completed ? ' completed' : ''}`}
                    onDoubleClick={() => startEdit(task)}
                  >
                    {task.text}
                  </span>
                  <button onClick={() => startEdit(task)} className="todo-btn edit">Edit</button>
                  <button onClick={() => deleteTask(task._id)} className="todo-btn delete">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {showProfile && user && (
        <Profile
          user={user}
          onLogout={handleLogout}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}

export default App;
