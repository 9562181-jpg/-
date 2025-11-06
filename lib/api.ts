// Token 관리
export class TokenManager {
  private static TOKEN_KEY = 'auth_token';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

// API 클라이언트
const API_BASE_URL = typeof window !== 'undefined' ? '' : 'http://localhost:3000';

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = TokenManager.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers || {}) as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API 요청 실패');
  }

  return data;
}

export const api = {
  auth: {
    signup: (email: string, password: string, displayName: string) =>
      request<{ user: any; token: string }>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName }),
      }),

    login: (email: string, password: string) =>
      request<{ user: any; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    me: () => request<{ user: any }>('/api/auth/me'),
  },

  notes: {
    list: () => request<{ notes: any[] }>('/api/notes'),

    create: (folderId: string, content: string = '') =>
      request<{ note: any }>('/api/notes', {
        method: 'POST',
        body: JSON.stringify({ folderId, content }),
      }),

    update: (id: string, content: string) =>
      request<{ note: any }>(`/api/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      }),

    delete: (id: string) =>
      request<{ message: string }>(`/api/notes/${id}`, {
        method: 'DELETE',
      }),

    move: (id: string, folderId: string) =>
      request<{ note: any }>(`/api/notes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ folderId }),
      }),
  },

  folders: {
    list: () => request<{ folders: any[] }>('/api/folders'),

    create: (name: string, parentId: string | null = null) =>
      request<{ folder: any }>('/api/folders', {
        method: 'POST',
        body: JSON.stringify({ name, parentId }),
      }),

    update: (id: string, name: string) =>
      request<{ folder: any }>(`/api/folders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
      }),

    delete: (id: string) =>
      request<{ message: string }>(`/api/folders/${id}`, {
        method: 'DELETE',
      }),
  },
};

