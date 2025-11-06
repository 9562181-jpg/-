import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import FolderList from './components/FolderList';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import SearchPage from './components/SearchPage';
import AuthPage from './components/AuthPage';

function BottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect shadow-pastel z-50 rounded-t-3xl">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-around items-center h-20">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all transform ${
              location.pathname === '/'
                ? 'text-pink-600 font-bold scale-110'
                : 'text-gray-500 hover:text-pink-500 hover:scale-105'
            }`}
          >
            <span className="text-3xl mb-1">📁</span>
            <span className="text-xs font-semibold">폴더</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all transform ${
              location.pathname === '/search'
                ? 'text-pink-600 font-bold scale-110'
                : 'text-gray-500 hover:text-pink-500 hover:scale-105'
            }`}
          >
            <span className="text-3xl mb-1">🔍</span>
            <span className="text-xs font-semibold">검색</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function MainApp() {
  const { currentUser, logout, isLocalMode } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await logout();
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    }
  };

  // Firebase 모드에서만 로그인 페이지 표시
  if (!currentUser && !isLocalMode) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* 상단 헤더 - 사용자 정보 및 로그아웃 */}
      <div className="fixed top-0 left-0 right-0 glass-effect shadow-pastel z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {currentUser?.displayName?.charAt(0) || '😊'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                {currentUser?.displayName || '사용자'}
                {isLocalMode && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 text-xs rounded-full font-medium">
                    로컬 모드
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500">{currentUser?.email || ''}</p>
            </div>
          </div>
          {!isLocalMode && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm"
            >
              로그아웃
            </button>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 - 상단 헤더 높이만큼 패딩 추가 */}
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<FolderList />} />
          <Route path="/folder/:folderId" element={<NoteList />} />
          <Route path="/note/:noteId" element={<NoteEditor />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
      
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <MainApp />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
