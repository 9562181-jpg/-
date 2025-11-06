# 🚀 Supabase + Prisma 마이그레이션 가이드

## ✅ 현재 상태

### Prisma ORM 설정 완료
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Supabase 연결 정보
```env
DATABASE_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres?sslmode=require"
```

### 모델 정의 완료
- ✅ User (사용자)
- ✅ Folder (폴더)
- ✅ Note (메모)

---

## 🎯 마이그레이션 실행 방법

### Step 1: Supabase 프로젝트 Resume

**⚠️ 가장 중요!**

1. **https://app.supabase.com** 접속 후 로그인
2. 프로젝트 상태 확인:
   - 🔴 **Paused** → **"Resume Project"** 클릭 필수!
   - 🟢 **Active** → 다음 단계 진행
3. Resume 후 **1-2분 대기**

---

### Step 2: Supabase SQL Editor에서 마이그레이션 실행

#### 2-1. SQL Editor 열기

1. Supabase Dashboard 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **"New Query"** 버튼 클릭

#### 2-2. 마이그레이션 SQL 복사

**프로젝트의 `SUPABASE_마이그레이션.sql` 파일 전체 내용을 복사하여 붙여넣기**

또는 아래 SQL을 복사:

```sql
-- ========================================
-- Prisma 스키마를 Supabase로 마이그레이션
-- ========================================

-- 1. 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Users 테이블 생성
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Folders 테이블 생성
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

-- 4. Notes 테이블 생성
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

-- 5. 인덱스 생성
CREATE INDEX folders_userId_idx ON folders("userId");
CREATE INDEX notes_userId_idx ON notes("userId");
CREATE INDEX notes_folderId_idx ON notes("folderId");

-- 6. 자동 업데이트 함수
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

-- 7. 트리거 생성
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

-- 8. 완료 확인
SELECT 
    '✅ 마이그레이션 완료!' as message,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users') as users_table,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'folders') as folders_table,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'notes') as notes_table;
```

#### 2-3. SQL 실행

1. **"Run"** 또는 **"실행"** 버튼 클릭 (또는 `Ctrl + Enter`)
2. 실행 결과 확인:

```
✅ 마이그레이션 완료!
users_table: 1
folders_table: 1
notes_table: 1
```

---

### Step 3: 테이블 확인

#### Table Editor에서 확인

1. 왼쪽 메뉴에서 **Table Editor** 클릭
2. 생성된 테이블 확인:
   - ✅ `users` (사용자)
   - ✅ `folders` (폴더)
   - ✅ `notes` (메모)

#### 테이블 구조 확인

각 테이블 클릭하면 컬럼 정보 확인 가능:

**users 테이블:**
- id (TEXT, PRIMARY KEY)
- email (TEXT, UNIQUE)
- password (TEXT)
- displayName (TEXT)
- createdAt (TIMESTAMPTZ)
- updatedAt (TIMESTAMPTZ)

**folders 테이블:**
- id (TEXT, PRIMARY KEY)
- name (TEXT)
- parentId (TEXT, nullable)
- isSpecial (BOOLEAN)
- userId (TEXT, FOREIGN KEY)
- createdAt (TIMESTAMPTZ)
- updatedAt (TIMESTAMPTZ)

**notes 테이블:**
- id (TEXT, PRIMARY KEY)
- content (TEXT)
- folderId (TEXT, FOREIGN KEY)
- userId (TEXT, FOREIGN KEY)
- createdAt (TIMESTAMPTZ)
- modifiedAt (TIMESTAMPTZ)

---

### Step 4: Prisma Client 생성

**로컬 프로젝트에서:**

```bash
cd server
npx prisma generate
```

**출력:**
```
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

---

### Step 5: 연결 테스트

**테스트 스크립트 실행:**

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => console.log('✅ Supabase 연결 성공!'))
  .catch(err => console.error('❌ 연결 실패:', err.message))
  .finally(() => prisma.\$disconnect());
"
```

**성공 시:**
```
✅ Supabase 연결 성공!
```

---

### Step 6: 앱 실행

```bash
# 프로젝트 루트에서
npm run start:all
```

**브라우저 자동 실행:**
- http://localhost:3000

---

## 🎊 완료 후 확인 사항

### 1. 회원가입 테스트

1. 브라우저에서 회원가입 진행
2. Supabase Table Editor → `users` 테이블
3. 새 사용자 데이터 확인!

### 2. 메모 작성 테스트

1. 로그인 후 메모 작성
2. Supabase Table Editor → `notes` 테이블
3. 새 메모 데이터 확인!

### 3. 폴더 생성 테스트

1. 새 폴더 생성
2. Supabase Table Editor → `folders` 테이블
3. 새 폴더 데이터 확인!

---

## 🔍 트러블슈팅

### 문제 1: "Can't reach database server"

**원인:** Supabase 프로젝트가 Paused 상태

**해결:**
1. https://app.supabase.com 접속
2. "Resume Project" 클릭
3. 1-2분 대기

### 문제 2: "relation does not exist"

**원인:** 테이블이 생성되지 않음

**해결:**
1. SQL Editor에서 마이그레이션 SQL 다시 실행
2. Table Editor에서 테이블 확인

### 문제 3: "password authentication failed"

**원인:** 비밀번호 오류

**해결:**
1. Supabase Settings → Database → Database Password
2. 비밀번호 재설정
3. .env 파일 업데이트
4. `npx prisma generate` 재실행

---

## 📋 체크리스트

마이그레이션 전 확인:

- [ ] Supabase 프로젝트 **Active** 상태
- [ ] SQL Editor에서 마이그레이션 SQL 실행 완료
- [ ] Table Editor에서 3개 테이블 확인
- [ ] .env 파일 설정 완료
- [ ] `npx prisma generate` 실행 완료
- [ ] 연결 테스트 성공

---

## 🎯 Prisma ORM 장점

### 1. 타입 안전성
```typescript
// 자동 완성 지원
const user = await prisma.user.create({
  data: {
    email: "test@example.com",
    password: "hashed",
    displayName: "Test User"
  }
})
```

### 2. 관계 처리
```typescript
// 사용자와 메모를 함께 조회
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { notes: true, folders: true }
})
```

### 3. 마이그레이션 관리
```bash
# 스키마 변경 시
npx prisma migrate dev --name add_new_field
```

---

## 📦 Next.js 통합 (향후)

제공하신 Next.js 코드는 향후 프로젝트를 Next.js로 전환할 때 사용 가능합니다.

**현재 구조:**
```
React (Frontend) + Express (Backend) + Prisma (ORM) + Supabase (DB)
```

**Next.js 전환 시:**
```
Next.js (Full-stack) + Prisma (ORM) + Supabase (DB)
```

Next.js 전환을 원하시면 별도로 요청해주세요!

---

## 🚀 지금 바로 시작!

1. **https://app.supabase.com** 접속
2. 프로젝트 **Resume**
3. **SQL Editor** → 마이그레이션 SQL 실행
4. **Table Editor** → 테이블 확인
5. 로컬에서: `npm run start:all`

**모든 준비 완료! 지금 바로 Supabase + Prisma로 메모 앱을 실행하세요!** 🎉

