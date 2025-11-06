'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Folder } from '../types';
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
    
    if (window.confirm(`'${folder.name}' ?´ë”?€ ê·??ˆì˜ ëª¨ë“  ë©”ëª¨ê°€ ?´ì??µìœ¼ë¡??´ë™?©ë‹ˆ?? ê³„ì†?˜ì‹œê² ìŠµ?ˆê¹Œ?`)) {
      deleteFolder(folder.id);
    }
  };

  // ìµœê·¼ ë©”ëª¨ 5ê°?ê°€?¸ì˜¤ê¸?(?´ì????œì™¸)
  const recentlyDeletedFolder = folders.find(f => f.name === 'ìµœê·¼ ?? œ????ª©');
  const recentNotes = notes
    .filter((note) => note.folderId !== recentlyDeletedFolder?.id)
    .sort((a, b) => b.modifiedAt - a.modifiedAt)
    .slice(0, 5)
    .map((note) => ({
      id: note.id,
      title: extractTitle(note.content),
      preview: note.content.replace(/<[^>]*>/g, '').split('\n').slice(1, 3).join(' ').substring(0, 150) || '?´ìš© ?†ìŒ',
      date: formatDate(note.modifiedAt),
      onClick: () => navigate(`/note/${note.id}`),
    }));

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* ?¤ë” */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 animate-fade-in">
          <span className="animate-float">?“</span>
          ë©”ëª¨ ??
        </h1>
        <button
          onClick={() => setShowNewFolderInput(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-pastel hover:shadow-pastel-hover transform hover:-translate-y-1 hover:scale-105"
        >
          <span className="text-xl">?“</span>
          ???´ë”
        </button>
      </div>

      {/* ?°ì´?°ë² ?´ìŠ¤ ?ˆë‚´ */}
      <div className="mb-6 p-4 glass-effect rounded-2xl border-2 border-green-200 shadow-pastel animate-fade-in">
        <div className="flex items-start gap-3">
          <span className="text-2xl">?’½</span>
          <div className="flex-1">
            <h3 className="font-bold text-green-800 mb-1">SQLite + Prisma ORM</h3>
            <p className="text-sm text-green-700 mb-2">
              ?ˆì „?˜ê³  ë¹ ë¥¸ ë¡œì»¬ ?°ì´?°ë² ?´ìŠ¤ë¡?ë©”ëª¨ë¥?ê´€ë¦¬í•©?ˆë‹¤. ëª¨ë“  ?°ì´?°ëŠ” ?”í˜¸?”ë˜???€?¥ë©?ˆë‹¤.
            </p>
            <p className="text-xs text-green-600">
              ?’¡ ?¬ëŸ¬ ê³„ì •??ë§Œë“¤???¬ìš©?????ˆìœ¼ë©? ê°??¬ìš©?ì˜ ?°ì´?°ëŠ” ?„ì „??ë¶„ë¦¬?©ë‹ˆ??
            </p>
          </div>
        </div>
      </div>

      {/* ìµœê·¼ ë©”ëª¨ ìºëŸ¬?€ */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <span>??/span>
            ìµœê·¼ ë©”ëª¨
          </h2>
          {recentNotes.length > 0 && (
            <span className="text-sm text-pink-500 font-medium animate-pulse">
              ?ë™?¼ë¡œ ?˜ì–´ê°‘ë‹ˆ??
            </span>
          )}
        </div>
        <Carousel items={recentNotes} autoPlay={true} interval={4000} />
      </div>

      {/* ?´ë” ?¹ì…˜ */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <span>?“‚</span>
          ?´ë”
        </h2>
      </div>

      {/* ?´ë” ê·¸ë¦¬??*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => handleFolderClick(folder.id)}
            className="group glass-effect rounded-2xl shadow-pastel hover:shadow-pastel-hover transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-pink-100 overflow-hidden"
          >
            <div className="p-6 flex items-center gap-4">
              <div className="text-5xl flex-shrink-0 transition-transform group-hover:scale-110">
                {folder.isSpecial ? 'â­? : '?“'}
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
                  <span className="text-red-500 text-xl">?—‘ï¸?/span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ëª¨ë‹¬ */}
      {showNewFolderInput && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-effect rounded-3xl shadow-pastel-hover w-full max-w-md transform transition-all animate-slide-up">
            <div className="p-6 border-b border-pink-100">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <span>?“</span>
                ???´ë” ë§Œë“¤ê¸?
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ?´ë” ?´ë¦„
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="?´ë” ?´ë¦„???…ë ¥?˜ì„¸??
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
                ì·¨ì†Œ
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all font-medium shadow-pastel transform hover:scale-105"
              >
                ?ì„±
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderList;

