import express from 'express';
import { nanoid } from 'nanoid';
import cron from 'node-cron';
import { authMiddleware, enforcePlanLimit } from '../middleware/auth.js';
import { readDb, writeDb } from '../data/store.js';
import { generateSmartReply } from '../services/aiService.js';

const router = express.Router();
router.use(authMiddleware);

const templates = [
  { id: 'lead-followup', name: 'Lead follow-up automation', trigger: 'lead.created', actions: ['ai-reply', 'email', 'whatsapp'] },
  { id: 'appointment-booking', name: 'Appointment booking auto-response', trigger: 'booking.request', actions: ['ai-reply', 'email'] },
  { id: 'ig-wa-auto', name: 'Instagram/WhatsApp auto-reply', trigger: 'message.received', actions: ['ai-reply', 'whatsapp'] },
  { id: 'support-bot', name: 'Customer support bot', trigger: 'support.ticket', actions: ['ai-reply', 'webhook'] }
];

async function executeActions(workflow, payload) {
  const db = readDb();
  const run = {
    id: nanoid(),
    workflowId: workflow.id,
    userId: workflow.userId,
    startedAt: new Date().toISOString(),
    status: 'success',
    logs: []
  };

  for (const action of workflow.actions) {
    if (action.type === 'delay') {
      await new Promise((resolve) => setTimeout(resolve, action.minutes * 1000));
      run.logs.push(`Delay of ${action.minutes} minute(s) simulated.`);
    } else if (action.type === 'ai-reply') {
      const reply = await generateSmartReply({ message: payload.message || 'New lead submitted', tone: action.tone, context: payload.context || 'lead follow-up' });
      run.logs.push(`AI reply generated: ${reply.slice(0, 80)}...`);
    } else if (action.type === 'email') {
      run.logs.push(`Email queued to ${payload.email || 'lead@example.com'} via SMTP/Gmail mock.`);
    } else if (action.type === 'whatsapp') {
      run.logs.push(`WhatsApp message sent to ${payload.phone || '+10000000000'} via mock webhook.`);
    } else if (action.type === 'webhook') {
      run.logs.push(`Webhook dispatched to ${action.url || 'https://example.com/webhook'}.`);
    } else if (action.type === 'store-db') {
      run.logs.push('Payload stored in database.');
    }
  }

  run.finishedAt = new Date().toISOString();
  db.runs.unshift(run);
  db.notifications.unshift({ id: nanoid(), userId: workflow.userId, message: `Workflow "${workflow.name}" executed`, createdAt: new Date().toISOString() });
  writeDb(db);
  return run;
}

router.get('/templates', (req, res) => res.json(templates));

router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.workflows.filter((item) => item.userId === req.user.id));
});

router.post('/', enforcePlanLimit, (req, res) => {
  const db = readDb();
  const workflow = {
    id: nanoid(),
    userId: req.user.id,
    name: req.body.name,
    trigger: req.body.trigger,
    actions: req.body.actions || [],
    cron: req.body.cron || null,
    active: true,
    createdAt: new Date().toISOString()
  };

  db.workflows.push(workflow);
  writeDb(db);

  if (workflow.cron) {
    cron.schedule(workflow.cron, () => executeActions(workflow, { context: 'scheduled run' }));
  }

  res.status(201).json(workflow);
});

router.post('/:id/run', async (req, res) => {
  const db = readDb();
  const workflow = db.workflows.find((item) => item.id === req.params.id && item.userId === req.user.id);
  if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

  const run = await executeActions(workflow, req.body || {});
  res.json(run);
});

router.get('/runs/all', (req, res) => {
  const db = readDb();
  res.json(db.runs.filter((run) => run.userId === req.user.id));
});

export default router;
