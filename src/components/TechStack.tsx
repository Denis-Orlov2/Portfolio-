import React from 'react';
import { Terminal, Cpu, FileCode2, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { ProjectCategory } from '../types';

interface TechStackProps {
  onSelectCategory: (category: ProjectCategory) => void;
}

export const TechStack: React.FC<TechStackProps> = ({ onSelectCategory }) => {
  const stackItems = [
    {
      category: 'python' as ProjectCategory,
      title: 'Python Backend & Async Architecture',
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
      accentColor: 'text-blue-400',
      description: 'Проектирование асинхронных микросервисов, распределенных очередей задач и REST API с максимальной пропускной способностью.',
      keySkills: [
        'FastAPI & ASGI (Uvicorn)',
        'AsyncIO & Task Queues',
        'Pydantic v2 строгая валидация',
        'aiosqlite & SQLite3 / PostgreSQL',
        'Redis Streams & Caching',
        'httpx & парсинг данных'
      ],
      productionProjectsCount: '2 проекта в витрине'
    },
    {
      category: 'javascript' as ProjectCategory,
      title: 'Modern JavaScript & Interactive Web',
      badgeColor: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
      accentColor: 'text-yellow-400',
      description: 'Чистый Vanilla JS (ES6+ Modules) и реактивные интерфейсы без избыточных зависимостей. Виртуализация, Web Audio и Canvas.',
      keySkills: [
        'Vanilla JS (ES6+ Modules)',
        'Виртуализация бесконечных списков',
        'Web Audio API & синтез звука',
        'Fetch API & обработка ошибок',
        'DOM манипуляции без reflow',
        'TypeScript строгая типизация'
      ],
      productionProjectsCount: '2 проекта в витрине'
    },
    {
      category: 'html' as ProjectCategory,
      title: 'HTML5 Semantic & Canvas Engine',
      badgeColor: 'border-orange-500/30 text-orange-400 bg-orange-500/10',
      accentColor: 'text-orange-400',
      description: 'Безупречная семантика разметки, доступность WCAG AA, интерактивные Canvas 2D визуализации и адаптивная сетка CSS Grid.',
      keySkills: [
        'Семантическая разметка HTML5',
        'Canvas 2D API 60 FPS графика',
        'CSS Grid & Flexbox верстка',
        'Tailwind CSS v3/v4 архитектура',
        'ARIA атрибуты & доступность',
        'Адаптивность от 320px до 4K'
      ],
      productionProjectsCount: '2 проекта в витрине'
    }
  ];

  return (
    <section id="stack" className="py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2">
            Архитектурный профиль
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Технологический стек
          </h2>
          <p className="text-slate-400 mt-2 text-base leading-relaxed">
            Глубокая экспертиза в ключевых технологиях веб-разработки: от ядра распределенного бэкенда до пиксельной точности клиентского рендеринга.
          </p>
        </div>

        {/* 3 Tech Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stackItems.map((item) => (
            <div
              key={item.category}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-medium border ${item.badgeColor}`}>
                    {item.category.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {item.productionProjectsCount}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-display">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {item.description}
                </p>

                {/* Skills List */}
                <div className="space-y-2 mb-6">
                  {item.keySkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:${item.accentColor}`} />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link to Filter Projects */}
              <button
                onClick={() => {
                  onSelectCategory(item.category);
                  const el = document.getElementById('projects');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-white transition-colors cursor-pointer"
              >
                <span>Показать проекты на {item.category}</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
