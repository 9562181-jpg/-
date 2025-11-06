'use client';

import React, { useState } from 'react';
import { useAuth } from '../app/providers';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          setError('이름을 입력해주세요.');
          setLoading(false);
          return;
        }
        await signup(email, password, displayName);
      }
    } catch (err: any) {
      console.error(err);
      // 로컬 모드 에러 처리
      if (err.message) {
        setError(err.message);
      } else {
        // Firebase 에러 처리
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('이미 사용 중인 이메일입니다.');
            break;
          case 'auth/invalid-email':
            setError('유효하지 않은 이메일 주소입니다.');
            break;
          case 'auth/weak-password':
            setError('비밀번호는 최소 6자 이상이어야 합니다.');
            break;
          case 'auth/user-not-found':
            setError('사용자를 찾을 수 없습니다.');
            break;
          case 'auth/wrong-password':
            setError('비밀번호가 올바르지 않습니다.');
            break;
          default:
            setError('오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden -z-10">
        {/* 밝은 배경 장식 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pastel-pink rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pastel-purple rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pastel-blue rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full">
        {/* 로고 섹션 */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-pastel mb-4 animate-float">
            <span className="text-7xl">📝</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            메모 앱
          </h1>
          <p className="text-gray-600 text-lg">당신의 생각을 기록하세요</p>
        </div>

        {/* 로그인/회원가입 폼 */}
        <div className="glass-effect rounded-3xl shadow-pastel-hover p-8 animate-fade-in">
          {/* 탭 전환 */}
          <div className="flex gap-2 mb-6 p-1 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isLogin
                  ? 'bg-white text-pink-600 shadow-lg transform scale-105'
                  : 'text-gray-500 hover:text-pink-500'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isLogin
                  ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-fade-in">
              <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이름 ✨
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all bg-white"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일 📧
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호 🔒
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all bg-white"
                required
                minLength={6}
              />
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500">최소 6자 이상 입력해주세요</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg ${
                isLogin
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
              } ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  처리 중...
                </span>
              ) : isLogin ? (
                '로그인하기'
              ) : (
                '회원가입하기'
              )}
            </button>
          </form>

          {/* 추가 정보 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="font-bold text-pink-600 hover:text-pink-700 transition-colors"
              >
                {isLogin ? '회원가입' : '로그인'}
              </button>
            </p>
          </div>
        </div>

        {/* 데이터베이스 안내 */}
        <div className="mt-6 p-4 glass-effect rounded-2xl text-center border-2 border-green-100">
          <div>
            <p className="text-sm font-semibold text-green-600 mb-2">
              💽 SQLite + Prisma ORM
            </p>
            <p className="text-xs text-gray-600 mb-2">
              안전한 로컬 데이터베이스로 모든 메모를 관리합니다
            </p>
            <p className="text-xs text-green-600">
              ✅ bcrypt 비밀번호 암호화 | JWT 인증 | 사용자별 데이터 완전 분리
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

