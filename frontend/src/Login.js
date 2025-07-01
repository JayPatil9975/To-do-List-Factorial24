import React, { useState } from 'react';
import { setToken } from './auth';

export default function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setToken(data.token);
      onLogin();
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-bg">
      <style>
        {`
        .login-bg {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 60% 40%, #b2fefa 0%, #0ed2f7 100%), 
                      linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
          background-blend-mode: screen;
        }
        .glass-card {
          background: rgba(255,255,255,0.7);
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 2.5rem 2rem 2rem 2rem;
          min-width: 340px;
          max-width: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .glass-card h2 {
          font-weight: 700;
          font-size: 1.7rem;
          margin-bottom: 1.5rem;
          color: #222;
        }
        .input-group {
          width: 100%;
          margin-bottom: 1.2rem;
          position: relative;
        }
        .input-group input {
          width: 100%;
          padding: 0.9rem 2.5rem 0.9rem 2.5rem;
          border: none;
          border-radius: 12px;
          background: rgba(255,255,255,0.6);
          font-size: 1rem;
          color: #222;
          outline: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .input-group .icon {
          position: absolute;
          left: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          color: #0ed2f7;
          font-size: 1.1rem;
        }
        .login-actions {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 1.2rem;
        }
        .register-btn {
          background: none;
          border: none;
          color: #0ed2f7;
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          margin-left: auto;
          transition: color 0.2s;
        }
        .register-btn:hover {
          color: #f093fb;
        }
        .register-btn.small {
          font-size: 0.85rem;
          padding: 2px 8px;
        }
        .login-btn {
          width: 100%;
          padding: 0.85rem 0;
          border: none;
          border-radius: 0 0 24px 24px;
          background: linear-gradient(90deg, #0ed2f7 0%, #b2fefa 100%);
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-top: 0.5rem;
          box-shadow: 0 4px 16px rgba(14,210,247,0.12);
          cursor: pointer;
          transition: background 0.2s;
        }
        .login-btn:hover {
          background: linear-gradient(90deg, #0ed2f7 0%, #f093fb 100%);
        }
        .login-error {
          width: 100%;
          background: #ffeaea;
          color: #d32f2f;
          border-radius: 8px;
          padding: 0.5rem 0.8rem;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 0.98rem;
        }
        `}
      </style>
      <form className="glass-card" onSubmit={handleSubmit} autoComplete="off">
        <h2>Login</h2>
        {error && <div className="login-error">{error}</div>}
        <div className="input-group">
          <span className="icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Email ID"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <span className="icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="login-actions">
          <button
            type="button"
            className="register-btn small"
            onClick={onShowRegister}
          >
            Don't have an account? Register now
          </button>
        </div>
        <button type="submit" className="login-btn">LOGIN</button>
      </form>
    </div>
  );
}
