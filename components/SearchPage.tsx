'use client';

import React, { useState } from 'react';
import { useApp } from '@/app/providers';

interface SearchPageProps {
  onNoteSelect: (noteId: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onNoteSelect }) => {
  const { notes } = useApp();
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  const searchResults = notes.filter((note) => {
    if (!query.trim()) return false;
    return note.content.toLowerCase().includes(query.toLowerCase());
  });

  const extractTitle = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const firstLine = plainText.split('\n')[0];
    return firstLine.trim() || '제목 없음';
  };

  const getPreviewText = (content: string): string => {
    const text = content.replace(/<[^>]*>/g, '');
    const lines = text.split('\n');
    const preview = lines.slice(1, 3).join(' ');
    return preview.substring(0, 100);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return d.toLocaleDateString('ko-KR');
  };

  const handleNoteClick = (noteId: string) => {
    onNoteSelect(noteId);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <span>🔍</span>
            메모 검색
          </h2>
        </div>

        {/* 검색 바 */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 text-xl">
            🔍
          </div>
          <input
            type="text"
            placeholder="메모 내용을 검색하세요..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-12 py-4 text-lg border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all shadow-pastel glass-effect"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600 text-xl transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 */}
      <div>
        {query.trim() === '' ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🔍</div>
            <p className="text-xl text-gray-500">검색어를 입력해주세요</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">📭</div>
            <p className="text-xl text-gray-500">검색 결과가 없습니다</p>
            <p className="text-gray-400 mt-2">다른 검색어로 시도해보세요</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full inline-block font-semibold">
              {searchResults.length}개의 메모를 찾았습니다
            </div>
            <div className="space-y-4">
              {searchResults.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note.id)}
                  className="glass-effect rounded-2xl shadow-pastel hover:shadow-pastel-hover transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-pink-100 overflow-hidden group"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors line-clamp-1">
                      {extractTitle(note.content)}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {getPreviewText(note.content) || '내용 없음'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-3 py-1 rounded-full font-semibold">
                        {formatDate(note.modifiedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
