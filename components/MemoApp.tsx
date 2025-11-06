'use client';

import React, { useState } from 'react';
import { useAuth, useApp } from '@/app/providers';
import FolderList from './FolderList';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import SearchPage from './SearchPage';

type View = 'folders' | 'notes' | 'note' | 'search';

export default function MemoApp() {
  const { currentUser, logout } = useAuth();
  const { notes, loadFolders, loadNotes } = useApp();
  const [currentView, setCurrentView] = useState<View>('folders');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await logout();
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setCurrentView('notes');
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    setCurrentView('note');
  };

  const handleBackToFolders = () => {
    setCurrentView('folders');
    setSelectedFolderId(null);
    setSelectedNoteId(null);
  };

  const handleBackToNotes = () => {
    setCurrentView('notes');
    setSelectedNoteId(null);
  };

  const handleSearchNoteSelect = (noteId: string) => {
    // 검색에서 메모 선택 시 메모 편집으로 이동
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setSelectedFolderId(note.folderId);
      setSelectedNoteId(noteId);
      setCurrentView('note');
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  React.useEffect(() => {
    const loadData = async () => {
      try {
        await loadFolders();
        await loadNotes();
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <span className="px-2 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs rounded-full font-medium">
                  Next.js + Prisma
                </span>
              </p>
              <p className="text-xs text-gray-500">{currentUser?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 - 상단 헤더 높이만큼 패딩 추가 */}
      <div className="pt-20">
        {currentView === 'folders' && <FolderList onFolderSelect={handleFolderSelect} />}
        {currentView === 'notes' && selectedFolderId && (
          <NoteList
            folderId={selectedFolderId}
            onNoteSelect={handleNoteSelect}
            onBack={handleBackToFolders}
          />
        )}
        {currentView === 'note' && selectedNoteId && (
          <NoteEditor noteId={selectedNoteId} onBack={handleBackToNotes} />
        )}
        {currentView === 'search' && <SearchPage onNoteSelect={handleSearchNoteSelect} />}
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 glass-effect shadow-pastel z-50 rounded-t-3xl">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-around items-center h-20">
            <button
              onClick={() => setCurrentView('folders')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all transform ${
                currentView === 'folders'
                  ? 'text-pink-600 font-bold scale-110'
                  : 'text-gray-500 hover:text-pink-500 hover:scale-105'
              }`}
            >
              <span className="text-3xl mb-1">📁</span>
              <span className="text-xs font-semibold">폴더</span>
            </button>
            <button
              onClick={() => setCurrentView('search')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all transform ${
                currentView === 'search'
                  ? 'text-pink-600 font-bold scale-110'
                  : 'text-gray-500 hover:text-pink-500 hover:scale-105'
              }`}
            >
              <span className="text-3xl mb-1">🔍</span>
              <span className="text-xs font-semibold">검색</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

