import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { extractTitle, formatDate } from '../utils/storage';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchNotes } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchNotes>>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setResults(searchNotes(value));
    } else {
      setResults([]);
    }
  };

  const handleNoteClick = (noteId: string) => {
    navigate(`/note/${noteId}`);
  };

  const getPreviewText = (content: string): string => {
    const text = content.replace(/<[^>]*>/g, '');
    const lines = text.split('\n');
    const preview = lines.slice(1, 3).join(' ');
    return preview.substring(0, 100);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span>←</span>
            뒤로
          </button>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <span>🔍</span>
            메모 검색
          </h2>
          <div className="w-20"></div>
        </div>

        {/* 검색 바 */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </div>
          <input
            type="text"
            placeholder="메모 내용을 검색하세요..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
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
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">📭</div>
            <p className="text-xl text-gray-500 mb-2">검색 결과가 없습니다</p>
            <p className="text-gray-400">다른 키워드로 검색해보세요</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                <span>✓</span>
                {results.length}개의 메모를 찾았습니다
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note.id)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 group-hover:text-blue-600 transition-colors">
                        {extractTitle(note.content)}
                      </h3>
                      <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">
                        {formatDate(note.modifiedAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[60px]">
                      {getPreviewText(note.content) || '내용 없음'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
