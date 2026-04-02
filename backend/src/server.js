import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
import workflowRoutes from './routes/workflows.js';
import miscRoutes from './routes/misc.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api', miscRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error', detail: err.message });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`AutoFlow AI backend running on http://localhost:${port}`);
});
