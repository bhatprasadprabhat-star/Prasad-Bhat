import express from 'express';
import { nanoid } from 'nanoid';
import { authMiddleware } from '../middleware/auth.js';
import { readDb, writeDb } from '../data/store.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const db = readDb();
  const leads = db.leads.filter((lead) => lead.userId === req.user.id);
  res.json(leads);
});

router.post('/', (req, res) => {
  const { name, email, phone, tags = ['follow-up'] } = req.body;
  const db = readDb();
  const lead = {
    id: nanoid(),
    userId: req.user.id,
    name,
    email,
    phone,
    tags,
    activity: [{ type: 'created', at: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  };
  db.leads.push(lead);
  writeDb(db);
  res.status(201).json(lead);
});

router.patch('/:id', (req, res) => {
  const db = readDb();
  const lead = db.leads.find((item) => item.id === req.params.id && item.userId === req.user.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  Object.assign(lead, req.body);
  lead.activity.push({ type: 'updated', at: new Date().toISOString() });
  writeDb(db);
  res.json(lead);
});

export default router;
