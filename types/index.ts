// 사용자 타입
export interface User {
  id: string;
  email: string;
  displayName: string;
}

// 메모 타입
export interface Note {
  id: string;
  folderId: string;
  userId: string;
  content: string;
  createdAt: Date | string;
  modifiedAt: Date | string;
}

// 폴더 타입
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  isSpecial?: boolean;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// 정렬 옵션
export type SortOption = 'modifiedAt' | 'createdAt' | 'title';

// 특수 폴더 ID 상수
export const SPECIAL_FOLDER_IDS = {
  ALL_NOTES: 'all-notes',
  RECENTLY_DELETED: 'recently-deleted',
} as const;

// API 응답 타입
export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

