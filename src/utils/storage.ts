import { Note, Folder, SPECIAL_FOLDER_IDS } from '../types';

const STORAGE_KEYS = {
  NOTES: 'memo-app-notes',
  FOLDERS: 'memo-app-folders',
} as const;

// 로컬 스토리지에서 메모 가져오기
export const loadNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('메모 로드 실패:', error);
    return [];
  }
};

// 로컬 스토리지에 메모 저장
export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (error) {
    console.error('메모 저장 실패:', error);
  }
};

// 로컬 스토리지에서 폴더 가져오기
export const loadFolders = (): Folder[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (data) {
      return JSON.parse(data);
    }
    // 초기 특수 폴더 생성
    return getDefaultFolders();
  } catch (error) {
    console.error('폴더 로드 실패:', error);
    return getDefaultFolders();
  }
};

// 로컬 스토리지에 폴더 저장
export const saveFolders = (folders: Folder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  } catch (error) {
    console.error('폴더 저장 실패:', error);
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

