import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import config from './config.js';
import './migrate.js';
import { ensureUploadSubdirs } from './services/fileService.js';
import milestonesRouter from './routes/milestones.js';
import momentsRouter from './routes/moments.js';
import commentsRouter from './routes/comments.js';
import loveNotesRouter from './routes/loveNotes.js';

const app = express();

app.set('trust proxy', 1);

ensureUploadSubdirs();

const accessLogStream = fs.createWriteStream(path.join(config.LOG_DIR, 'access.log'), { flags: 'a' });

const corsOptions = {};
if (config.ALLOWED_ORIGINS.length === 1 && config.ALLOWED_ORIGINS[0] === '*') {
  corsOptions.origin = true;
} else {
  corsOptions.origin = function originCheck(origin, callback) {
    if (!origin || config.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  };
}

app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/health', rateLimiter);
app.use('/api', rateLimiter);

app.use(
  express.json({
    limit: `${config.MAX_UPLOAD_SIZE_MB}mb`,
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: `${config.MAX_UPLOAD_SIZE_MB}mb`,
  })
);
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
app.use(
  '/uploads',
  express.static(config.UPLOAD_DIR, {
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  })
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/milestones', milestonesRouter);
app.use('/api/moments', momentsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/letters', loveNotesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

app.listen(config.PORT, () => {
  console.log(`QQ Story backend listening on port ${config.PORT}`);
});
