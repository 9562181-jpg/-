import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { extractTitle, formatDate } from '../utils/storage';
import { SortOption } from '../types';

const NoteList: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const {
    folders,
    createNote,
    deleteNote,
    permanentlyDeleteNote,
    restoreNote,
    getNotesInFolder,
    sortOption,
    setSortOption,
  } = useAppContext();

  if (!folderId) {
    navigate('/');
    return null;
  }

  const folder = folders.find((f) => f.id === folderId);
  const notes = getNotesInFolder(folderId);
  const isRecentlyDeleted = folder?.name === '최근 삭제된 항목';

  const handleNewNote = () => {
    if (isRecentlyDeleted) return;
    const newNote = createNote(folderId);
    navigate(`/note/${newNote.id}`);
  };

  const handleNoteClick = (noteId: string) => {
    navigate(`/note/${noteId}`);
  };

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (isRecentlyDeleted) {
      if (window.confirm('이 메모를 영구적으로 삭제하시겠습니까?')) {
        permanentlyDeleteNote(noteId);
      }
    } else {
      deleteNote(noteId);
    }
  };

  const handleRestoreNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    const allNotesFolder = folders.find(f => f.name === '모든 메모');
    if (allNotesFolder) {
      restoreNote(noteId, allNotesFolder.id);
    }
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
            className="flex items-center gap-2 px-4 py-2 glass-effect hover:shadow-pastel rounded-xl transition-all transform hover:scale-105"
          >
            <span>←</span>
            뒤로
          </button>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <span>{isRecentlyDeleted ? '🗑️' : '📂'}</span>
            {folder?.name || '메모'}
          </h2>
          {!isRecentlyDeleted && (
            <button
              onClick={handleNewNote}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-pastel transform hover:scale-105"
            >
              <span>✏️</span>
              새 메모
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none glass-effect"
          >
            <option value="modifiedAt">⏰ 최근 수정순</option>
            <option value="createdAt">📅 생성 날짜순</option>
            <option value="title">🔤 제목순</option>
          </select>
          <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl font-semibold shadow-pastel">
            총 {notes.length}개의 메모
          </div>
        </div>
      </div>

      {/* 메모 목록 */}
      {notes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-4">{isRecentlyDeleted ? '📭' : '📝'}</div>
          <p className="text-xl text-gray-500">
            {isRecentlyDeleted
              ? '삭제된 메모가 없습니다'
              : '메모가 없습니다. 새 메모를 작성해보세요!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
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
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[60px]">
                  {getPreviewText(note.content) || '내용 없음'}
                </p>
                <div className="flex gap-2">
                  {isRecentlyDeleted ? (
                    <>
                      <button
                        onClick={(e) => handleRestoreNote(e, note.id)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all text-sm font-medium shadow-lg transform hover:scale-105"
                      >
                        ↻ 복원
                      </button>
                      <button
                        onClick={(e) => handleDeleteNote(e, note.id)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all text-sm font-medium shadow-lg transform hover:scale-105"
                      >
                        🗑️ 영구 삭제
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => handleDeleteNote(e, note.id)}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all text-sm transform hover:scale-105"
                    >
                      🗑️ 삭제
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
