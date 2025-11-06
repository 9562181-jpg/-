'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, TokenManager } from '@/lib/api';
import type { User, Note, Folder } from '@/types';

// Auth Context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 세션 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = TokenManager.getToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { user } = await api.auth.me();
        setCurrentUser(user);
      } catch (error) {
        console.error('세션 확인 실패:', error);
        TokenManager.removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 회원가입
  const signup = async (email: string, password: string, displayName: string) => {
    const { user, token } = await api.auth.signup(email, password, displayName);
    TokenManager.setToken(token);
    setCurrentUser(user);
  };

  // 로그인
  const login = async (email: string, password: string) => {
    const { user, token } = await api.auth.login(email, password);
    TokenManager.setToken(token);
    setCurrentUser(user);
  };

  // 로그아웃
  const logout = async () => {
    TokenManager.removeToken();
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// App Context
interface AppContextType {
  notes: Note[];
  folders: Folder[];
  selectedFolderId: string | null;
  selectedNoteId: string | null;
  loading: boolean;
  setSelectedFolderId: (id: string | null) => void;
  setSelectedNoteId: (id: string | null) => void;
  loadNotes: () => Promise<void>;
  loadFolders: () => Promise<void>;
  createNote: (folderId: string, content?: string) => Promise<Note>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  moveNote: (id: string, folderId: string) => Promise<void>;
  createFolder: (name: string, parentId?: string | null) => Promise<Folder>;
  updateFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 메모 로드
  const loadNotes = async () => {
    try {
      setLoading(true);
      const { notes: fetchedNotes } = await api.notes.list();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('메모 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 폴더 로드
  const loadFolders = async () => {
    try {
      setLoading(true);
      const { folders: fetchedFolders } = await api.folders.list();
      setFolders(fetchedFolders);
    } catch (error) {
      console.error('폴더 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 메모 생성
  const createNote = async (folderId: string, content: string = '') => {
    const { note } = await api.notes.create(folderId, content);
    setNotes([note, ...notes]);
    return note;
  };

  // 메모 수정
  const updateNote = async (id: string, content: string) => {
    const { note } = await api.notes.update(id, content);
    setNotes(notes.map((n) => (n.id === id ? note : n)));
  };

  // 메모 삭제
  const deleteNote = async (id: string) => {
    await api.notes.delete(id);
    setNotes(notes.filter((n) => n.id !== id));
  };

  // 메모 이동
  const moveNote = async (id: string, folderId: string) => {
    const { note } = await api.notes.move(id, folderId);
    setNotes(notes.map((n) => (n.id === id ? note : n)));
  };

  // 폴더 생성
  const createFolder = async (name: string, parentId: string | null = null) => {
    const { folder } = await api.folders.create(name, parentId);
    setFolders([...folders, folder]);
    return folder;
  };

  // 폴더 수정
  const updateFolder = async (id: string, name: string) => {
    const { folder } = await api.folders.update(id, name);
    setFolders(folders.map((f) => (f.id === id ? folder : f)));
  };

  // 폴더 삭제
  const deleteFolder = async (id: string) => {
    await api.folders.delete(id);
    setFolders(folders.filter((f) => f.id !== id));
  };

  const value: AppContextType = {
    notes,
    folders,
    selectedFolderId,
    selectedNoteId,
    loading,
    setSelectedFolderId,
    setSelectedNoteId,
    loadNotes,
    loadFolders,
    createNote,
    updateNote,
    deleteNote,
    moveNote,
    createFolder,
    updateFolder,
    deleteFolder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Combined Providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
}

