-- Supabase PostgreSQL 마이그레이션 스크립트
-- Prisma 스키마를 Supabase에 수동으로 적용하기 위한 SQL

-- 1. Users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Folders 테이블 생성
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    "parentId" TEXT,
    "isSpecial" BOOLEAN DEFAULT false NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT folders_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Notes 테이블 생성
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT DEFAULT '' NOT NULL,
    "folderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "modifiedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT notes_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT notes_folderId_fkey FOREIGN KEY ("folderId") REFERENCES folders(id) ON DELETE CASCADE
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS folders_userId_idx ON folders("userId");
CREATE INDEX IF NOT EXISTS notes_userId_idx ON notes("userId");
CREATE INDEX IF NOT EXISTS notes_folderId_idx ON notes("folderId");

-- 5. updatedAt 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Users 테이블 트리거
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Folders 테이블 트리거
DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
CREATE TRIGGER update_folders_updated_at
    BEFORE UPDATE ON folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Notes 테이블 트리거 (modifiedAt)
CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."modifiedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_notes_modified_at ON notes;
CREATE TRIGGER update_notes_modified_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ 마이그레이션 완료! 테이블: users, folders, notes';
END $$;

