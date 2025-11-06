'use client';

import React from 'react';
import { useApp } from '@/app/providers';
import { SortOption } from '@/types';

interface NoteListProps {
  folderId: string;
  onNoteSelect: (noteId: string) => void;
  onBack: () => void;
}

const NoteList: React.FC<NoteListProps> = ({ folderId, onNoteSelect, onBack }) => {
  const {
    folders,
    notes,
    createNote,
    deleteNote,
  } = useApp();

  const folder = folders.find((f) => f.id === folderId);
  const folderNotes = notes.filter((n) => n.folderId === folderId);
  const isRecentlyDeleted = folder?.name === '최근 삭제된 항목';

  const handleNewNote = async () => {
    if (isRecentlyDeleted) return;
    try {
      const newNote = await createNote(folderId);
      onNoteSelect(newNote.id);
    } catch (error) {
      console.error('메모 생성 실패:', error);
      alert('메모 생성에 실패했습니다.');
    }
  };

  const handleNoteClick = (noteId: string) => {
    onNoteSelect(noteId);
  };

  const handleDeleteNote = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (isRecentlyDeleted) {
      if (window.confirm('이 메모를 영구적으로 삭제하시겠습니까?')) {
        try {
          await deleteNote(noteId);
        } catch (error) {
          console.error('메모 삭제 실패:', error);
          alert('메모 삭제에 실패했습니다.');
        }
      }
    } else {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error('메모 삭제 실패:', error);
        alert('메모 삭제에 실패했습니다.');
      }
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 glass-effect hover:shadow-pastel rounded-xl transition-all transform hover:scale-105"
          >
            <span>←</span>
            뒤로
          </button>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <span>{isRecentlyDeleted ? '🗑️' : '📂'}</span>
            {folder?.name || '메모'}
          </h2>
          <div className="w-20"></div>
        </div>

        {/* 새 메모 버튼 */}
        {!isRecentlyDeleted && (
          <button
            onClick={handleNewNote}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-pastel hover:shadow-pastel-hover transform hover:scale-105 text-lg font-semibold"
          >
            <span className="text-2xl">✨</span>
            새 메모 만들기
          </button>
        )}
      </div>

      {/* 메모 리스트 */}
      {folderNotes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-4">📝</div>
          <p className="text-xl text-gray-500">메모가 없습니다</p>
          {!isRecentlyDeleted && (
            <p className="text-gray-400 mt-2">위 버튼을 눌러 새 메모를 만들어보세요</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {folderNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleNoteClick(note.id)}
              className="glass-effect rounded-2xl shadow-pastel hover:shadow-pastel-hover transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-pink-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 flex-1 group-hover:text-pink-600 transition-colors line-clamp-1">
                    {extractTitle(note.content)}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteNote(e, note.id)}
                    className="ml-4 p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <span className="text-red-500 text-xl">
                      {isRecentlyDeleted ? '🗑️' : '❌'}
                    </span>
                  </button>
                </div>
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
      )}
    </div>
  );
};

export default NoteList;
