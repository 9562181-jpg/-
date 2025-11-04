import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, Folder, SortOption, SPECIAL_FOLDER_IDS } from '../types';
import {
  loadNotes,
  saveNotes,
  loadFolders,
  saveFolders,
  generateId,
} from '../utils/storage';

interface AppContextType {
  notes: Note[];
  folders: Folder[];
  sortOption: SortOption;
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('modifiedAt');

  // 초기 로드
  useEffect(() => {
    const loadedNotes = loadNotes();
    const loadedFolders = loadFolders();
    setNotes(loadedNotes);
    setFolders(loadedFolders);
  }, []);

  // 메모 변경 시 저장
  useEffect(() => {
    if (notes.length >= 0) {
      saveNotes(notes);
    }
  }, [notes]);

  // 폴더 변경 시 저장
  useEffect(() => {
    if (folders.length > 0) {
      saveFolders(folders);
    }
  }, [folders]);

  // 새 메모 생성
  const createNote = (folderId: string): Note => {
    const newNote: Note = {
      id: generateId(),
      folderId,
      content: '',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  // 메모 업데이트
  const updateNote = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, content, modifiedAt: Date.now() }
          : note
      )
    );
  };

  // 메모 삭제 (휴지통으로 이동)
  const deleteNote = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, folderId: SPECIAL_FOLDER_IDS.RECENTLY_DELETED, modifiedAt: Date.now() }
          : note
      )
    );
  };

  // 메모 영구 삭제
  const permanentlyDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  // 메모 복원
  const restoreNote = (id: string, targetFolderId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, folderId: targetFolderId, modifiedAt: Date.now() }
          : note
      )
    );
  };

  // 폴더 생성
  const createFolder = (name: string, parentId: string | null) => {
    const newFolder: Folder = {
      id: generateId(),
      name,
      parentId,
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  // 폴더 삭제
  const deleteFolder = (id: string) => {
    // 폴더 내 모든 메모를 휴지통으로 이동
    setNotes((prev) =>
      prev.map((note) =>
        note.folderId === id
          ? { ...note, folderId: SPECIAL_FOLDER_IDS.RECENTLY_DELETED }
          : note
      )
    );
    // 폴더 삭제
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

