import React, { useState } from 'react';
import { Send, Loader2, Mail, MessageSquare, User, CheckCircle2, AlertCircle, Database, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ContactMessage } from '../types';

interface ContactSectionProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSuccess, onError }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stored messages drawer state (to verify SQLite writes directly!)
  const [storedMessages, setStoredMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showMessagesDrawer, setShowMessagesDrawer] = useState(false);

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Пожалуйста, введите ваше имя';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Имя должно содержать не менее 2 символов';
    } else if (trimmedName.length > 60) {
      newErrors.name = 'Имя не должно превышать 60 символов';
    } else if (/<[^>]*>/.test(trimmedName)) {
      newErrors.name = 'Имя не должно содержать HTML-теги';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Пожалуйста, укажите email для связи';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Укажите корректный email (например, user@example.com)';
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      newErrors.message = 'Пожалуйста, напишите текст сообщения';
    } else if (trimmedMessage.length < 10) {
      newErrors.message = 'Сообщение должно содержать не менее 10 символов';
    } else if (trimmedMessage.length > 2000) {
      newErrors.message = 'Сообщение не должно превышать 2000 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      onError('Пожалуйста, исправьте ошибки в полях формы перед отправкой.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim()
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        onSuccess(data.message || 'Сообщение успешно доставлено разработчику.');
        
        // Clear form
        setName('');
        setEmail('');
        setMessage('');
        setErrors({});

        // If drawer is open, refresh message list
        if (showMessagesDrawer) {
          fetchStoredMessages();
        }
      } else if (response.status === 422) {
        // Validation error from server
        const detailMsg = data.detail?.[0]?.msg || 'Ошибка валидации входящих данных';
        onError(`Ошибка сервера (422): ${detailMsg}`);
      } else {
        onError(data.message || 'Произошла непредвиденная ошибка при отправке.');
      }
    } catch (err: any) {
      onError(`Сетевой сбой при отправке сообщения: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchStoredMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch('/api/v1/contacts');
      const data = await res.json();
      if (data.status === 'success') {
        setStoredMessages(data.items || []);
      }
    } catch (e) {
      console.error('Failed to fetch contact messages:', e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleToggleMessagesDrawer = () => {
    if (!showMessagesDrawer) {
      fetchStoredMessages();
    }
    setShowMessagesDrawer(!showMessagesDrawer);
  };

  return (
    <section id="contacts" className="py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Contacts & SQLite Database Inspector */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2">
                Связь и сотрудничество
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
                Контакты
              </h2>
              <p className="text-slate-400 mt-2 text-base leading-relaxed">
                Готов обсудить разработку асинхронных бэкенд-сервисов, интеграцию API, рефакторинг архитектуры и реализацию интерактивных веб-систем.
              </p>
            </div>

            {/* Direct contact items */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs text-slate-500">Электронная почта</div>
                  <a href="mailto:denisnemaskalov86@gmail.com" className="hover:text-blue-400 transition-colors font-mono">
                    denisnemaskalov86@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Database className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs text-slate-500">База данных обращений</div>
                  <div className="text-xs text-slate-300 font-mono">
                    SQLite3 (портфолио-сервер: portfolio.sqlite)
                  </div>
                </div>
              </div>
            </div>

            {/* SQLite Inspection Accordion Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleToggleMessagesDrawer}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Проверить записи в SQLite ({storedMessages.length || 'Нажмите для загрузки'})</span>
                </div>
                {showMessagesDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Messages list preview */}
              {showMessagesDrawer && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 max-h-60 overflow-y-auto">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-800">
                    <span>Таблица contact_messages</span>
                    <button
                      onClick={fetchStoredMessages}
                      className="hover:text-white flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                      Обновить
                    </button>
                  </div>

                  {isLoadingMessages ? (
                    <div className="text-xs text-slate-500 py-3 text-center">Загрузка данных из SQLite...</div>
                  ) : storedMessages.length === 0 ? (
                    <div className="text-xs text-slate-500 py-3 text-center">Записей пока нет. Отправьте тестовую форму!</div>
                  ) : (
                    storedMessages.map((msg) => (
                      <div key={msg.id} className="p-2 rounded bg-slate-900/80 border border-slate-800/80 text-xs font-mono">
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span className="text-blue-400 font-bold">#{msg.id} {msg.name}</span>
                          <span>{msg.created_at}</span>
                        </div>
                        <div className="text-slate-500 text-[10px] truncate">{msg.email}</div>
                        <div className="text-slate-300 mt-1 line-clamp-2">{msg.message}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Async Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl">
              
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Отправить сообщение разработчику
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Все обращения мгновенно валидируются и сохраняются в асинхронную базу данных.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Ваше имя <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Алексей Смирнов"
                      maxLength={60}
                      disabled={isSubmitting}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 border text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 transition-colors ${
                        errors.name
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email для обратной связи <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="alex@example.com"
                      disabled={isSubmitting}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 border text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 transition-colors ${
                        errors.email
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="message" className="block text-xs font-medium text-slate-300">
                      Текст сообщения <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                      {message.length} / 2000
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                      }}
                      placeholder="Привет! Заинтересовал твой проект. Обсудим сотрудничество?"
                      maxLength={2000}
                      disabled={isSubmitting}
                      className={`w-full p-3 rounded-lg bg-slate-950 border text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 transition-colors resize-none ${
                        errors.message
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {errors.message && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all shadow-md shadow-blue-900/30 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Отправка в SQLite базу данных...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Отправить сообщение</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
