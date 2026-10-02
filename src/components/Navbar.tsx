import React, { useState } from 'react';
import { Activity, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { HealthStatus } from '../types';

interface NavbarProps {
  health: HealthStatus;
  onOpenHealthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ health, onOpenHealthModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHealthy = health.status === 'healthy';

  const navLinks = [
    { label: 'Стек', href: '#stack' },
    { label: 'Проекты', href: '#projects' },
    { label: 'Песочница кода', href: '#sandbox' },
    { label: 'Контакты', href: '#contacts' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-white hover:text-blue-400 transition-colors font-display"
        >
          denis.dev
        </a>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Health status button */}
          <button
            onClick={onOpenHealthModal}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-600 transition-all text-slate-300 whitespace-nowrap"
            title="Проверить статус API и SQLite"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="hidden sm:inline">API:</span>
            <span className={isHealthy ? 'text-emerald-400' : 'text-rose-400'}>
              {isHealthy ? 'Online' : 'Offline'}
            </span>
          </button>

          {/* Primary Action Button */}
          <a
            href="#contacts"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm shadow-blue-900/30 whitespace-nowrap"
          >
            <span>Связаться</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none"
            aria-label="Открыть навигационное меню"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacts"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Связаться с разработчиком
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
