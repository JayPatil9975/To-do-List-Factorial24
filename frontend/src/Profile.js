import React from 'react';

export default function Profile({ user, onLogout, onClose }) {
  return (
    <div className="profile-modal-bg" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <div className="profile-avatar">
          <span role="img" aria-label="profile" style={{ fontSize: 48 }}>👤</span>
        </div>
        <div className="profile-info">
          <div><strong>Name:</strong> {user.username}</div>
          <div><strong>Email:</strong> {user.email}</div>
        </div>
        <button className="profile-logout-btn" onClick={onLogout}>Logout</button>
      </div>
      <style>
        {`
        .profile-modal-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .profile-modal {
          background: #fff;
          border-radius: 18px;
          padding: 2rem 2.5rem;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
          min-width: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .profile-avatar {
          margin-bottom: 1rem;
        }
        .profile-info {
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .profile-logout-btn {
          background: linear-gradient(90deg, #f5576c 0%, #f093fb 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 0.7rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          box-shadow: 0 4px 16px rgba(245,87,108,0.12);
          transition: background 0.2s;
          cursor: pointer;
        }
        .profile-logout-btn:hover {
          background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
        }
        `}
      </style>
    </div>
  );
}