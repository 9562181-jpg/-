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

  // 로컬 스토리지 모드 - 세션 확인
  useEffect(() => {
    if (isLocalMode) {
      // 현재 로그인된 사용자 확인
      const currentSession = localStorage.getItem('local-current-session');
      if (currentSession) {
        setCurrentUser(JSON.parse(currentSession) as any);
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
    if (isLocalMode) {
      // 로컬 모드 회원가입
      const users = JSON.parse(localStorage.getItem('local-users') || '[]');
      
      // 이메일 중복 확인
      if (users.find((u: any) => u.email === email)) {
        throw new Error('이미 존재하는 이메일입니다.');
      }
      
      // 새 사용자 생성
      const newUser = {
        uid: `local-${Date.now()}`,
        email,
        displayName,
        password, // 실제로는 암호화해야 하지만 데모용으로 평문 저장
      };
      
      users.push(newUser);
      localStorage.setItem('local-users', JSON.stringify(users));
      
      // 자동 로그인
      const sessionUser = { uid: newUser.uid, email: newUser.email, displayName: newUser.displayName };
      localStorage.setItem('local-current-session', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser as any);
    } else {
      if (!auth) throw new Error('Firebase 인증이 설정되지 않았습니다.');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    if (isLocalMode) {
      // 로컬 모드 로그인
      const users = JSON.parse(localStorage.getItem('local-users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      
      // 세션 저장
      const sessionUser = { uid: user.uid, email: user.email, displayName: user.displayName };
      localStorage.setItem('local-current-session', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser as any);
    } else {
      if (!auth) throw new Error('Firebase 인증이 설정되지 않았습니다.');
      await signInWithEmailAndPassword(auth, email, password);
    }
  };

  // 로그아웃
  const logout = async () => {
    if (isLocalMode) {
      // 로컬 모드 로그아웃 - 세션만 제거
      localStorage.removeItem('local-current-session');
      setCurrentUser(null);
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

