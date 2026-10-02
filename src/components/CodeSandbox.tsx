import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, RotateCcw, Terminal, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { highlightCode } from '../lib/prism';

interface CodeSandboxProps {
  customSnippet?: {
    code: string;
    language: 'html' | 'javascript' | 'python';
    title: string;
  } | null;
  onCopySuccess: () => void;
}

const DEFAULT_SNIPPETS = {
  python: {
    title: 'task_worker.py (Async Queue)',
    language: 'python' as const,
    code: `import asyncio
import logging
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO)

@dataclass
class Job:
    id: str
    payload: dict

async def worker(worker_id: int, queue: asyncio.Queue):
    while True:
        job = await queue.get()
        logging.info(f"Worker {worker_id} processing job {job.id}...")
        await asyncio.sleep(0.5)  # I/O execution
        logging.info(f"Worker {worker_id} finished {job.id} successfully!")
        queue.task_done()

async def main():
    queue = asyncio.Queue()
    # Запуск 2 воркеров
    workers = [asyncio.create_task(worker(i, queue)) for i in range(2)]
    
    # Добавление задач
    await queue.put(Job(id="JOB-101", payload={"action": "transcode_video"}))
    await queue.put(Job(id="JOB-102", payload={"action": "generate_report"}))
    
    await queue.join()
    for w in workers:
        w.cancel()
    print("All tasks finished successfully.")

asyncio.run(main())`
  },
  javascript: {
    title: 'event_stream.js (Reactive Stream)',
    language: 'javascript' as const,
    code: `// Reactive Event Stream & Batch Processor
class EventBatcher {
  constructor(batchSize = 3, flushTimeout = 1000) {
    this.batchSize = batchSize;
    this.flushTimeout = flushTimeout;
    this.buffer = [];
    this.timer = null;
  }

  push(event) {
    this.buffer.push({ ...event, timestamp: Date.now() });
    console.log(\`Received event: \${event.type}. Current buffer size: \${this.buffer.length}\`);
    
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushTimeout);
    }
  }

  flush() {
    clearTimeout(this.timer);
    this.timer = null;
    if (this.buffer.length === 0) return;
    
    const chunk = [...this.buffer];
    this.buffer = [];
    console.log(\`Flushed batch of \${chunk.length} items to database:\`, chunk);
  }
}

const batcher = new EventBatcher(3);
batcher.push({ type: 'USER_LOGIN', userId: 42 });
batcher.push({ type: 'PROJECT_VIEW', projectId: 1 });
batcher.push({ type: 'CODE_RUN', language: 'javascript' });`
  },
  html: {
    title: 'dashboard_canvas.html (Canvas 2D)',
    language: 'html' as const,
    code: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Canvas 2D Metric Sparkline</title>
</head>
<body>
  <div class="kpi-panel">
    <h3>Сетевой трафик (Запросов/сек)</h3>
    <canvas id="liveChart" width="360" height="90"></canvas>
  </div>

  <script>
    const canvas = document.getElementById('liveChart');
    const ctx = canvas.getContext('2d');
    const points = [12, 19, 25, 22, 38, 45, 60, 58, 72, 85];
    
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((val, idx) => {
      const x = (idx / (points.length - 1)) * 340 + 10;
      const y = 80 - (val / 100) * 70;
      idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  </script>
</body>
</html>`
  }
};

export const CodeSandbox: React.FC<CodeSandboxProps> = ({ customSnippet, onCopySuccess }) => {
  const [activeTab, setActiveTab] = useState<'python' | 'javascript' | 'html'>('python');
  const [currentCode, setCurrentCode] = useState<string>(DEFAULT_SNIPPETS.python.code);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outputLogs, setOutputLogs] = useState<string>('Нажмите «Запустить код», чтобы выполнить сниппет и просмотреть поток stdout.');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync when user clicks "В песочницу" on any project card
  useEffect(() => {
    if (customSnippet) {
      setActiveTab(customSnippet.language);
      setCurrentCode(customSnippet.code);
      setOutputLogs(`Загружен код проекта: «${customSnippet.title}». Нажмите «Запустить код» для выполнения.`);
      setExecutionTime(null);
    }
  }, [customSnippet]);

  // Handle Tab Switch
  const handleTabChange = (lang: 'python' | 'javascript' | 'html') => {
    setActiveTab(lang);
    setCurrentCode(DEFAULT_SNIPPETS[lang].code);
    setOutputLogs(`Готов к выполнению: ${DEFAULT_SNIPPETS[lang].title}`);
    setExecutionTime(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setCurrentCode(DEFAULT_SNIPPETS[activeTab].code);
    setOutputLogs('Код сниппета сброшен до эталонного значения.');
    setExecutionTime(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutputLogs('Выполнение сниппета в изолированном контексте...');
    setExecutionTime(null);

    try {
      const res = await fetch('/api/v1/sandbox/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeTab,
          code: currentCode
        })
      });

      const data = await res.json();
      setIsRunning(false);
      if (data.success) {
        setOutputLogs(data.output);
        setExecutionTime(data.executionTimeMs || 45);
      } else {
        setOutputLogs(`Ошибка выполнения: ${data.output}`);
      }
    } catch (err: any) {
      setIsRunning(false);
      setOutputLogs(`Ошибка сети при запуске кода: ${err.message}`);
    }
  };

  const getLanguagePrismClass = () => {
    switch (activeTab) {
      case 'python':
        return 'language-python';
      case 'javascript':
        return 'language-javascript';
      case 'html':
        return 'language-markup';
      default:
        return 'language-javascript';
    }
  };

  return (
    <section id="sandbox" className="py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            Интерактивная среда
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Песочница кода & Терминал
          </h2>
          <p className="text-slate-400 mt-2 text-base leading-relaxed">
            Переключайте вкладки языков, изучайте примеры чистого кода и запускайте выполнение в режиме реального времени.
          </p>
        </div>

        {/* Terminal Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
          
          {/* Top Window Bar */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* Window Dots & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-400">
                ~/portfolio/{DEFAULT_SNIPPETS[activeTab].title}
              </span>
            </div>

            {/* Language Tabs (Segmented Buttons) */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => handleTabChange('python')}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'python'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Python 3.11
              </button>
              <button
                onClick={() => handleTabChange('javascript')}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'javascript'
                    ? 'bg-yellow-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                JavaScript ES6+
              </button>
              <button
                onClick={() => handleTabChange('html')}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'html'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                HTML5 Canvas
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Сбросить код"
                aria-label="Сбросить код сниппета"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-800/80 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                title="Копировать код"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Скопировано</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Копировать</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-sm cursor-pointer shadow-emerald-950/40"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Выполнение...' : 'Запустить код'}</span>
              </button>
            </div>
          </div>

          {/* Code Editor & Syntax Highlight Display */}
          <div className="relative">
            <pre className="!bg-slate-950 max-h-[380px] overflow-auto p-5 text-xs sm:text-sm font-mono leading-relaxed">
              <code
                className={getLanguagePrismClass()}
                dangerouslySetInnerHTML={{ __html: highlightCode(currentCode, activeTab) }}
              />
            </pre>
          </div>

          {/* Interactive Terminal Output Console */}
          <div className="border-t border-slate-800 bg-slate-900/95 p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-slate-300">
                  Вывод терминала (stdout / logs)
                </span>
              </div>

              {executionTime !== null && (
                <span className="text-xs font-mono text-emerald-400">
                  Exit: 0 · Время: {executionTime}ms
                </span>
              )}
            </div>

            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {outputLogs}
            </pre>
          </div>

        </div>

      </div>
    </section>
  );
};
