import React from 'react';
import { useEffect, useState } from 'react';

const emptyTask = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  reminderEmail: ''
};

export default function TaskForm({ selectedTask, onSave, onCancel }) {
  const [form, setForm] = useState(emptyTask);

  useEffect(() => {
    setForm(selectedTask || emptyTask);
  }, [selectedTask]);

  function updateField(field, value) {
    setForm(previous => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(form);
    setForm(emptyTask);
  }

  return (
    <form onSubmit={handleSubmit} className="card form">
      <h2>{selectedTask ? 'Редагування задачі' : 'Нова задача'}</h2>

      <label>Назва</label>
      <input required value={form.title} onChange={event => updateField('title', event.target.value)} />

      <label>Опис</label>
      <textarea value={form.description} onChange={event => updateField('description', event.target.value)} />

      <div className="grid2">
        <div>
          <label>Статус</label>
          <select value={form.status} onChange={event => updateField('status', event.target.value)}>
            <option value="todo">Заплановано</option>
            <option value="in_progress">В роботі</option>
            <option value="done">Виконано</option>
          </select>
        </div>
        <div>
          <label>Пріоритет</label>
          <select value={form.priority} onChange={event => updateField('priority', event.target.value)}>
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>

      <label>Дата і час виконання</label>
      <input required type="datetime-local" value={form.dueDate} onChange={event => updateField('dueDate', event.target.value)} />

      <label>Email для нагадування</label>
      <input type="email" value={form.reminderEmail} onChange={event => updateField('reminderEmail', event.target.value)} />

      <div className="actions">
        <button type="submit">Зберегти</button>
        {selectedTask ? <button type="button" onClick={onCancel}>Скасувати</button> : null}
      </div>
    </form>
  );
}
