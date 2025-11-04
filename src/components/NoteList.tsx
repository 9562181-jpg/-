import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { extractTitle, formatDate } from '../utils/storage';
import { SortOption, SPECIAL_FOLDER_IDS } from '../types';

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
  const isRecentlyDeleted = folderId === SPECIAL_FOLDER_IDS.RECENTLY_DELETED;

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
    restoreNote(noteId, SPECIAL_FOLDER_IDS.ALL_NOTES);
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
            <span>{isRecentlyDeleted ? '🗑️' : '📂'}</span>
            {folder?.name || '메모'}
          </h2>
          {!isRecentlyDeleted && (
            <button
              onClick={handleNewNote}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="modifiedAt">⏰ 최근 수정순</option>
            <option value="createdAt">📅 생성 날짜순</option>
            <option value="title">🔤 제목순</option>
          </select>
          <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
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
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[60px]">
                  {getPreviewText(note.content) || '내용 없음'}
                </p>
                <div className="flex gap-2">
                  {isRecentlyDeleted ? (
                    <>
                      <button
                        onClick={(e) => handleRestoreNote(e, note.id)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        ↻ 복원
                      </button>
                      <button
                        onClick={(e) => handleDeleteNote(e, note.id)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        🗑️ 영구 삭제
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => handleDeleteNote(e, note.id)}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all text-sm"
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
