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

    // 초기 내용 로드
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = note.content || '';
    }
  }, [note, navigate]);

  // 자동 저장 함수
  const handleContentChange = () => {
    if (!editorRef.current || !noteId) return;

    // 이전 타이머 취소
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 300ms 후에 저장 (디바운싱)
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
    
    // 에디터에 포커스
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
    
    // 항상 에디터 끝에 추가 (아래로 일렬로 정렬)
    editorRef.current.appendChild(checkbox);
    
    // 체크박스 텍스트 영역에 포커스
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

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      
      // 체크리스트 항목 안에 있는지 확인
      let checkboxItem = container.parentElement;
      while (checkboxItem && !checkboxItem.classList?.contains('checkbox-item')) {
        checkboxItem = checkboxItem.parentElement;
      }
      
      if (checkboxItem && checkboxItem.classList.contains('checkbox-item')) {
        e.preventDefault();
        
        const textSpan = checkboxItem.querySelector('.checkbox-text');
        const isEmpty = !textSpan?.textContent?.trim();
        
        if (isEmpty) {
          // 빈 체크리스트에서 엔터: 체크리스트 모드 종료
          const normalDiv = document.createElement('div');
          normalDiv.innerHTML = '<br>';
          checkboxItem.parentNode?.insertBefore(normalDiv, checkboxItem.nextSibling);
          checkboxItem.remove();
          
          // 새 줄에 포커스
          const newRange = document.createRange();
          newRange.setStart(normalDiv, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          // 내용이 있으면 새 체크리스트 생성
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
          
          // 새 체크박스에 포커스
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

  // 이미지 추가
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
    <div className="min-h-screen bg-gray-50">
      {/* 상단 툴바 */}
      <div className="sticky top-0 bg-white shadow-md z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>✓</span>
              완료
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => applyFormat('bold')}
                className={`p-2.5 rounded-lg border transition-all ${
                  isBold
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="굵게"
              >
                <span className="font-bold">B</span>
              </button>
              <button
                onClick={() => applyFormat('italic')}
                className={`p-2.5 rounded-lg border transition-all ${
                  isItalic
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="기울임"
              >
                <span className="italic">I</span>
              </button>
              <button
                onClick={() => applyFormat('underline')}
                className="p-2.5 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-all"
                title="밑줄"
              >
                <span className="underline">U</span>
              </button>
              <button
                onClick={insertCheckbox}
                className="p-2.5 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-all"
                title="체크리스트"
              >
                ☑
              </button>
              <label className="p-2.5 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-all cursor-pointer">
                📷
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

      {/* 에디터 */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div
          ref={editorRef}
          className="min-h-[500px] bg-white rounded-xl shadow-lg p-8 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
