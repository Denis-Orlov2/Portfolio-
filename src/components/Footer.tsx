import React from 'react';
import { Github, Code2, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Mission */}
          <div className="text-center md:text-left">
            <a href="#" className="text-lg font-bold tracking-tight text-white font-display">
              denis.dev
            </a>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Асинхронные бэкенды на Python, чистый JavaScript ES6+ и семантическая разметка HTML5.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#stack" className="hover:text-white transition-colors">
              Стек технологий
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              Проекты
            </a>
            <a href="#sandbox" className="hover:text-white transition-colors">
              Песочница кода
            </a>
            <a href="#contacts" className="hover:text-white transition-colors">
              Контакты
            </a>
          </div>

          {/* Source Info */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Все права защищены</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
