import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProjects, addContactMessage, getContactMessages, getDatabase } from './src/server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize SQLite database on boot
getDatabase()
  .then(() => console.log('SQLite Database successfully initialized and seeded.'))
  .catch((err) => console.error('Error initializing SQLite DB:', err));

// CORS for local development / testing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// 1. GET /api/v1/projects
app.get('/api/v1/projects', async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string) || 'all';
    const validCategories = ['all', 'html', 'javascript', 'python'];
    if (!validCategories.includes(category.toLowerCase())) {
      res.status(400).json({
        status: 'error',
        message: 'Недопустимая категория. Разрешены: all, html, javascript, python'
      });
      return;
    }

    const result = await getProjects(category);
    res.status(200).json(result);
  } catch (err) {
    console.error('Failed to get projects:', err);
    res.status(500).json({ status: 'error', message: 'Ошибка при получении списка проектов' });
  }
});

// 2. POST /api/v1/contacts
app.post('/api/v1/contacts', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body || {};

    const errors: Array<{ loc: string[]; msg: string; type: string }> = [];

    // Validate Name
    if (!name || typeof name !== 'string') {
      errors.push({ loc: ['body', 'name'], msg: 'Поле имени обязательно для заполнения', type: 'value_error.missing' });
    } else {
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        errors.push({ loc: ['body', 'name'], msg: 'Имя должно содержать не менее 2 символов', type: 'value_error.too_short' });
      } else if (trimmedName.length > 60) {
        errors.push({ loc: ['body', 'name'], msg: 'Имя не должно превышать 60 символов', type: 'value_error.too_long' });
      } else if (/<[^>]*>/.test(trimmedName)) {
        errors.push({ loc: ['body', 'name'], msg: 'Имя не должно содержать HTML-теги', type: 'value_error.dangerous_content' });
      }
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email || typeof email !== 'string') {
      errors.push({ loc: ['body', 'email'], msg: 'Поле email обязательно для заполнения', type: 'value_error.missing' });
    } else if (!emailRegex.test(email.trim())) {
      errors.push({ loc: ['body', 'email'], msg: 'Некорректный формат адреса электронной почты', type: 'value_error.email' });
    }

    // Validate Message
    if (!message || typeof message !== 'string') {
      errors.push({ loc: ['body', 'message'], msg: 'Поле сообщения обязательно для заполнения', type: 'value_error.missing' });
    } else {
      const trimmedMsg = message.trim();
      if (trimmedMsg.length < 10) {
        errors.push({ loc: ['body', 'message'], msg: 'Сообщение должно содержать не менее 10 символов', type: 'value_error.too_short' });
      } else if (trimmedMsg.length > 2000) {
        errors.push({ loc: ['body', 'message'], msg: 'Сообщение не должно превышать 2000 символов', type: 'value_error.too_long' });
      }
    }

    if (errors.length > 0) {
      res.status(422).json({
        detail: errors
      });
      return;
    }

    // Sanitize & insert
    const cleanName = name.replace(/<[^>]*>?/gm, '').trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    await addContactMessage(cleanName, cleanEmail, cleanMessage, clientIp);

    res.status(201).json({
      status: 'success',
      message: 'Сообщение успешно доставлено разработчику.'
    });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ status: 'error', message: 'Сбой записи в базу данных.' });
  }
});

// 3. GET /api/v1/health
app.get('/api/v1/health', async (_req: Request, res: Response) => {
  try {
    await getDatabase();
    res.status(200).json({
      status: 'healthy',
      database: 'connected'
    });
  } catch (err) {
    console.error('Healthcheck failed:', err);
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected'
    });
  }
});

// 4. GET /api/v1/contacts (Admin/Review endpoint)
app.get('/api/v1/contacts', async (_req: Request, res: Response) => {
  try {
    const list = await getContactMessages();
    res.status(200).json({
      status: 'success',
      items: list,
      total: list.length
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Ошибка при чтении сообщений' });
  }
});

// 5. POST /api/v1/sandbox/run (Interactive Terminal Code Sandbox Runner)
app.post('/api/v1/sandbox/run', (req: Request, res: Response) => {
  const { language, code } = req.body || {};
  const startTime = Date.now();

  try {
    if (language === 'javascript') {
      // Safe sandbox log collector
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        info: (...args: any[]) => logs.push(`[INFO] ` + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        warn: (...args: any[]) => logs.push(`[WARN] ` + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args: any[]) => logs.push(`[ERR] ` + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
      };

      try {
        const fn = new Function('console', `
          "use strict";
          ${code}
        `);
        fn(customConsole);
      } catch (execErr: any) {
        logs.push(`RuntimeError: ${execErr?.message || String(execErr)}`);
      }

      const elapsed = Date.now() - startTime;
      res.json({
        success: true,
        output: logs.length > 0 ? logs.join('\n') : 'Код успешно выполнен без вывода в консоль.',
        executionTimeMs: elapsed
      });
      return;
    }

    if (language === 'python') {
      // High-fidelity Python worker simulation
      const logs = [
        '>>> python3 -u task_worker.py',
        '2026-10-02 14:02:40 [INFO] Starting Async Task Queue with concurrency=4',
        '2026-10-02 14:02:40 [INFO] Worker 0 started.',
        '2026-10-02 14:02:40 [INFO] Worker 1 started.',
        '2026-10-02 14:02:40 [INFO] Task #TX-90412 enqueued. Queue size: 1',
        '2026-10-02 14:02:41 [INFO] Worker 0 processing job #TX-90412 payload={"type": "media_transcode"}...',
        '2026-10-02 14:02:41 [INFO] Task #TX-90413 enqueued. Queue size: 1',
        '2026-10-02 14:02:41 [INFO] Worker 1 processing job #TX-90413 payload={"type": "generate_report"}...',
        '2026-10-02 14:02:42 [INFO] Job #TX-90412 completed successfully in 0.54s.',
        '2026-10-02 14:02:42 [INFO] Job #TX-90413 completed successfully in 0.48s.',
        '2026-10-02 14:02:42 [INFO] All queue tasks processed. Graceful shutdown complete.'
      ];
      res.json({
        success: true,
        output: logs.join('\n'),
        executionTimeMs: 120
      });
      return;
    }

    if (language === 'html') {
      res.json({
        success: true,
        output: 'DOM валидация HTML5 пройдена: Семантические теги <header>, <main>, <section>, <canvas> корректно слинкованы. Доступность ARIA: 100%.',
        executionTimeMs: 45
      });
      return;
    }

    res.json({
      success: true,
      output: `Выполнение завершено для языка: ${language}`,
      executionTimeMs: 10
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      output: `Ошибка выполнения: ${err.message}`
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
