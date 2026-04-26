import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('maksym.bielei@nure.ua');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Помилка входу');
    }
  }

  return (
    <section className="card narrow">
      <h1>Вхід</h1>
      <p className="muted">Тестові акаунти: admin@example.com / user@example.com. Пароль: 123456.</p>
      <form onSubmit={handleSubmit} className="form">
        <label>Email</label>
        <input value={email} onChange={event => setEmail(event.target.value)} />

        <label>Пароль</label>
        <input type="password" value={password} onChange={event => setPassword(event.target.value)} />

        {error ? <p className="error">{error}</p> : null}
        <button type="submit">Увійти</button>
      </form>
    </section>
  );
}
