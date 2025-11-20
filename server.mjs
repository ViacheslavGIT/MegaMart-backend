import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer } from 'ws';

import productRoutes from './routes/productRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import orderRoutes from './routes/orderRoutes.mjs';
import adminRoutes from './routes/adminRoutes.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

if (!MONGO || typeof MONGO !== 'string') {
  console.error('MongoDB error: MONGO_URI is not defined');
  process.exit(1);
}

mongoose
  .connect(MONGO)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

const dist = path.join(__dirname, '../dist');
app.use(express.static(dist));

app.get('*', (_, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', async (msg) => {
    try {
      const text = msg.toString();
      const mod = await import('./smartAssistant.mjs');
      const reply = await mod.smartAssistantReply(text);
      ws.send(JSON.stringify({ reply }));
    } catch {
      ws.send(JSON.stringify({ reply: 'Error' }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
