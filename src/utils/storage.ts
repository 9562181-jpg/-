import { Note, Folder, SPECIAL_FOLDER_IDS } from '../types';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Firestore에서 사용자의 메모 가져오기
export const loadNotes = async (userId: string): Promise<Note[]> => {
  try {
    const notesRef = collection(db, 'users', userId, 'notes');
    const snapshot = await getDocs(notesRef);
    return snapshot.docs.map((doc) => doc.data() as Note);
  } catch (error) {
    console.error('메모 로드 실패:', error);
    return [];
  }
};

// Firestore에 메모 저장
export const saveNote = async (userId: string, note: Note): Promise<void> => {
  try {
    const noteRef = doc(db, 'users', userId, 'notes', note.id);
    await setDoc(noteRef, note);
  } catch (error) {
    console.error('메모 저장 실패:', error);
    throw error;
  }
};

// Firestore에서 메모 삭제
export const deleteNoteFromDB = async (userId: string, noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, 'users', userId, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('메모 삭제 실패:', error);
    throw error;
  }
};

// Firestore에서 사용자의 폴더 가져오기
export const loadFolders = async (userId: string): Promise<Folder[]> => {
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
    console.error('폴더 로드 실패:', error);
    return getDefaultFolders();
  }
};

// Firestore에 폴더 저장
export const saveFolder = async (userId: string, folder: Folder): Promise<void> => {
  try {
    const folderRef = doc(db, 'users', userId, 'folders', folder.id);
    await setDoc(folderRef, folder);
  } catch (error) {
    console.error('폴더 저장 실패:', error);
    throw error;
  }
};

// Firestore에서 폴더 삭제
export const deleteFolderFromDB = async (userId: string, folderId: string): Promise<void> => {
  try {
    const folderRef = doc(db, 'users', userId, 'folders', folderId);
    await deleteDoc(folderRef);
  } catch (error) {
    console.error('폴더 삭제 실패:', error);
    throw error;
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

