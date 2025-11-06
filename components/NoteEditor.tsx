'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/app/providers';

interface NoteEditorProps {
  noteId: string;
  onBack: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId, onBack }) => {
  const { notes, updateNote } = useApp();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const note = notes.find((n) => n.id === noteId);

  useEffect(() => {
    if (!note) {
      onBack();
      return;
    }

    // 초기 내용 로드
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = note.content || '';
    }
  }, [note, onBack]);

  // 자동 저장 함수
  const handleContentChange = () => {
    if (!editorRef.current || !noteId) return;

    // 이전 타이머 취소
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 300ms 후에 저장 (디바운싱)
    saveTimeoutRef.current = setTimeout(async () => {
      const content = editorRef.current!.innerHTML;
      try {
        await updateNote(noteId, content);
      } catch (error) {
        console.error('메모 저장 실패:', error);
      }
    }, 300);
  };

  // 서식 적용
  const applyFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
    
    // 상태 업데이트
    if (command === 'bold') setIsBold(!isBold);
    if (command === 'italic') setIsItalic(!isItalic);
  };

  // 체크리스트 추가
  const insertCheckbox = () => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox-item flex items-start gap-3 p-4 my-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-all';
    checkbox.setAttribute('data-checkbox', 'true');
    
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.className = 'mt-1 w-5 h-5 text-blue-600 rounded cursor-pointer';
    checkboxInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const parent = target.parentElement;
      if (parent) {
        parent.classList.toggle('checked', target.checked);
      }
      handleContentChange();
    });
    
    const checkboxLabel = document.createElement('span');
    checkboxLabel.className = 'flex-1 text-gray-700';
    checkboxLabel.contentEditable = 'true';
    checkboxLabel.textContent = '체크리스트 항목';
    checkboxLabel.addEventListener('input', handleContentChange);
    
    checkbox.appendChild(checkboxInput);
    checkbox.appendChild(checkboxLabel);
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(checkbox);
      range.collapse(false);
    } else {
      editorRef.current.appendChild(checkbox);
    }
    
    handleContentChange();
  };

  if (!note) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 glass-effect hover:shadow-pastel rounded-xl transition-all transform hover:scale-105"
        >
          <span>←</span>
          뒤로
        </button>
        <span className="text-sm text-gray-500 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full font-semibold text-green-700">
          자동 저장됨 ✓
        </span>
      </div>

      {/* 툴바 */}
      <div className="mb-4 flex flex-wrap gap-2 p-4 glass-effect rounded-2xl shadow-pastel">
        <button
          onClick={() => applyFormat('bold')}
          className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 font-bold ${
            isBold
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-pastel'
              : 'bg-white hover:bg-pink-50 text-gray-700 border border-pink-200'
          }`}
        >
          B
        </button>
        <button
          onClick={() => applyFormat('italic')}
          className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 italic ${
            isItalic
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-pastel'
              : 'bg-white hover:bg-pink-50 text-gray-700 border border-pink-200'
          }`}
        >
          I
        </button>
        <button
          onClick={() => applyFormat('underline')}
          className="px-4 py-2 bg-white hover:bg-pink-50 text-gray-700 border border-pink-200 rounded-lg transition-all transform hover:scale-105 underline"
        >
          U
        </button>
        <div className="w-px h-8 bg-pink-200"></div>
        <button
          onClick={insertCheckbox}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-pastel flex items-center gap-2"
        >
          <span>☑️</span>
          체크리스트
        </button>
        <div className="w-px h-8 bg-pink-200"></div>
        <button
          onClick={() => applyFormat('formatBlock', '<h1>')}
          className="px-4 py-2 bg-white hover:bg-pink-50 text-gray-700 border border-pink-200 rounded-lg transition-all transform hover:scale-105"
        >
          H1
        </button>
        <button
          onClick={() => applyFormat('formatBlock', '<h2>')}
          className="px-4 py-2 bg-white hover:bg-pink-50 text-gray-700 border border-pink-200 rounded-lg transition-all transform hover:scale-105"
        >
          H2
        </button>
      </div>

      {/* 에디터 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        className="min-h-[500px] p-8 glass-effect rounded-2xl shadow-pastel focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all text-gray-800 text-lg leading-relaxed"
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
};

export default NoteEditor;
