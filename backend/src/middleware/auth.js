import jwt from 'jsonwebtoken';
import { readDb } from '../data/store.js';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const db = readDb();
    const user = db.users.find((u) => u.id === decoded.sub);
    if (!user) return res.status(401).json({ error: 'Invalid user' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function enforcePlanLimit(req, res, next) {
  const db = readDb();
  const count = db.workflows.filter((w) => w.userId === req.user.id).length;
  const freeLimit = Number(process.env.FREE_WORKFLOW_LIMIT || 3);
  if (req.user.plan === 'free' && count >= freeLimit) {
    return res.status(403).json({ error: `Free plan limit reached (${freeLimit} workflows). Upgrade to Pro (₹499/month).` });
  }
  next();
}
