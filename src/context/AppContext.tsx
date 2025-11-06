import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, Folder, SortOption, SPECIAL_FOLDER_IDS } from '../types';
import {
  loadNotes,
  loadFolders,
  generateId,
} from '../utils/storage';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

interface AppContextType {
  notes: Note[];
  folders: Folder[];
  sortOption: SortOption;
  loading: boolean;
  setSortOption: (option: SortOption) => void;
  createNote: (folderId: string) => Note;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  restoreNote: (id: string, targetFolderId: string) => void;
  createFolder: (name: string, parentId: string | null) => void;
  deleteFolder: (id: string) => void;
  getNotesInFolder: (folderId: string) => Note[];
  searchNotes: (query: string) => Note[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('modifiedAt');
  const [loading, setLoading] = useState(true);

  // 사용자 로그인 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) {
        // 로그아웃 시 모든 데이터 초기화
        setNotes([]);
        setFolders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      // 사용자 전환 시 이전 데이터 즉시 초기화
      setNotes([]);
      setFolders([]);
      
      try {
        console.log(`📚 사용자 ${currentUser.email}의 데이터 로드 중...`);
        const [loadedNotes, loadedFolders] = await Promise.all([
          loadNotes(),
          loadFolders(),
        ]);
        console.log(`✅ 메모 ${loadedNotes.length}개, 폴더 ${loadedFolders.length}개 로드됨`);
        setNotes(loadedNotes);
        setFolders(loadedFolders);
      } catch (error) {
        console.error('❌ 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // 새 메모 생성
  const createNote = (folderId: string): Note => {
    if (!currentUser) throw new Error('로그인이 필요합니다');
    
    const tempId = `temp-${Date.now()}`;
    const newNote: Note = {
      id: tempId,
      folderId,
      content: '',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    
    console.log(`📝 새 메모 생성 (사용자: ${currentUser.email}, 폴더: ${folderId})`);
    setNotes((prev) => [newNote, ...prev]);
    
    // API로 메모 생성
    api.notes.create(folderId, '').then(({ note }) => {
      setNotes((prev) => prev.map(n => n.id === tempId ? {
        ...note,
        createdAt: new Date(note.createdAt).getTime(),
        modifiedAt: new Date(note.modifiedAt).getTime(),
      } : n));
    }).catch(console.error);
    
    return newNote;
  };

  // 메모 업데이트
  const updateNote = (id: string, content: string) => {
    if (!currentUser) return;
    
    // 임시 ID는 업데이트하지 않음
    if (id.startsWith('temp-')) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, content, modifiedAt: Date.now() } : note
        )
      );
      return;
    }
    
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, content, modifiedAt: Date.now() } : note
      )
    );
    
    api.notes.update(id, content).catch(console.error);
  };

  // 메모 삭제 (휴지통으로 이동)
  const deleteNote = (id: string) => {
    if (!currentUser) return;
    
    const recentlyDeleted = folders.find(f => f.name === '최근 삭제된 항목');
    if (!recentlyDeleted) return;
    
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, folderId: recentlyDeleted.id, modifiedAt: Date.now() } : note
      )
    );
    
    api.notes.move(id, recentlyDeleted.id).catch(console.error);
  };

  // 메모 영구 삭제
  const permanentlyDeleteNote = (id: string) => {
    if (!currentUser) return;
    
    setNotes((prev) => prev.filter((note) => note.id !== id));
    api.notes.delete(id).catch(console.error);
  };

  // 메모 복원
  const restoreNote = (id: string, targetFolderId: string) => {
    if (!currentUser) return;
    
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, folderId: targetFolderId, modifiedAt: Date.now() } : note
      )
    );
    
    api.notes.move(id, targetFolderId).catch(console.error);
  };

  // 폴더 생성
  const createFolder = (name: string, parentId: string | null) => {
    if (!currentUser) return;
    
    const tempId = `temp-${Date.now()}`;
    const newFolder: Folder = {
      id: tempId,
      name,
      parentId,
    };
    
    setFolders((prev) => [...prev, newFolder]);
    
    api.folders.create(name, parentId).then(({ folder }) => {
      setFolders((prev) => prev.map(f => f.id === tempId ? folder : f));
    }).catch(console.error);
  };

  // 폴더 삭제
  const deleteFolder = (id: string) => {
    if (!currentUser) return;
    
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
    api.folders.delete(id).then(() => {
      // 서버에서 메모들을 휴지통으로 이동했으므로 다시 로드
      loadNotes().then(setNotes).catch(console.error);
    }).catch(console.error);
  };

  // 특정 폴더의 메모 가져오기
  const getNotesInFolder = (folderId: string): Note[] => {
    let filteredNotes: Note[];

    const folder = folders.find(f => f.id === folderId);
    const recentlyDeletedFolder = folders.find(f => f.name === '최근 삭제된 항목');
    
    if (folder?.name === '모든 메모') {
      // 모든 메모 (휴지통 제외)
      filteredNotes = notes.filter(
        (note) => note.folderId !== recentlyDeletedFolder?.id
      );
    } else if (folder?.name === '최근 삭제된 항목') {
      // 휴지통
      filteredNotes = notes.filter(
        (note) => note.folderId === folderId
      );
    } else {
      // 특정 폴더
      filteredNotes = notes.filter((note) => note.folderId === folderId);
    }

    // 정렬
    return [...filteredNotes].sort((a, b) => {
      switch (sortOption) {
        case 'modifiedAt':
          return b.modifiedAt - a.modifiedAt;
        case 'createdAt':
          return b.createdAt - a.createdAt;
        case 'title':
          const titleA = a.content.replace(/<[^>]*>/g, '').split('\n')[0].toLowerCase();
          const titleB = b.content.replace(/<[^>]*>/g, '').split('\n')[0].toLowerCase();
          return titleA.localeCompare(titleB);
        default:
          return b.modifiedAt - a.modifiedAt;
      }
    });
  };

  // 메모 검색
  const searchNotes = (query: string): Note[] => {
    if (!query.trim()) return [];

    const recentlyDeletedFolder = folders.find(f => f.name === '최근 삭제된 항목');
    const lowercaseQuery = query.toLowerCase();
    
    return notes
      .filter((note) => {
        const content = note.content.replace(/<[^>]*>/g, '').toLowerCase();
        return content.includes(lowercaseQuery);
      })
      .filter((note) => note.folderId !== recentlyDeletedFolder?.id)
      .sort((a, b) => b.modifiedAt - a.modifiedAt);
  };

  const value: AppContextType = {
    notes,
    folders,
    sortOption,
    loading,
    setSortOption,
    createNote,
    updateNote,
    deleteNote,
    permanentlyDeleteNote,
    restoreNote,
    createFolder,
    deleteFolder,
    getNotesInFolder,
    searchNotes,
  };

  return (
    <AppContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">📝</div>
            <p className="text-xl text-gray-600">로딩 중...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};

