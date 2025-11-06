'use client';

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
      {/* ?§Îçî */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 glass-effect hover:shadow-pastel rounded-xl transition-all transform hover:scale-105"
          >
            <span>??/span>
            ?§Î°ú
          </button>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <span>?îç</span>
            Î©îÎ™® Í≤Ä??
          </h2>
          <div className="w-20"></div>
        </div>

        {/* Í≤Ä??Î∞?*/}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 text-xl">
            ?îç
          </div>
          <input
            type="text"
            placeholder="Î©îÎ™® ?¥Ïö©??Í≤Ä?âÌïò?∏Ïöî..."
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
              ??
            </button>
          )}
        </div>
      </div>

      {/* Í≤Ä??Í≤∞Í≥º */}
      <div>
        {query.trim() === '' ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">?îç</div>
            <p className="text-xl text-gray-500">Í≤Ä?âÏñ¥Î•??ÖÎ†•?¥Ï£º?∏Ïöî</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">?ì≠</div>
            <p className="text-xl text-gray-500 mb-2">Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏäµ?àÎã§</p>
            <p className="text-gray-400">?§Î•∏ ?§Ïõå?úÎ°ú Í≤Ä?âÌï¥Î≥¥ÏÑ∏??/p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-2xl font-medium shadow-pastel">
                <span>??/span>
                {results.length}Í∞úÏùò Î©îÎ™®Î•?Ï∞æÏïò?µÎãà??
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note.id)}
                  className="group glass-effect rounded-2xl shadow-pastel hover:shadow-pastel-hover transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-pink-100 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 group-hover:text-pink-600 transition-colors">
                        {extractTitle(note.content)}
                      </h3>
                      <span className="ml-2 px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-xs rounded-full whitespace-nowrap font-medium">
                        {formatDate(note.modifiedAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[60px]">
                      {getPreviewText(note.content) || '?¥Ïö© ?ÜÏùå'}
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

