// 메모 타입
export interface Note {
  id: string;
  folderId: string;
  content: string; // 리치 텍스트를 HTML로 저장
  createdAt: number; // timestamp
  modifiedAt: number; // timestamp
}

// 폴더 타입
export interface Folder {
  id: string;
  name: string;
  parentId: string | null; // 최상위 폴더는 null
  isSpecial?: boolean; // 특수 폴더 여부 (모든 메모, 최근 삭제된 항목)
}

// 정렬 옵션
export type SortOption = 'modifiedAt' | 'createdAt' | 'title';

// 특수 폴더 ID 상수
export const SPECIAL_FOLDER_IDS = {
  ALL_NOTES: 'all-notes',
  RECENTLY_DELETED: 'recently-deleted',
} as const;

