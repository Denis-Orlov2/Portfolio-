import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

export interface ProjectRow {
  id: number;
  title: string;
  description: string;
  category: 'html' | 'javascript' | 'python';
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  code_snippet: string;
  created_at: string;
}

export interface ContactMessageRow {
  id: number;
  name: string;
  email: string;
  message: string;
  client_ip: string | null;
  created_at: string;
}

let dbInstance: Database | null = null;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio.sqlite');

export const INITIAL_PROJECTS: Omit<ProjectRow, 'id' | 'created_at'>[] = [
  {
    title: 'Async Telegram Task Queue',
    description: 'Высокопроизводительная асинхронная очередь распределенных фоновых задач с поддержкой Redis Streams, обработкой медиафайлов и graceful shutdown.',
    category: 'python',
    tech_stack: ['Python 3.11', 'FastAPI', 'AsyncIO', 'Redis', 'Pydantic'],
    github_url: 'https://github.com/developer/async-task-queue',
    demo_url: 'https://api.portfolio.dev/v1/queue/demo',
    code_snippet: `import asyncio
import logging
from typing import Callable, Any
from dataclasses import dataclass, field

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

@dataclass
class Job:
    id: str
    payload: dict
    retries: int = 0
    max_retries: int = 3

class AsyncTaskQueue:
    def __init__(self, concurrency: int = 4):
        self.queue: asyncio.Queue[Job] = asyncio.Queue()
        self.concurrency = concurrency
        self.workers = []
        self._is_running = True

    async def enqueue(self, job: Job) -> None:
        await self.queue.put(job)
        logging.info(f"Task {job.id} enqueued. Queue size: {self.queue.qsize()}")

    async def worker(self, worker_id: int) -> None:
        logging.info(f"Worker {worker_id} started.")
        while self._is_running:
            job = await self.queue.get()
            try:
                logging.info(f"Worker {worker_id} processing job {job.id}...")
                await asyncio.sleep(0.5)  # Симуляция тяжелой I/O операции
                logging.info(f"Job {job.id} completed successfully.")
            except Exception as exc:
                if job.retries < job.max_retries:
                    job.retries += 1
                    logging.warning(f"Retrying {job.id} ({job.retries}/{job.max_retries})")
                    await self.queue.put(job)
                else:
                    logging.error(f"Job {job.id} failed permanently: {exc}")
            finally:
                self.queue.task_done()

    async def start(self) -> None:
        self.workers = [
            asyncio.create_task(self.worker(i)) 
            for i in range(self.concurrency)
        ]

    async def shutdown(self) -> None:
        await self.queue.join()
        self._is_running = False
        for w in self.workers:
            w.cancel()
        logging.info("Task queue shut down gracefully.")`
  },
  {
    title: 'FastAPI Data Scraper & Normalizer',
    description: 'Сервис автоматического сбора, нормализации и дедупликации технологических метрик с экспортом в Parquet и PostgreSQL.',
    category: 'python',
    tech_stack: ['Python 3.12', 'FastAPI', 'httpx', 'BeautifulSoup4', 'Polars'],
    github_url: 'https://github.com/developer/fastapi-scraper',
    demo_url: null,
    code_snippet: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, HttpUrl
import httpx
from bs4 import BeautifulSoup
import re

app = FastAPI(title="Data Scraper Service", version="1.0.0")

class ScrapeRequest(BaseModel):
    target_url: HttpUrl
    extract_selectors: list[str]

class ScrapeResult(BaseModel):
    title: str
    word_count: int
    extracted: dict[str, list[str]]

@app.post("/api/v1/extract", response_model=ScrapeResult, status_code=status.HTTP_200_OK)
async def extract_content(req: ScrapeRequest):
    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
        try:
            resp = await client.get(str(req.target_url), headers={"User-Agent": "FastScraperBot/1.0"})
            resp.raise_for_status()
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=400, detail=f"Request failed: {exc}")

    soup = BeautifulSoup(resp.text, "html.parser")
    page_title = soup.title.string.strip() if soup.title else "Untitled"
    clean_text = soup.get_text()
    words = len(re.findall(r"\\w+", clean_text))

    extracted_data = {}
    for sel in req.extract_selectors:
        extracted_data[sel] = [tag.get_text(strip=True) for tag in soup.select(sel)]

    return ScrapeResult(title=page_title, word_count=words, extracted=extracted_data)`
  },
  {
    title: 'Reactive Virtualized Data Grid',
    description: 'Сверхбыстрый грид данных на чистом TypeScript/JavaScript с бесконечным скроллом, виртуализацией 100 000+ строк и сортировкой.',
    category: 'javascript',
    tech_stack: ['JavaScript ES6+', 'TypeScript', 'Web Workers', 'CSS Subgrid', 'Vite'],
    github_url: 'https://github.com/developer/virtualized-grid',
    demo_url: 'https://grid.portfolio.dev',
    code_snippet: `/**
 * Virtualized Grid Engine - ES6 Class
 * Оптимизированный расчет диапазона видимых строк через requestAnimationFrame
 */
export class VirtualGrid {
  constructor(container, { rowHeight = 44, totalRows = 50000, renderRow }) {
    this.container = container;
    this.rowHeight = rowHeight;
    this.totalRows = totalRows;
    this.renderRow = renderRow;
    this.buffer = 5;

    this.viewport = document.createElement('div');
    this.viewport.className = 'virtual-viewport';
    this.viewport.style.position = 'relative';
    this.viewport.style.height = \`\${totalRows * rowHeight}px\`;
    this.container.appendChild(this.viewport);

    this.activeNodes = new Map();
    this.onScroll = this.onScroll.bind(this);
    this.container.addEventListener('scroll', this.onScroll, { passive: true });
    this.render();
  }

  onScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.render();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  render() {
    const scrollTop = this.container.scrollTop;
    const viewHeight = this.container.clientHeight;

    const startIdx = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.buffer);
    const endIdx = Math.min(this.totalRows - 1, Math.ceil((scrollTop + viewHeight) / this.rowHeight) + this.buffer);

    const neededKeys = new Set();
    for (let i = startIdx; i <= endIdx; i++) {
      neededKeys.add(i);
      if (!this.activeNodes.has(i)) {
        const node = this.renderRow(i);
        node.style.position = 'absolute';
        node.style.top = \`\${i * this.rowHeight}px\`;
        node.style.left = '0';
        node.style.right = '0';
        node.style.height = \`\${this.rowHeight}px\`;
        this.viewport.appendChild(node);
        this.activeNodes.set(i, node);
      }
    }

    for (const [idx, node] of this.activeNodes) {
      if (!neededKeys.has(idx)) {
        node.remove();
        this.activeNodes.delete(idx);
      }
    }
  }
}`
  },
  {
    title: 'Realtime Web Audio Synthesizer',
    description: 'Интерактивный полифонический синтезатор в браузере на Web Audio API с кастомными осцилляторами, ADSR-огибающими и фильтрами.',
    category: 'javascript',
    tech_stack: ['JavaScript ES6+', 'Web Audio API', 'Canvas API', 'AudioWorklet'],
    github_url: 'https://github.com/developer/web-audio-synth',
    demo_url: 'https://synth.portfolio.dev',
    code_snippet: `// Web Audio API Polyphonic Voice Engine
class SynthVoice {
  constructor(audioCtx, destination) {
    this.ctx = audioCtx;
    this.dest = destination;
    this.osc = null;
    this.gain = this.ctx.createGain();
    this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
    
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    this.gain.connect(this.filter);
    this.filter.connect(this.dest);
  }

  noteOn(frequency, time = this.ctx.currentTime) {
    this.noteOff(time);
    this.osc = this.ctx.createOscillator();
    this.osc.type = 'sawtooth';
    this.osc.frequency.setValueAtTime(frequency, time);

    // ADSR Attack Phase: 0 -> 0.8 за 0.04с
    this.gain.gain.cancelScheduledValues(time);
    this.gain.gain.setValueAtTime(0.001, time);
    this.gain.gain.exponentialRampToValueAtTime(0.8, time + 0.04);
    // Decay to 0.4 Sustain
    this.gain.gain.exponentialRampToValueAtTime(0.4, time + 0.15);

    this.osc.connect(this.gain);
    this.osc.start(time);
  }

  noteOff(time = this.ctx.currentTime) {
    if (!this.osc) return;
    this.gain.gain.cancelScheduledValues(time);
    this.gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
    this.osc.stop(time + 0.25);
    this.osc = null;
  }
}`
  },
  {
    title: 'Semantic Modern Canvas Dashboard',
    description: 'Семантическая разметка HTML5 с микроформатами, canvas-графиками без сторонних тяжелых библиотек и адаптивной CSS Grid сеткой.',
    category: 'html',
    tech_stack: ['HTML5 Semantic', 'Modern CSS Grid', 'Canvas 2D API', 'SVG Icons'],
    github_url: 'https://github.com/developer/semantic-dashboard',
    demo_url: 'https://dashboard.portfolio.dev',
    code_snippet: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Финансовый дашборд нового поколения</title>
</head>
<body class="dashboard-root">
  <header role="banner" class="app-header">
    <nav aria-label="Основная навигация">
      <ul class="nav-links">
        <li><a href="#metrics" aria-current="page">Метрики</a></li>
        <li><a href="#transactions">Транзакции</a></li>
        <li><a href="#reports">Аналитика</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content" class="grid-container">
    <section aria-labelledby="kpi-title" class="kpi-widget">
      <h2 id="kpi-title">Ключевые показатели эффективности</h2>
      <article class="metric-card">
        <h3>Чистый доход</h3>
        <p class="value" data-currency="RUB">₽ 2 840 500</p>
        <span class="trend positive" aria-label="Рост на 14.8%">+14.8%</span>
      </article>
      <canvas id="sparklineChart" width="400" height="120" aria-label="График динамики выручки"></canvas>
    </section>
  </main>
</body>
</html>`
  },
  {
    title: 'High-Performance 60FPS Particle Canvas',
    description: 'Интерактивная визуализация физики частиц на HTML5 Canvas с расчетом гравитации, коллизий и откликом на курсор мыши.',
    category: 'html',
    tech_stack: ['HTML5 Canvas', 'Vanilla JS', 'Vector Math', 'CSS3 Transitions'],
    github_url: 'https://github.com/developer/canvas-particles',
    demo_url: 'https://particles.portfolio.dev',
    code_snippet: `<!-- HTML5 Particle Canvas Architecture -->
<div class="canvas-wrapper">
  <canvas id="physicsCanvas" class="interactive-surface"></canvas>
  <div class="hud-overlay" aria-live="polite">
    <span id="fpsCounter">FPS: 60</span>
    <span id="particleCount">Частиц: 450</span>
  </div>
</div>

<script>
  const canvas = document.getElementById('physicsCanvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.radius = Math.random() * 2.5 + 1.5;
    }
    update(mouse) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 100) {
        this.x -= (dx / dist) * 2;
        this.y -= (dy / dist) * 2;
      }
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    }
  }
</script>`
  }
];

export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let db: Database;
  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
    } catch (e) {
      console.error('Error loading existing SQLite database, creating new one', e);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Create SQLite Schema according to Section 4.1 of ТЗ
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('html', 'javascript', 'python')),
      tech_stack TEXT NOT NULL,
      github_url TEXT,
      demo_url TEXT,
      code_snippet TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      client_ip TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check if projects table needs seeding
  const countRes = db.exec("SELECT COUNT(*) AS cnt FROM projects;");
  const rowCount = countRes.length > 0 && countRes[0].values.length > 0 ? (countRes[0].values[0][0] as number) : 0;

  if (rowCount === 0) {
    console.log('Seeding initial projects into SQLite database...');
    const insertStmt = db.prepare(`
      INSERT INTO projects (title, description, category, tech_stack, github_url, demo_url, code_snippet, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'));
    `);

    for (const p of INITIAL_PROJECTS) {
      insertStmt.run([
        p.title,
        p.description,
        p.category,
        JSON.stringify(p.tech_stack),
        p.github_url,
        p.demo_url,
        p.code_snippet
      ]);
    }
    insertStmt.free();

    // Persist to file
    saveDatabaseToFile(db);
  }

  dbInstance = db;
  return db;
}

export function saveDatabaseToFile(db: Database) {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to persist database to file:', err);
  }
}

export async function getProjects(category: string = 'all'): Promise<{ items: ProjectRow[]; total: number }> {
  const db = await getDatabase();
  let query = 'SELECT id, title, description, category, tech_stack, github_url, demo_url, code_snippet, created_at FROM projects';
  const params: string[] = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category.toLowerCase());
  }
  query += ' ORDER BY id ASC';

  const stmt = db.prepare(query);
  if (params.length > 0) {
    stmt.bind(params);
  }

  const items: ProjectRow[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as Record<string, any>;
    let parsedStack: string[] = [];
    try {
      parsedStack = JSON.parse(row.tech_stack as string);
    } catch {
      parsedStack = [String(row.tech_stack)];
    }

    items.push({
      id: Number(row.id),
      title: String(row.title),
      description: String(row.description),
      category: row.category as 'html' | 'javascript' | 'python',
      tech_stack: parsedStack,
      github_url: row.github_url ? String(row.github_url) : null,
      demo_url: row.demo_url ? String(row.demo_url) : null,
      code_snippet: String(row.code_snippet),
      created_at: String(row.created_at)
    });
  }
  stmt.free();

  return {
    items,
    total: items.length
  };
}

export async function addContactMessage(
  name: string,
  email: string,
  message: string,
  clientIp: string | null
): Promise<{ id: number }> {
  const db = await getDatabase();
  const stmt = db.prepare(`
    INSERT INTO contact_messages (name, email, message, client_ip, created_at)
    VALUES (?, ?, ?, ?, datetime('now'));
  `);
  stmt.run([name, email, message, clientIp]);
  stmt.free();

  const idRes = db.exec("SELECT last_insert_rowid() AS id;");
  const lastId = idRes[0]?.values[0]?.[0] as number;

  saveDatabaseToFile(db);
  return { id: lastId };
}

export async function getContactMessages(): Promise<ContactMessageRow[]> {
  const db = await getDatabase();
  const res = db.exec('SELECT id, name, email, message, client_ip, created_at FROM contact_messages ORDER BY id DESC LIMIT 50;');
  if (!res.length) return [];
  
  const columns = res[0].columns;
  return res[0].values.map((v) => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = v[i];
    });
    return obj as ContactMessageRow;
  });
}
