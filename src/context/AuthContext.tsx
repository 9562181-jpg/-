import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLocalMode: boolean;
}

// 로컬 모드용 Mock User 타입
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
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
  const isLocalMode = !isFirebaseConfigured();

  // 로컬 스토리지 모드 - 자동 로그인
  useEffect(() => {
    if (isLocalMode) {
      // 로컬 모드에서는 자동으로 mock user 생성
      const localUser = localStorage.getItem('local-mock-user');
      if (localUser) {
        setCurrentUser(JSON.parse(localUser) as any);
      } else {
        // 기본 사용자 생성
        const mockUser = {
          uid: 'local-user-001',
          email: 'local@user.com',
          displayName: '로컬 사용자',
        };
        localStorage.setItem('local-mock-user', JSON.stringify(mockUser));
        setCurrentUser(mockUser as any);
      }
      setLoading(false);
    }
  }, [isLocalMode]);

  // Firebase 모드 - 실제 인증
  useEffect(() => {
    if (!isLocalMode && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [isLocalMode]);

  // 회원가입
  const signup = async (email: string, password: string, displayName: string) => {
    if (!auth) throw new Error('Firebase 인증이 설정되지 않았습니다.');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase 인증이 설정되지 않았습니다.');
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 로그아웃
  const logout = async () => {
    if (isLocalMode) {
      // 로컬 모드에서는 mock user만 제거 (실제로는 다시 생성됨)
      localStorage.removeItem('local-mock-user');
      window.location.reload();
    } else if (auth) {
      await signOut(auth);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    isLocalMode,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

