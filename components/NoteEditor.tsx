'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const NoteEditor: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { notes, updateNote } = useAppContext();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const note = notes.find((n) => n.id === noteId);

  useEffect(() => {
    if (!note) {
      navigate('/');
      return;
    }

    // ì´ˆê¸° ?´ìš© ë¡œë“œ
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = note.content || '';
    }
  }, [note, navigate]);

  // ?ë™ ?€???¨ìˆ˜
  const handleContentChange = () => {
    if (!editorRef.current || !noteId) return;

    // ?´ì „ ?€?´ë¨¸ ì·¨ì†Œ
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 300ms ?„ì— ?€??(?”ë°”?´ì‹±)
    saveTimeoutRef.current = setTimeout(() => {
      const content = editorRef.current!.innerHTML;
      updateNote(noteId, content);
    }, 300);
  };

  const handleBack = () => {
    if (note) {
      navigate(`/folder/${note.folderId}`);
    } else {
      navigate('/');
    }
  };

  // ?œì‹ ?ìš©
  const applyFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
    
    // ?íƒœ ?…ë°?´íŠ¸
    if (command === 'bold') setIsBold(!isBold);
    if (command === 'italic') setIsItalic(!isItalic);
  };

  // ì²´í¬ë¦¬ìŠ¤??ì¶”ê?
  const insertCheckbox = () => {
    if (!editorRef.current) return;
    
    // ?ë””?°ì— ?¬ì»¤??
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
        const span = parent.querySelector('.checkbox-text') as HTMLElement;
        if (span) {
          if (target.checked) {
            span.style.textDecoration = 'line-through';
            span.style.color = '#9ca3af';
          } else {
            span.style.textDecoration = 'none';
            span.style.color = '#1f2937';
          }
        }
      }
    });
    
    const span = document.createElement('span');
    span.contentEditable = 'true';
    span.className = 'checkbox-text flex-1 outline-none text-gray-800';
    span.textContent = '';
    
    checkbox.appendChild(checkboxInput);
    checkbox.appendChild(span);
    
    // ??ƒ ?ë””???ì— ì¶”ê? (?„ë˜ë¡??¼ë ¬ë¡??•ë ¬)
    editorRef.current.appendChild(checkbox);
    
    // ì²´í¬ë°•ìŠ¤ ?ìŠ¤???ì—­???¬ì»¤??
    const selection = window.getSelection();
    if (selection) {
      const newRange = document.createRange();
      newRange.setStart(span, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    span.focus();
    
    handleContentChange();
  };

  // ?¤ë³´???´ë²¤??ì²˜ë¦¬
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      
      // ì²´í¬ë¦¬ìŠ¤????ª© ?ˆì— ?ˆëŠ”ì§€ ?•ì¸
      let checkboxItem = container.parentElement;
      while (checkboxItem && !checkboxItem.classList?.contains('checkbox-item')) {
        checkboxItem = checkboxItem.parentElement;
      }
      
      if (checkboxItem && checkboxItem.classList.contains('checkbox-item')) {
        e.preventDefault();
        
        const textSpan = checkboxItem.querySelector('.checkbox-text');
        const isEmpty = !textSpan?.textContent?.trim();
        
        if (isEmpty) {
          // ë¹?ì²´í¬ë¦¬ìŠ¤?¸ì—???”í„°: ì²´í¬ë¦¬ìŠ¤??ëª¨ë“œ ì¢…ë£Œ
          const normalDiv = document.createElement('div');
          normalDiv.innerHTML = '<br>';
          checkboxItem.parentNode?.insertBefore(normalDiv, checkboxItem.nextSibling);
          checkboxItem.remove();
          
          // ??ì¤„ì— ?¬ì»¤??
          const newRange = document.createRange();
          newRange.setStart(normalDiv, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          // ?´ìš©???ˆìœ¼ë©???ì²´í¬ë¦¬ìŠ¤???ì„±
          const newCheckbox = document.createElement('div');
          newCheckbox.className = 'checkbox-item flex items-start gap-3 p-4 my-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-all';
          newCheckbox.setAttribute('data-checkbox', 'true');
          
          const checkboxInput = document.createElement('input');
          checkboxInput.type = 'checkbox';
          checkboxInput.className = 'mt-1 w-5 h-5 text-blue-600 rounded cursor-pointer';
          checkboxInput.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            const parent = target.parentElement;
            if (parent) {
              parent.classList.toggle('checked', target.checked);
              const span = parent.querySelector('.checkbox-text') as HTMLElement;
              if (span) {
                if (target.checked) {
                  span.style.textDecoration = 'line-through';
                  span.style.color = '#9ca3af';
                } else {
                  span.style.textDecoration = 'none';
                  span.style.color = '#1f2937';
                }
              }
            }
          });
          
          const span = document.createElement('span');
          span.contentEditable = 'true';
          span.className = 'checkbox-text flex-1 outline-none text-gray-800';
          span.textContent = '';
          
          newCheckbox.appendChild(checkboxInput);
          newCheckbox.appendChild(span);
          
          checkboxItem.parentNode?.insertBefore(newCheckbox, checkboxItem.nextSibling);
          
          // ??ì²´í¬ë°•ìŠ¤???¬ì»¤??
          const newRange = document.createRange();
          newRange.setStart(span, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
          span.focus();
        }
        
        handleContentChange();
      }
    }
  };

  // ?´ë?ì§€ ì¶”ê?
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.className = 'max-w-full rounded-lg shadow-md my-4';
      
      if (editorRef.current) {
        editorRef.current.appendChild(img);
        handleContentChange();
      }
    };
    reader.readAsDataURL(file);
  };

  if (!note) return null;

  return (
    <div className="min-h-screen">
      {/* ?ë‹¨ ?´ë°” */}
      <div className="sticky top-16 glass-effect shadow-pastel z-10 border-b border-pink-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-pastel transform hover:scale-105"
            >
              <span>??/span>
              ?„ë£Œ
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => applyFormat('bold')}
                className={`p-2.5 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  isBold
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-pink-500'
                    : 'glass-effect text-gray-700 border-pink-200 hover:border-pink-300'
                }`}
                title="êµµê²Œ"
              >
                <span className="font-bold">B</span>
              </button>
              <button
                onClick={() => applyFormat('italic')}
                className={`p-2.5 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  isItalic
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-pink-500'
                    : 'glass-effect text-gray-700 border-pink-200 hover:border-pink-300'
                }`}
                title="ê¸°ìš¸??
              >
                <span className="italic">I</span>
              </button>
              <button
                onClick={() => applyFormat('underline')}
                className="p-2.5 rounded-xl border-2 glass-effect text-gray-700 border-pink-200 hover:border-pink-300 transition-all transform hover:scale-105"
                title="ë°‘ì¤„"
              >
                <span className="underline">U</span>
              </button>
              <button
                onClick={insertCheckbox}
                className="p-2.5 rounded-xl border-2 glass-effect text-gray-700 border-pink-200 hover:border-pink-300 transition-all transform hover:scale-105"
                title="ì²´í¬ë¦¬ìŠ¤??
              >
                ??
              </button>
              <label className="p-2.5 rounded-xl border-2 glass-effect text-gray-700 border-pink-200 hover:border-pink-300 transition-all transform hover:scale-105 cursor-pointer">
                ?“·
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ?ë””??*/}
      <div className="container mx-auto px-4 py-6 max-w-4xl pt-24">
        <div
          ref={editorRef}
          className="min-h-[500px] glass-effect rounded-2xl shadow-pastel-hover p-8 outline-none focus:ring-2 focus:ring-pink-400 transition-all border border-pink-100"
          contentEditable
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning
          style={{
            fontSize: '16px',
            lineHeight: '1.8',
          }}
        />
      </div>
    </div>
  );
};

export default NoteEditor;

