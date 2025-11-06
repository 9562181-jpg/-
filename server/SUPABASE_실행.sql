-- ========================================
-- 메모 앱 Supabase 마이그레이션
-- ========================================
-- 이 SQL을 Supabase SQL Editor에 복사해서 실행하세요!

-- 1단계: 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2단계: Users 테이블 생성
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3단계: Folders 테이블 생성
CREATE TABLE folders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    "parentId" TEXT,
    "isSpecial" BOOLEAN DEFAULT false NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- 4단계: Notes 테이블 생성
CREATE TABLE notes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    content TEXT DEFAULT '' NOT NULL,
    "folderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "modifiedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY ("folderId") REFERENCES folders(id) ON DELETE CASCADE
);

-- 5단계: 인덱스 생성
CREATE INDEX folders_userId_idx ON folders("userId");
CREATE INDEX notes_userId_idx ON notes("userId");
CREATE INDEX notes_folderId_idx ON notes("folderId");

-- 6단계: 자동 업데이트 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."modifiedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7단계: 트리거 생성
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER folders_updated_at
    BEFORE UPDATE ON folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER notes_modified_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at();

-- ========================================
-- 완료! 아래 쿼리로 확인하세요
-- ========================================

SELECT 
    '✅ 마이그레이션 완료!' as message,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users') as users_table,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'folders') as folders_table,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'notes') as notes_table;

