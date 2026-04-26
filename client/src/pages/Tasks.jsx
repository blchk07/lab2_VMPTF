import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/api.js';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState('');

  async function loadTasks() {
    const response = await api.get('/tasks');
    setTasks(response.data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function saveTask(task) {
    if (task.id) {
      await api.put(`/tasks/${task.id}`, task);
      setMessage('Задачу оновлено');
    } else {
      await api.post('/tasks', task);
      setMessage('Задачу створено');
    }
    setSelectedTask(null);
    loadTasks();
  }

  async function deleteTask(id) {
    await api.delete(`/tasks/${id}`);
    setMessage('Задачу видалено');
    loadTasks();
  }

  async function sendReminder(id) {
    const response = await api.post(`/tasks/${id}/reminder`);
    setMessage(response.data.message);
  }

  return (
    <section>
      <h1>Система управління задачами</h1>
      <p className="muted">CRUD задач, перегляд деталей, планування за датою та email-нагадування.</p>
      {message ? <p className="success">{message}</p> : null}
      <div className="layout">
        <TaskForm selectedTask={selectedTask} onSave={saveTask} onCancel={() => setSelectedTask(null)} />
        <TaskList tasks={tasks} onEdit={setSelectedTask} onDelete={deleteTask} onReminder={sendReminder} />
      </div>
    </section>
  );
}
