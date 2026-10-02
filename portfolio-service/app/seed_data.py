SEED_PROJECTS = [
    {
        "title": "Async Telegram Task Queue",
        "description": "Асинхронная очередь задач для обработки медиафайлов и фоновых заданий с Redis Streams.",
        "category": "python",
        "tech_stack": ["Python 3.11", "FastAPI", "AsyncIO", "Redis", "Pydantic"],
        "github_url": "https://github.com/developer/async-task-queue",
        "demo_url": "https://api.portfolio.dev/v1/queue/demo",
        "code_snippet": """import asyncio
import logging
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO)

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
        logging.info(f"Task {job.id} enqueued.")

    async def worker(self, worker_id: int) -> None:
        while self._is_running:
            job = await self.queue.get()
            try:
                logging.info(f"Worker {worker_id} processing {job.id}")
                await asyncio.sleep(0.5)
            except Exception as e:
                logging.error(f"Error: {e}")
            finally:
                self.queue.task_done()"""
    },
    {
        "title": "FastAPI Data Scraper & Normalizer",
        "description": "Сервис автоматического сбора, нормализации и дедупликации технологических метрик с экспортом в Parquet.",
        "category": "python",
        "tech_stack": ["Python 3.12", "FastAPI", "httpx", "BeautifulSoup4", "Polars"],
        "github_url": "https://github.com/developer/fastapi-scraper",
        "demo_url": None,
        "code_snippet": """from fastapi import FastAPI, HTTPException
import httpx
from bs4 import BeautifulSoup

app = FastAPI(title="Scraper")

@app.post("/extract")
async def extract_url(target_url: str):
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(target_url)
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed fetch")
    soup = BeautifulSoup(resp.text, "html.parser")
    return {"title": soup.title.string if soup.title else "Untitled"}"""
    },
    {
        "title": "Reactive Virtualized Data Grid",
        "description": "Сверхбыстрый грид данных на чистом TypeScript/JavaScript с бесконечным скроллом и виртуализацией 100 000+ строк.",
        "category": "javascript",
        "tech_stack": ["JavaScript ES6+", "TypeScript", "Web Workers", "Vite"],
        "github_url": "https://github.com/developer/virtualized-grid",
        "demo_url": "https://grid.portfolio.dev",
        "code_snippet": """export class VirtualGrid {
  constructor(container, { rowHeight = 44, totalRows = 50000, renderRow }) {
    this.container = container;
    this.rowHeight = rowHeight;
    this.totalRows = totalRows;
    this.renderRow = renderRow;
    this.activeNodes = new Map();
    this.render();
  }

  render() {
    const scrollTop = this.container.scrollTop;
    const viewHeight = this.container.clientHeight;
    const startIdx = Math.max(0, Math.floor(scrollTop / this.rowHeight) - 5);
    const endIdx = Math.min(this.totalRows - 1, Math.ceil((scrollTop + viewHeight) / this.rowHeight) + 5);

    for (let i = startIdx; i <= endIdx; i++) {
      if (!this.activeNodes.has(i)) {
        const node = this.renderRow(i);
        node.style.top = `${i * this.rowHeight}px`;
        this.container.appendChild(node);
        this.activeNodes.set(i, node);
      }
    }
  }
}"""
    },
    {
        "title": "Realtime Web Audio Synthesizer",
        "description": "Интерактивный полифонический синтезатор в браузере на Web Audio API с кастомными осцилляторами и ADSR.",
        "category": "javascript",
        "tech_stack": ["JavaScript ES6+", "Web Audio API", "Canvas API"],
        "github_url": "https://github.com/developer/web-audio-synth",
        "demo_url": "https://synth.portfolio.dev",
        "code_snippet": """class SynthVoice {
  constructor(audioCtx, destination) {
    this.ctx = audioCtx;
    this.gain = this.ctx.createGain();
    this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gain.connect(destination);
  }

  noteOn(freq, time = this.ctx.currentTime) {
    this.osc = this.ctx.createOscillator();
    this.osc.frequency.setValueAtTime(freq, time);
    this.gain.gain.exponentialRampToValueAtTime(0.8, time + 0.05);
    this.osc.connect(this.gain);
    this.osc.start(time);
  }
}"""
    },
    {
        "title": "Semantic Modern Canvas Dashboard",
        "description": "Семантическая разметка HTML5 с микроформатами, canvas-графиками без сторонних тяжелых библиотек и CSS Grid.",
        "category": "html",
        "tech_stack": ["HTML5 Semantic", "Modern CSS Grid", "Canvas 2D API"],
        "github_url": "https://github.com/developer/semantic-dashboard",
        "demo_url": "https://dashboard.portfolio.dev",
        "code_snippet": """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Семантический дашборд</title>
</head>
<body>
  <header role="banner">
    <nav aria-label="Основная навигация">
      <ul>
        <li><a href="#metrics">Метрики</a></li>
      </ul>
    </nav>
  </header>
  <main class="grid-container">
    <section aria-labelledby="kpi-title">
      <h2 id="kpi-title">Ключевые показатели</h2>
      <canvas id="sparklineChart" width="400" height="120"></canvas>
    </section>
  </main>
</body>
</html>"""
    },
    {
        "title": "High-Performance 60FPS Particle Canvas",
        "description": "Интерактивная визуализация физики частиц на HTML5 Canvas с расчетом гравитации, коллизий и откликом на мышь.",
        "category": "html",
        "tech_stack": ["HTML5 Canvas", "Vanilla JS", "Vector Math"],
        "github_url": "https://github.com/developer/canvas-particles",
        "demo_url": "https://particles.portfolio.dev",
        "code_snippet": """<div class="canvas-wrapper">
  <canvas id="physicsCanvas"></canvas>
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
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
    }
  }
</script>"""
    }
]
