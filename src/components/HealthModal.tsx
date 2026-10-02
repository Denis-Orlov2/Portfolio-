import React from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Database, Server, Cpu } from 'lucide-react';
import { HealthStatus } from '../types';

interface HealthModalProps {
  isOpen: boolean;
  health: HealthStatus;
  totalProjects: number;
  onClose: () => void;
  onRefresh: () => void;
}

export const HealthModal: React.FC<HealthModalProps> = ({
  isOpen,
  health,
  totalProjects,
  onClose,
  onRefresh
}) => {
  if (!isOpen) return null;

  const isHealthy = health.status === 'healthy';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white font-display">
              Диагностика API & Сервисов
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status items */}
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">REST API Status (/api/v1/health)</span>
            <span className={`flex items-center gap-1.5 font-bold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isHealthy ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {isHealthy ? 'HEALTHY (200 OK)' : 'UNHEALTHY'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">База данных SQLite (portfolio.sqlite)</span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <Database className="w-4 h-4" />
              {health.database === 'connected' ? 'CONNECTED' : health.database.toUpperCase()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Проектов в SQLite таблице</span>
            <span className="text-white font-bold tabular-nums">
              {totalProjects} записей
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Доступные эндпоинты</span>
            <span className="text-blue-400">
              GET /projects, POST /contacts
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Перепроверить статус</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
