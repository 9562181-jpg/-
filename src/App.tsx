import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import FolderList from './components/FolderList';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import SearchPage from './components/SearchPage';

function BottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === '/'
                ? 'text-blue-600 font-semibold'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <span className="text-2xl mb-1">📁</span>
            <span className="text-xs">폴더</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === '/search'
                ? 'text-blue-600 font-semibold'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <span className="text-2xl mb-1">🔍</span>
            <span className="text-xs">검색</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 pb-20">
          <Routes>
            <Route path="/" element={<FolderList />} />
            <Route path="/folder/:folderId" element={<NoteList />} />
            <Route path="/note/:noteId" element={<NoteEditor />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
