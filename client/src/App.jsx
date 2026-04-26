import React from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Tasks from './pages/Tasks.jsx';
import TaskDetails from './pages/TaskDetails.jsx';
import Analytics from './pages/Analytics.jsx';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  return (
    <div>
      <nav className="navbar">
        <Link to="/">Задачі</Link>
        <Link to="/analytics">Аналітика</Link>
        <span className="spacer" />
        {user ? <span>{user.name} ({user.role})</span> : null}
        {user ? <button onClick={logout}>Вийти</button> : <Link to="/login">Вхід</Link>}
      </nav>

      <main className="container">
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/" element={<PrivateRoute><Tasks /></PrivateRoute>} />
          <Route path="/tasks/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}
