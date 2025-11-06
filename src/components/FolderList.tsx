import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Folder, SPECIAL_FOLDER_IDS } from '../types';
import { extractTitle, formatDate } from '../utils/storage';
import Carousel from './Carousel';

const FolderList: React.FC = () => {
  const navigate = useNavigate();
  const { folders, notes, createFolder, deleteFolder } = useAppContext();
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleFolderClick = (folderId: string) => {
    navigate(`/folder/${folderId}`);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), null);
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleDeleteFolder = (e: React.MouseEvent, folder: Folder) => {
    e.stopPropagation();
    if (folder.isSpecial) return;
    
    if (window.confirm(`'${folder.name}' 폴더와 그 안의 모든 메모가 휴지통으로 이동됩니다. 계속하시겠습니까?`)) {
      deleteFolder(folder.id);
    }
  };

  // 최근 메모 5개 가져오기 (휴지통 제외)
  const recentNotes = notes
    .filter((note) => note.folderId !== SPECIAL_FOLDER_IDS.RECENTLY_DELETED)
    .sort((a, b) => b.modifiedAt - a.modifiedAt)
    .slice(0, 5)
    .map((note) => ({
      id: note.id,
      title: extractTitle(note.content),
      preview: note.content.replace(/<[^>]*>/g, '').split('\n').slice(1, 3).join(' ').substring(0, 150) || '내용 없음',
      date: formatDate(note.modifiedAt),
      onClick: () => navigate(`/note/${note.id}`),
    }));

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 animate-fade-in">
          <span className="animate-float">📝</span>
          메모 앱
        </h1>
        <button
          onClick={() => setShowNewFolderInput(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-pastel hover:shadow-pastel-hover transform hover:-translate-y-1 hover:scale-105"
        >
          <span className="text-xl">📁</span>
          새 폴더
        </button>
      </div>

      {/* 최근 메모 캐러셀 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <span>⏰</span>
            최근 메모
          </h2>
          {recentNotes.length > 0 && (
            <span className="text-sm text-pink-500 font-medium animate-pulse">
              자동으로 넘어갑니다
            </span>
          )}
        </div>
        <Carousel items={recentNotes} autoPlay={true} interval={4000} />
      </div>

      {/* 폴더 섹션 */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <span>📂</span>
          폴더
        </h2>
      </div>

      {/* 폴더 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => handleFolderClick(folder.id)}
            className="group glass-effect rounded-2xl shadow-pastel hover:shadow-pastel-hover transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-pink-100 overflow-hidden"
          >
            <div className="p-6 flex items-center gap-4">
              <div className="text-5xl flex-shrink-0 transition-transform group-hover:scale-110">
                {folder.isSpecial ? '⭐' : '📁'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
                  {folder.name}
                </h3>
              </div>
              {!folder.isSpecial && (
                <button
                  onClick={(e) => handleDeleteFolder(e, folder)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                >
                  <span className="text-red-500 text-xl">🗑️</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {showNewFolderInput && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-effect rounded-3xl shadow-pastel-hover w-full max-w-md transform transition-all animate-slide-up">
            <div className="p-6 border-b border-pink-100">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <span>📁</span>
                새 폴더 만들기
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                폴더 이름
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="폴더 이름을 입력하세요"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder();
                  }
                }}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all bg-white"
              />
            </div>
            <div className="p-6 border-t border-pink-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowNewFolderInput(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium transform hover:scale-105"
              >
                취소
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all font-medium shadow-pastel transform hover:scale-105"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderList;
