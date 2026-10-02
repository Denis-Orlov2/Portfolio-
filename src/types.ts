export type ProjectCategory = 'all' | 'html' | 'javascript' | 'python';

export interface Project {
  id: number;
  title: string;
  description: string;
  category: 'html' | 'javascript' | 'python';
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  code_snippet: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  client_ip: string | null;
  created_at: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'checking';
  database: 'connected' | 'disconnected' | 'unknown';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
