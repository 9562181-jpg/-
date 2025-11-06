import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, TokenManager } from '../api/client';

interface User {
  id: string;
  uid: string; // id와 동일 (호환성)
  email: string;
  displayName: string;
}

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
        setCurrentUser({
          ...user,
          uid: user.id, // 호환성을 위해 uid 추가
        });
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
    setCurrentUser({
      ...user,
      uid: user.id,
    });
  };

  // 로그인
  const login = async (email: string, password: string) => {
    const { user, token } = await api.auth.login(email, password);
    TokenManager.setToken(token);
    setCurrentUser({
      ...user,
      uid: user.id,
    });
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

