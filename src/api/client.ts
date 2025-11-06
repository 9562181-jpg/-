// API 클라이언트 설정

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 토큰 관리
export const TokenManager = {
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
  
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },
  
  removeToken(): void {
    localStorage.removeItem('auth_token');
  }
};

// API 요청 헬퍼
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = TokenManager.getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// API 메서드
export const api = {
  // 인증 API
  auth: {
    signup: async (email: string, password: string, displayName: string) => {
      return apiRequest<{ user: any; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName }),
      });
    },

    login: async (email: string, password: string) => {
      return apiRequest<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    me: async () => {
      return apiRequest<{ user: any }>('/auth/me');
    },
  },

  // 메모 API
  notes: {
    getAll: async () => {
      return apiRequest<{ notes: any[] }>('/notes');
    },

    create: async (folderId: string, content?: string) => {
      return apiRequest<{ note: any }>('/notes', {
        method: 'POST',
        body: JSON.stringify({ folderId, content: content || '' }),
      });
    },

    update: async (id: string, content: string) => {
      return apiRequest<{ note: any }>(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      });
    },

    delete: async (id: string) => {
      return apiRequest<{ message: string }>(`/notes/${id}`, {
        method: 'DELETE',
      });
    },

    move: async (id: string, folderId: string) => {
      return apiRequest<{ note: any }>(`/notes/${id}/move`, {
        method: 'PATCH',
        body: JSON.stringify({ folderId }),
      });
    },
  },

  // 폴더 API
  folders: {
    getAll: async () => {
      return apiRequest<{ folders: any[] }>('/folders');
    },

    create: async (name: string, parentId?: string | null) => {
      return apiRequest<{ folder: any }>('/folders', {
        method: 'POST',
        body: JSON.stringify({ name, parentId }),
      });
    },

    update: async (id: string, name: string) => {
      return apiRequest<{ folder: any }>(`/folders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });
    },

    delete: async (id: string) => {
      return apiRequest<{ message: string }>(`/folders/${id}`, {
        method: 'DELETE',
      });
    },
  },
};

