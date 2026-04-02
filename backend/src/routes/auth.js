import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { readDb, writeDb } from '../data/store.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const db = readDb();
  if (db.users.some((u) => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: nanoid(), email, name: name || 'User', passwordHash, plan: 'free', createdAt: new Date().toISOString() };
  db.users.push(user);
  writeDb(db);

  return res.json({ id: user.id, email: user.email, plan: user.plan });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  return res.json({ token, user: { id: user.id, email: user.email, plan: user.plan, name: user.name } });
});

router.post('/upgrade', (req, res) => {
  const { userId } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.plan = 'pro';
  writeDb(db);
  res.json({ message: 'Upgraded to Pro (₹499/month)', plan: user.plan });
});

export default router;
