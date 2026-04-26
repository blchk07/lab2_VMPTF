import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api.js';
import { formatDateTime, formatPriority, formatStatus } from '../utils.js';

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    api.get(`/tasks/${id}`).then(response => setTask(response.data));
  }, [id]);

  if (!task) return <p>Завантаження...</p>;

  return (
    <section className="card">
      <h1>{task.title}</h1>
      <p>{task.description || 'Без опису'}</p>
      <p><strong>Статус:</strong> {formatStatus(task.status)}</p>
      <p><strong>Пріоритет:</strong> {formatPriority(task.priority)}</p>
      <p><strong>Дедлайн:</strong> {formatDateTime(task.dueDate)}</p>
      <p><strong>Email нагадування:</strong> {task.reminderEmail || 'не вказано'}</p>
      <p><strong>ID власника:</strong> {task.ownerId}</p>
      <Link className="button" to="/">Назад</Link>
    </section>
  );
}
