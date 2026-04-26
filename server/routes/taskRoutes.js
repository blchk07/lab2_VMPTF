const express = require('express');
const { readDb, writeDb, getNextId } = require('../services/jsonDb');
const { auth } = require('../middleware/authMiddleware');
const { sendReminder } = require('../services/emailService');

const router = express.Router();

function canAccessTask(user, task) {
  return user.role === 'admin' || task.ownerId === user.id;
}

router.get('/', auth, (req, res) => {
  const db = readDb();
  const tasks = req.user.role === 'admin'
    ? db.tasks
    : db.tasks.filter(task => task.ownerId === req.user.id);
  res.json(tasks);
});

router.get('/:id', auth, (req, res) => {
  const db = readDb();
  const task = db.tasks.find(item => item.id === Number(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (!canAccessTask(req.user, task)) return res.status(403).json({ message: 'Access denied' });
  res.json(task);
});

router.post('/', auth, (req, res) => {
  const { title, description, status, priority, dueDate, reminderEmail, ownerId } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ message: 'Title and dueDate are required' });
  }

  const db = readDb();
  const newTask = {
    id: getNextId(db.tasks),
    title,
    description: description || '',
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate,
    reminderEmail: reminderEmail || req.user.email,
    ownerId: req.user.role === 'admin' && ownerId ? Number(ownerId) : req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.tasks.push(newTask);
  writeDb(db);
  res.status(201).json(newTask);
});

router.put('/:id', auth, (req, res) => {
  const db = readDb();
  const index = db.tasks.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  if (!canAccessTask(req.user, db.tasks[index])) return res.status(403).json({ message: 'Access denied' });

  const oldTask = db.tasks[index];
  const updatedTask = {
    ...oldTask,
    ...req.body,
    id: oldTask.id,
    ownerId: req.user.role === 'admin' && req.body.ownerId ? Number(req.body.ownerId) : oldTask.ownerId,
    updatedAt: new Date().toISOString()
  };

  db.tasks[index] = updatedTask;
  writeDb(db);
  res.json(updatedTask);
});

router.delete('/:id', auth, (req, res) => {
  const db = readDb();
  const task = db.tasks.find(item => item.id === Number(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (!canAccessTask(req.user, task)) return res.status(403).json({ message: 'Access denied' });

  db.tasks = db.tasks.filter(item => item.id !== task.id);
  writeDb(db);
  res.json({ message: 'Task deleted' });
});

router.post('/:id/reminder', auth, async (req, res) => {
  try {
    const db = readDb();
    const task = db.tasks.find(item => item.id === Number(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!canAccessTask(req.user, task)) return res.status(403).json({ message: 'Access denied' });

    const result = await sendReminder(task);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Не вдалося надіслати email' });
  }
});

module.exports = router;
