import express from 'express';
import { stringify } from 'csv-stringify/sync';
import { authMiddleware } from '../middleware/auth.js';
import { readDb } from '../data/store.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/notifications', (req, res) => {
  const db = readDb();
  res.json(db.notifications.filter((n) => n.userId === req.user.id).slice(0, 25));
});

router.post('/ai/reply', async (req, res) => {
  const { generateSmartReply } = await import('../services/aiService.js');
  try {
    const text = await generateSmartReply(req.body);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate AI reply', detail: error.message });
  }
});

router.get('/leads/export.csv', (req, res) => {
  const db = readDb();
  const leads = db.leads.filter((lead) => lead.userId === req.user.id);
  const csv = stringify(leads.map((lead) => ({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    tags: lead.tags.join('|'),
    createdAt: lead.createdAt
  })), { header: true });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
});

router.get('/health', (_, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

export default router;
