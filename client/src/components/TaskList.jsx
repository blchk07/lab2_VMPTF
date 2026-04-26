import React from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime, formatPriority, formatStatus } from '../utils.js';

export default function TaskList({ tasks, onEdit, onDelete, onReminder }) {
  if (!tasks.length) return <p>Задач поки немає.</p>;

  return (
    <div className="task-list">
      {tasks.map(task => (
        <article className="card" key={task.id}>
          <div className="row">
            <div>
              <h3>{task.title}</h3>
              <p>{task.description || 'Без опису'}</p>
              <p className="muted">
                Статус: {formatStatus(task.status)} | Пріоритет: {formatPriority(task.priority)} | Дедлайн: {formatDateTime(task.dueDate)}
              </p>
              <p className="muted">Email нагадування: {task.reminderEmail || 'не вказано'}</p>
            </div>
            <div className="actions vertical">
              <Link className="button" to={`/tasks/${task.id}`}>Деталі</Link>
              <button onClick={() => onEdit(task)}>Редагувати</button>
              <button onClick={() => onReminder(task.id)}>Надіслати email</button>
              <button className="danger" onClick={() => onDelete(task.id)}>Видалити</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
