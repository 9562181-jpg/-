import { Note, Folder } from '../types';
import { api } from '../api/client';

// UUID 생성 (클라이언트에서는 사용 안함, 서버에서 생성)
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
export const formatDate = (timestamp: number | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = Date.now();
  const diff = now - date.getTime();
  
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
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }
};

// 기본 특수 폴더 ID (서버에서 생성됨)
export const getDefaultFolders = (): Folder[] => {
  // 실제로는 서버에서 관리되므로 빈 배열 반환
  return [];
};

// API를 통한 메모 로드
export const loadNotes = async (): Promise<Note[]> => {
  try {
    const { notes } = await api.notes.getAll();
    return notes.map(note => ({
      ...note,
      createdAt: new Date(note.createdAt).getTime(),
      modifiedAt: new Date(note.modifiedAt).getTime(),
    }));
  } catch (error) {
    console.error('메모 로드 실패:', error);
    return [];
  }
};

// API를 통한 메모 저장
export const saveNote = async (note: Note): Promise<void> => {
  try {
    if (note.id.startsWith('temp-')) {
      // 새 메모인 경우 생성
      await api.notes.create(note.folderId, note.content);
    } else {
      // 기존 메모인 경우 업데이트
      await api.notes.update(note.id, note.content);
    }
  } catch (error) {
    console.error('메모 저장 실패:', error);
    throw error;
  }
};

// API를 통한 메모 삭제
export const deleteNoteFromDB = async (noteId: string): Promise<void> => {
  try {
    await api.notes.delete(noteId);
  } catch (error) {
    console.error('메모 삭제 실패:', error);
    throw error;
  }
};

// API를 통한 폴더 로드
export const loadFolders = async (): Promise<Folder[]> => {
  try {
    const { folders } = await api.folders.getAll();
    return folders;
  } catch (error) {
    console.error('폴더 로드 실패:', error);
    return [];
  }
};

// API를 통한 폴더 저장
export const saveFolder = async (folder: Folder): Promise<void> => {
  try {
    if (folder.id.startsWith('temp-')) {
      // 새 폴더인 경우 생성
      await api.folders.create(folder.name, folder.parentId);
    } else {
      // 기존 폴더인 경우 업데이트
      await api.folders.update(folder.id, folder.name);
    }
  } catch (error) {
    console.error('폴더 저장 실패:', error);
    throw error;
  }
};

// API를 통한 폴더 삭제
export const deleteFolderFromDB = async (folderId: string): Promise<void> => {
  try {
    await api.folders.delete(folderId);
  } catch (error) {
    console.error('폴더 삭제 실패:', error);
    throw error;
  }
};
