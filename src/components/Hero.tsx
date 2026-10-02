import React from 'react';
import { ArrowRight, Terminal, Code2, Sparkles, Download, Layers, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onScrollToProjects: () => void;
  onScrollToSandbox: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToProjects, onScrollToSandbox }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80">
      {/* Subtle background glow effect without distracting clutter */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Availability Kicker - unboxed text metadata */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">Доступен для проектов</span>
              <span aria-hidden="true">·</span>
              <span>Python 3.11+</span>
              <span aria-hidden="true">·</span>
              <span>Modern JavaScript</span>
              <span aria-hidden="true">·</span>
              <span>Semantic HTML5</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] font-display">
              Архитектура <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">FastAPI</span> & интерактивный веб
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Разрабатываю высоконагруженные асинхронные бэкенды на Python, реактивные веб-интерфейсы на современном JavaScript и оптимизированную семантическую верстку HTML5. Чистый код, строгая типизация и реальные сценарии.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToProjects}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30 cursor-pointer"
              >
                <span>Каталог проектов</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToSandbox}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-700/80 font-medium text-sm hover:bg-slate-850 hover:text-white transition-colors cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Песочница кода</span>
              </button>

              <a
                href="#contacts"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white font-medium text-sm transition-colors"
              >
                <span>Написать мне</span>
              </a>
            </div>

            {/* Quantitative Rigor Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">6+</div>
                <div className="text-xs text-slate-400 mt-0.5">Проектов в каталоге</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 font-mono tabular-nums">&lt;120ms</div>
                <div className="text-xs text-slate-400 mt-0.5">Время отклика API</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Чистая архитектура</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Code Sandbox Teaser Graphic */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs font-mono text-slate-400 ml-2">app/main.py</span>
                </div>
                <span className="text-xs font-mono text-blue-400">FastAPI + aiosqlite</span>
              </div>

              {/* Code Snippet in Hero Preview */}
              <div className="mt-4 font-mono text-xs sm:text-sm text-slate-300 space-y-1.5 overflow-x-auto">
                <div className="text-slate-500"># Асинхронный эндпоинт портфолио</div>
                <div>
                  <span className="text-purple-400">@app.get</span>
                  <span className="text-slate-200">(</span>
                  <span className="text-emerald-300">"/api/v1/projects"</span>
                  <span className="text-slate-200">)</span>
                </div>
                <div>
                  <span className="text-purple-400">async def</span>{' '}
                  <span className="text-yellow-300">get_portfolio_projects</span>
                  <span className="text-slate-200">(</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-300">category</span>
                  <span className="text-slate-200">:</span>{' '}
                  <span className="text-blue-300">CategoryType</span>{' '}
                  <span className="text-slate-200">=</span>{' '}
                  <span className="text-purple-400">Query</span>
                  <span className="text-slate-200">(</span>
                  <span className="text-emerald-300">"all"</span>
                  <span className="text-slate-200">)</span>
                </div>
                <div>
                  <span className="text-slate-200">):</span>
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">async with</span>{' '}
                  <span className="text-slate-200">await db.connect()</span>{' '}
                  <span className="text-purple-400">as</span>{' '}
                  <span className="text-sky-300">conn</span>
                  <span className="text-slate-200">:</span>
                </div>
                <div className="pl-8 text-slate-400">
                  items = await ProjectRepository.get_all(category)
                </div>
                <div className="pl-8">
                  <span className="text-purple-400">return</span>{' '}
                  <span className="text-slate-200">&#123;</span>
                  <span className="text-emerald-300">"items"</span>
                  <span className="text-slate-200">: items, </span>
                  <span className="text-emerald-300">"total"</span>
                  <span className="text-slate-200">: len(items)&#125;</span>
                </div>
              </div>

              {/* Status footer bar */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  SQLite3 : Connected
                </span>
                <span className="text-slate-500">200 OK · 1.4ms</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
