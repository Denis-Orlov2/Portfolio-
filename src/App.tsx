/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TechStack } from './components/TechStack';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { CodeSandbox } from './components/CodeSandbox';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HealthModal } from './components/HealthModal';
import { ToastContainer } from './components/Toast';
import { Project, ProjectCategory, HealthStatus, ToastMessage } from './types';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  
  const [health, setHealth] = useState<HealthStatus>({
    status: 'checking',
    database: 'unknown'
  });
  const [isHealthModalOpen, setIsHealthModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Selected snippet transferred from Project card to Sandbox
  const [customSandboxSnippet, setCustomSandboxSnippet] = useState<{
    code: string;
    language: 'html' | 'javascript' | 'python';
    title: string;
  } | null>(null);

  // Toast dispatcher
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check health status from /api/v1/health
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/health');
      if (res.ok) {
        const data = await res.json();
        setHealth({
          status: data.status === 'healthy' ? 'healthy' : 'unhealthy',
          database: data.database === 'connected' ? 'connected' : 'disconnected'
        });
      } else {
        setHealth({ status: 'unhealthy', database: 'disconnected' });
      }
    } catch {
      setHealth({ status: 'unhealthy', database: 'disconnected' });
    }
  }, []);

  // Fetch projects from /api/v1/projects?category=...
  const fetchProjects = useCallback(async (cat: ProjectCategory) => {
    setIsLoadingProjects(true);
    try {
      const url = cat === 'all' ? '/api/v1/projects' : `/api/v1/projects?category=${cat}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.items || []);
        setTotalProjects(data.total || (data.items ? data.items.length : 0));
      } else {
        addToast('error', 'Ошибка загрузки', 'Не удалось получить список проектов с сервера.');
      }
    } catch (err: any) {
      addToast('error', 'Сетевой сбой', `Не удалось связаться с API: ${err.message}`);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [addToast]);

  useEffect(() => {
    checkHealth();
    fetchProjects(selectedCategory);
  }, [checkHealth, fetchProjects, selectedCategory]);

  const handleCategoryChange = (cat: ProjectCategory) => {
    setSelectedCategory(cat);
  };

  const handleSendToSandbox = (
    code: string,
    language: 'html' | 'javascript' | 'python',
    title: string
  ) => {
    setCustomSandboxSnippet({ code, language, title });
    addToast(
      'info',
      'Код передан в терминал',
      `Сниппет «${title}» загружен в интерактивную песочницу.`
    );
  };

  const handleCopySuccess = () => {
    addToast('success', 'Буфер обмена', 'Код сниппета успешно скопирован!');
  };

  const handleContactSuccess = (msg: string) => {
    addToast('success', 'Сообщение доставлено!', msg);
  };

  const handleContactError = (msg: string) => {
    addToast('error', 'Ошибка отправки', msg);
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSandbox = () => {
    document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation Bar */}
      <Navbar
        health={health}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScrollToProjects={scrollToProjects}
          onScrollToSandbox={scrollToSandbox}
        />

        {/* Tech Stack Profile */}
        <TechStack onSelectCategory={handleCategoryChange} />

        {/* Dynamic Filterable Projects Showcase */}
        <ProjectsShowcase
          projects={projects}
          total={totalProjects}
          isLoading={isLoadingProjects}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onSendToSandbox={handleSendToSandbox}
          onCopySuccess={handleCopySuccess}
        />

        {/* Interactive Code Terminal / Sandbox */}
        <CodeSandbox
          customSnippet={customSandboxSnippet}
          onCopySuccess={handleCopySuccess}
        />

        {/* Contact Form with SQLite Persistence */}
        <ContactSection
          onSuccess={handleContactSuccess}
          onError={handleContactError}
        />
      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Health & Diagnostic Modal */}
      <HealthModal
        isOpen={isHealthModalOpen}
        health={health}
        totalProjects={totalProjects}
        onClose={() => setIsHealthModalOpen(false)}
        onRefresh={() => {
          checkHealth();
          fetchProjects(selectedCategory);
        }}
      />
    </div>
  );
}
