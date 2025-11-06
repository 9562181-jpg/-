# 🎯 Supabase 데이터베이스 설정 방법

## ⚡ 빠른 설정 (5분 완료)

### 1️⃣ Supabase SQL Editor 접속

1. 브라우저에서 접속: https://jdiqtblpbzukxcdqfmdd.supabase.co
2. 로그인 (비밀번호: `@ab131001`)
3. 왼쪽 메뉴에서 **🔧 SQL Editor** 클릭

### 2️⃣ 데이터베이스 테이블 생성

1. SQL Editor에서 **New Query** 클릭
2. 아래 SQL 스크립트를 **전체 복사**하여 붙여넣기:

```sql
-- ===================================
-- 메모 앱 데이터베이스 스키마
-- ===================================

-- 1. Users 테이블
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Folders 테이블
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

-- 3. Notes 테이블
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

-- 5. 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."modifiedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users 트리거
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Folders 트리거
DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
CREATE TRIGGER update_folders_updated_at
    BEFORE UPDATE ON folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Notes 트리거
DROP TRIGGER IF EXISTS update_notes_modified_at ON notes;
CREATE TRIGGER update_notes_modified_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();

-- 완료!
SELECT '✅ 데이터베이스 마이그레이션 완료!' as status;
```

3. **Run** 버튼 클릭 (또는 Ctrl+Enter)
4. 성공 메시지 확인: `✅ 데이터베이스 마이그레이션 완료!`

### 3️⃣ 테이블 확인

SQL Editor에서 실행:

```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'folders', 'notes');
```

**예상 결과:**
```
users
folders
notes
```

### 4️⃣ Prisma Client 재생성

로컬 터미널에서:

```bash
cd server
npx prisma generate
```

### 5️⃣ 앱 실행

프로젝트 루트에서:

```bash
npm run start:all
```

또는:

```bash
start_all.bat
```

## ✅ 완료!

이제 다음을 확인하세요:

1. 백엔드 서버: http://localhost:5000/api/health
2. 프론트엔드: http://localhost:3000
3. 회원가입 → 메모 작성 → Supabase에 저장됨!

## 🔍 Supabase에서 데이터 확인

### Table Editor 사용

1. Supabase Dashboard → **Table Editor** 클릭
2. `users`, `folders`, `notes` 테이블 확인
3. 실시간으로 데이터 확인 가능!

### SQL Editor 사용

```sql
-- 모든 사용자 보기
SELECT * FROM users;

-- 모든 폴더 보기
SELECT * FROM folders;

-- 모든 메모 보기
SELECT * FROM notes;

-- 사용자별 메모 개수
SELECT u.email, u."displayName", COUNT(n.id) as memo_count
FROM users u
LEFT JOIN notes n ON u.id = n."userId"
GROUP BY u.id, u.email, u."displayName";
```

## 🎉 성공 확인

앱에서 다음을 테스트하세요:

1. ✅ 회원가입 → Supabase `users` 테이블에 저장
2. ✅ 로그인 → JWT 토큰 발급
3. ✅ 폴더 생성 → Supabase `folders` 테이블에 저장
4. ✅ 메모 작성 → Supabase `notes` 테이블에 저장
5. ✅ Supabase Table Editor에서 실시간 확인!

## 🔒 보안 설정 (선택사항)

Supabase의 Row Level Security (RLS)를 활성화하면 더 안전합니다:

```sql
-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (각 사용자는 자신의 데이터만 접근)
CREATE POLICY "Users can only access their own data"
ON folders FOR ALL
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can only access their own notes"
ON notes FOR ALL
USING (auth.uid()::text = "userId");
```

**참고:** 현재는 JWT 미들웨어로 보호되므로 선택사항입니다.

---

문제가 있으시면 `SUPABASE_MIGRATION_GUIDE.md` 파일도 참고하세요!

