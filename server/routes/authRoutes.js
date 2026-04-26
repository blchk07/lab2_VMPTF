const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb, getNextId } = require('../services/jsonDb');
const { auth, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'lab2_secret_key',
    { expiresIn: '8h' }
  );
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find(item => item.email === email);

  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const isValid = user.password.startsWith('$2')
    ? await bcrypt.compare(password, user.password)
    : password === user.password;
  if (!isValid) return res.status(401).json({ message: 'Invalid email or password' });

  const { password: _, ...safeUser } = user;
  res.json({ token: createToken(user), user: safeUser });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const db = readDb();
  if (db.users.some(user => user.email === email)) {
    return res.status(409).json({ message: 'User with this email already exists' });
  }

  const newUser = {
    id: getNextId(db.users),
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: 'user'
  };

  db.users.push(newUser);
  writeDb(db);

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ token: createToken(newUser), user: safeUser });
});

router.get('/users', auth, allowRoles('admin'), (req, res) => {
  const db = readDb();
  const users = db.users.map(({ password, ...user }) => user);
  res.json(users);
});

module.exports = router;
