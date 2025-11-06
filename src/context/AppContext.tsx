import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, Folder, SortOption, SPECIAL_FOLDER_IDS } from '../types';
import {
  loadNotes,
  saveNote,
  deleteNoteFromDB,
  loadFolders,
  saveFolder,
  deleteFolderFromDB,
  generateId,
} from '../utils/storage';
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
        setNotes([]);
        setFolders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [loadedNotes, loadedFolders] = await Promise.all([
          loadNotes(currentUser.uid),
          loadFolders(currentUser.uid),
        ]);
        setNotes(loadedNotes);
        setFolders(loadedFolders);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // 새 메모 생성
  const createNote = (folderId: string): Note => {
    if (!currentUser) throw new Error('로그인이 필요합니다');
    
    const newNote: Note = {
      id: generateId(),
      folderId,
      content: '',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    
    setNotes((prev) => [newNote, ...prev]);
    saveNote(currentUser.uid, newNote).catch(console.error);
    return newNote;
  };

  // 메모 업데이트
  const updateNote = (id: string, content: string) => {
    if (!currentUser) return;
    
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === id) {
          const updatedNote = { ...note, content, modifiedAt: Date.now() };
          saveNote(currentUser.uid, updatedNote).catch(console.error);
          return updatedNote;
        }
        return note;
      })
    );
  };

  // 메모 삭제 (휴지통으로 이동)
  const deleteNote = (id: string) => {
    if (!currentUser) return;
    
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === id) {
          const updatedNote = {
            ...note,
            folderId: SPECIAL_FOLDER_IDS.RECENTLY_DELETED,
            modifiedAt: Date.now(),
          };
          saveNote(currentUser.uid, updatedNote).catch(console.error);
          return updatedNote;
        }
        return note;
      })
    );
  };

  // 메모 영구 삭제
  const permanentlyDeleteNote = (id: string) => {
    if (!currentUser) return;
    
    setNotes((prev) => prev.filter((note) => note.id !== id));
    deleteNoteFromDB(currentUser.uid, id).catch(console.error);
  };

  // 메모 복원
  const restoreNote = (id: string, targetFolderId: string) => {
    if (!currentUser) return;
    
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === id) {
          const updatedNote = {
            ...note,
            folderId: targetFolderId,
            modifiedAt: Date.now(),
          };
          saveNote(currentUser.uid, updatedNote).catch(console.error);
          return updatedNote;
        }
        return note;
      })
    );
  };

  // 폴더 생성
  const createFolder = (name: string, parentId: string | null) => {
    if (!currentUser) return;
    
    const newFolder: Folder = {
      id: generateId(),
      name,
      parentId,
    };
    
    setFolders((prev) => [...prev, newFolder]);
    saveFolder(currentUser.uid, newFolder).catch(console.error);
  };

  // 폴더 삭제
  const deleteFolder = (id: string) => {
    if (!currentUser) return;
    
    // 폴더 내 모든 메모를 휴지통으로 이동
    setNotes((prev) =>
      prev.map((note) => {
        if (note.folderId === id) {
          const updatedNote = {
            ...note,
            folderId: SPECIAL_FOLDER_IDS.RECENTLY_DELETED,
          };
          saveNote(currentUser.uid, updatedNote).catch(console.error);
          return updatedNote;
        }
        return note;
      })
    );
    
    // 폴더 삭제
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
    deleteFolderFromDB(currentUser.uid, id).catch(console.error);
  };

  // 특정 폴더의 메모 가져오기
  const getNotesInFolder = (folderId: string): Note[] => {
    let filteredNotes: Note[];

    if (folderId === SPECIAL_FOLDER_IDS.ALL_NOTES) {
      // 모든 메모 (휴지통 제외)
      filteredNotes = notes.filter(
        (note) => note.folderId !== SPECIAL_FOLDER_IDS.RECENTLY_DELETED
      );
    } else if (folderId === SPECIAL_FOLDER_IDS.RECENTLY_DELETED) {
      // 휴지통
      filteredNotes = notes.filter(
        (note) => note.folderId === SPECIAL_FOLDER_IDS.RECENTLY_DELETED
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

    const lowercaseQuery = query.toLowerCase();
    return notes
      .filter((note) => {
        const content = note.content.replace(/<[^>]*>/g, '').toLowerCase();
        return content.includes(lowercaseQuery);
      })
      .filter((note) => note.folderId !== SPECIAL_FOLDER_IDS.RECENTLY_DELETED)
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

