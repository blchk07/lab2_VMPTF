const express = require('express');
const { readDb } = require('../services/jsonDb');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, (req, res) => {
  const db = readDb();
  const userTasks = req.user.role === 'admin'
    ? db.tasks
    : db.tasks.filter(task => task.ownerId === req.user.id);

  const now = new Date();
  const total = userTasks.length;
  const done = userTasks.filter(task => task.status === 'done').length;
  const inProgress = userTasks.filter(task => task.status === 'in_progress').length;
  const todo = userTasks.filter(task => task.status === 'todo').length;
  const overdue = userTasks.filter(task => task.status !== 'done' && new Date(task.dueDate) < now).length;
  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

  res.json({ total, todo, inProgress, done, overdue, completionRate });
});

module.exports = router;
