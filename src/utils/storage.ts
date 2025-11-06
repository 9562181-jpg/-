import { Note, Folder, SPECIAL_FOLDER_IDS } from '../types';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

// 로컬 스토리지 키
const STORAGE_KEYS = {
  NOTES: 'memo-app-notes-',
  FOLDERS: 'memo-app-folders-',
} as const;

// === 로컬 스토리지 함수들 ===

const loadNotesFromLocal = (userId: string): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES + userId);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('로컬 메모 로드 실패:', error);
    return [];
  }
};

const saveNoteToLocal = (userId: string, note: Note): void => {
  try {
    const notes = loadNotesFromLocal(userId);
    const index = notes.findIndex(n => n.id === note.id);
    if (index >= 0) {
      notes[index] = note;
    } else {
      notes.push(note);
    }
    localStorage.setItem(STORAGE_KEYS.NOTES + userId, JSON.stringify(notes));
  } catch (error) {
    console.error('로컬 메모 저장 실패:', error);
  }
};

const deleteNoteFromLocal = (userId: string, noteId: string): void => {
  try {
    const notes = loadNotesFromLocal(userId);
    const filtered = notes.filter(n => n.id !== noteId);
    localStorage.setItem(STORAGE_KEYS.NOTES + userId, JSON.stringify(filtered));
  } catch (error) {
    console.error('로컬 메모 삭제 실패:', error);
  }
};

const loadFoldersFromLocal = (userId: string): Folder[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FOLDERS + userId);
    if (data) {
      return JSON.parse(data);
    }
    // 초기 특수 폴더 생성
    const defaultFolders = getDefaultFolders();
    localStorage.setItem(STORAGE_KEYS.FOLDERS + userId, JSON.stringify(defaultFolders));
    return defaultFolders;
  } catch (error) {
    console.error('로컬 폴더 로드 실패:', error);
    return getDefaultFolders();
  }
};

const saveFolderToLocal = (userId: string, folder: Folder): void => {
  try {
    const folders = loadFoldersFromLocal(userId);
    const index = folders.findIndex(f => f.id === folder.id);
    if (index >= 0) {
      folders[index] = folder;
    } else {
      folders.push(folder);
    }
    localStorage.setItem(STORAGE_KEYS.FOLDERS + userId, JSON.stringify(folders));
  } catch (error) {
    console.error('로컬 폴더 저장 실패:', error);
  }
};

const deleteFolderFromLocal = (userId: string, folderId: string): void => {
  try {
    const folders = loadFoldersFromLocal(userId);
    const filtered = folders.filter(f => f.id !== folderId);
    localStorage.setItem(STORAGE_KEYS.FOLDERS + userId, JSON.stringify(filtered));
  } catch (error) {
    console.error('로컬 폴더 삭제 실패:', error);
  }
};

// === 공개 API (Firebase 또는 로컬 스토리지 자동 선택) ===

// 사용자의 메모 가져오기
export const loadNotes = async (userId: string): Promise<Note[]> => {
  if (!isFirebaseConfigured() || !db) {
    return loadNotesFromLocal(userId);
  }

  try {
    const notesRef = collection(db, 'users', userId, 'notes');
    const snapshot = await getDocs(notesRef);
    return snapshot.docs.map((doc) => doc.data() as Note);
  } catch (error) {
    console.error('Firestore 메모 로드 실패, 로컬로 전환:', error);
    return loadNotesFromLocal(userId);
  }
};

// 메모 저장
export const saveNote = async (userId: string, note: Note): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    saveNoteToLocal(userId, note);
    return;
  }

  try {
    const noteRef = doc(db, 'users', userId, 'notes', note.id);
    await setDoc(noteRef, note);
  } catch (error) {
    console.error('Firestore 메모 저장 실패, 로컬로 전환:', error);
    saveNoteToLocal(userId, note);
  }
};

// 메모 삭제
export const deleteNoteFromDB = async (userId: string, noteId: string): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    deleteNoteFromLocal(userId, noteId);
    return;
  }

  try {
    const noteRef = doc(db, 'users', userId, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Firestore 메모 삭제 실패, 로컬로 전환:', error);
    deleteNoteFromLocal(userId, noteId);
  }
};

// 사용자의 폴더 가져오기
export const loadFolders = async (userId: string): Promise<Folder[]> => {
  if (!isFirebaseConfigured() || !db) {
    return loadFoldersFromLocal(userId);
  }

  try {
    const foldersRef = collection(db, 'users', userId, 'folders');
    const snapshot = await getDocs(foldersRef);
    const folders = snapshot.docs.map((doc) => doc.data() as Folder);
    
    // 폴더가 없으면 기본 폴더 생성
    if (folders.length === 0) {
      const defaultFolders = getDefaultFolders();
      for (const folder of defaultFolders) {
        await saveFolder(userId, folder);
      }
      return defaultFolders;
    }
    
    return folders;
  } catch (error) {
    console.error('Firestore 폴더 로드 실패, 로컬로 전환:', error);
    return loadFoldersFromLocal(userId);
  }
};

// 폴더 저장
export const saveFolder = async (userId: string, folder: Folder): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    saveFolderToLocal(userId, folder);
    return;
  }

  try {
    const folderRef = doc(db, 'users', userId, 'folders', folder.id);
    await setDoc(folderRef, folder);
  } catch (error) {
    console.error('Firestore 폴더 저장 실패, 로컬로 전환:', error);
    saveFolderToLocal(userId, folder);
  }
};

// 폴더 삭제
export const deleteFolderFromDB = async (userId: string, folderId: string): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    deleteFolderFromLocal(userId, folderId);
    return;
  }

  try {
    const folderRef = doc(db, 'users', userId, 'folders', folderId);
    await deleteDoc(folderRef);
  } catch (error) {
    console.error('Firestore 폴더 삭제 실패, 로컬로 전환:', error);
    deleteFolderFromLocal(userId, folderId);
  }
};

// 기본 특수 폴더 생성
export const getDefaultFolders = (): Folder[] => {
  return [
    {
      id: SPECIAL_FOLDER_IDS.ALL_NOTES,
      name: '모든 메모',
      parentId: null,
      isSpecial: true,
    },
    {
      id: SPECIAL_FOLDER_IDS.RECENTLY_DELETED,
      name: '최근 삭제된 항목',
      parentId: null,
      isSpecial: true,
    },
  ];
};

// UUID 생성
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 메모 제목 추출 (첫 번째 줄)
export const extractTitle = (content: string): string => {
  // HTML 태그 제거
  const text = content.replace(/<[^>]*>/g, '');
  const firstLine = text.split('\n')[0].trim();
  return firstLine || '제목 없음';
};

// 날짜 포맷팅
export const formatDate = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  
  if (diff < minute) {
    return '방금 전';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}분 전`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`;
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}일 전`;
  } else {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }
};

