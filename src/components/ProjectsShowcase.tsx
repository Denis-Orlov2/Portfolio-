import React, { useState } from 'react';
import { ExternalLink, Github, Code2, Terminal, X, Copy, Check, Eye } from 'lucide-react';
import { Project, ProjectCategory } from '../types';
import { highlightCode } from '../lib/prism';

interface ProjectsShowcaseProps {
  projects: Project[];
  total: number;
  isLoading: boolean;
  selectedCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
  onSendToSandbox: (code: string, language: 'html' | 'javascript' | 'python', title: string) => void;
  onCopySuccess: () => void;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({
  projects,
  total,
  isLoading,
  selectedCategory,
  onCategoryChange,
  onSendToSandbox,
  onCopySuccess
}) => {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories: Array<{ id: ProjectCategory; label: string; countSuffix?: string }> = [
    { id: 'all', label: 'Все проекты' },
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'html', label: 'HTML5' },
  ];

  const handleCopyCode = async (code: string, id: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      onCopySuccess();
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      onCopySuccess();
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'python':
        return {
          label: 'Python',
          border: 'border-blue-500/30',
          badge: 'text-blue-400 bg-blue-500/10',
          accent: 'text-blue-400',
          barColor: 'from-blue-600 to-sky-400',
        };
      case 'javascript':
        return {
          label: 'JavaScript',
          border: 'border-yellow-500/30',
          badge: 'text-yellow-400 bg-yellow-500/10',
          accent: 'text-yellow-400',
          barColor: 'from-yellow-500 to-amber-300',
        };
      case 'html':
        return {
          label: 'HTML5',
          border: 'border-orange-500/30',
          badge: 'text-orange-400 bg-orange-500/10',
          accent: 'text-orange-400',
          barColor: 'from-orange-500 to-amber-500',
        };
      default:
        return {
          label: cat,
          border: 'border-slate-700',
          badge: 'text-slate-400 bg-slate-800',
          accent: 'text-slate-400',
          barColor: 'from-slate-600 to-slate-400',
        };
    }
  };

  return (
    <section id="projects" className="py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2">
              Реализованные кейсы
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Витрина проектов
            </h2>
            <p className="text-slate-400 mt-2 text-base">
              Асинхронные бэкенд-сервисы, реактивные клиенты и семантические веб-решения.
            </p>
          </div>

          {/* Interactive Filter Tabs (functional segmented buttons) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
            {categories.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onCategoryChange(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800/60" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center max-w-md mx-auto">
            <Code2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">Проекты не найдены</h3>
            <p className="text-sm text-slate-400 mt-1">
              В выбранной категории сейчас нет записей. Попробуйте выбрать «Все проекты».
            </p>
            <button
              onClick={() => onCategoryChange('all')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Сбросить фильтр
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const theme = getCategoryTheme(project.category);

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900 transition-all duration-200 group relative"
                >
                  {/* Decorative top accent line */}
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${theme.barColor} mb-4`} />

                  <div>
                    {/* Header: Category and Links */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${theme.badge}`}>
                        {theme.label.toUpperCase()}
                      </span>

                      <div className="flex items-center gap-2">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Исходный код на GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Живое демо"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-blue-300 transition-colors font-display">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack: Clean unboxed metadata with bullet separators */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-400 mb-6">
                      {project.tech_stack.map((tech, idx) => (
                        <React.Fragment key={idx}>
                          <span className="text-slate-300">{tech}</span>
                          {idx < project.tech_stack.length - 1 && (
                            <span className="text-slate-600" aria-hidden="true">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Обзор кода</span>
                    </button>

                    <button
                      onClick={() => {
                        onSendToSandbox(project.code_snippet, project.category, project.title);
                        const el = document.getElementById('sandbox');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      title="Запустить в интерактивной песочнице"
                    >
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      <span>В песочницу</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Total count footer */}
        <div className="mt-8 text-center text-xs font-mono text-slate-500">
          Отображено {projects.length} из {total} доступных проектов
        </div>

      </div>

      {/* Project Details Modal */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModalProject(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-medium ${getCategoryTheme(activeModalProject.category).badge}`}>
                    {activeModalProject.category.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">ID: #{activeModalProject.id}</span>
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  {activeModalProject.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveModalProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Закрыть модальное окно"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Описание архитектуры
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeModalProject.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Стек технологий
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.tech_stack.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Snippet Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Реализация сниппета
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(activeModalProject.code_snippet, activeModalProject.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {copiedId === activeModalProject.id ? (
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
                      onClick={() => {
                        onSendToSandbox(
                          activeModalProject.code_snippet,
                          activeModalProject.category,
                          activeModalProject.title
                        );
                        setActiveModalProject(null);
                        const el = document.getElementById('sandbox');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      <span>Открыть в песочнице</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <pre className="max-h-72 overflow-x-auto p-4 text-xs font-mono text-slate-200">
                    <code dangerouslySetInnerHTML={{ __html: highlightCode(activeModalProject.code_snippet, activeModalProject.category) }} />
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">
                Создан: {new Date(activeModalProject.created_at).toLocaleDateString('ru-RU')}
              </span>
              <button
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
