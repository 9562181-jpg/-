# 🚀 Prisma + Supabase 올바른 마이그레이션 가이드

## ⚠️ 중요: Prisma의 핵심 기능을 활용하세요!

Prisma를 사용하는 이유는 **`schema.prisma` 파일 하나로 모든 것을 관리**하기 위함입니다.
- ✅ `schema.prisma` = 단일 진실의 원천 (Single Source of Truth)
- ✅ `npx prisma migrate` = 자동 마이그레이션 및 이력 관리
- ❌ 수동으로 SQL 작성하면 Prisma의 장점이 모두 사라집니다!

---

## 📋 올바른 환경 변수 설정

### `.env.local` 파일 (프로젝트 루트)

```env
# Supabase (Next.js Public 변수)
NEXT_PUBLIC_SUPABASE_URL=https://jdiqtblpbzukxcdqfmdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Prisma + Supabase PostgreSQL
# 앱 연결용 (PgBouncer - Port 6543)
DATABASE_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# Prisma 마이그레이션용 (직접 연결 - Port 5432)
DIRECT_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET=memo-app-secret-key-2024
```

### 🔍 포트 구분이 중요한 이유

| 용도 | 포트 | 환경변수 | 설명 |
|------|------|----------|------|
| **앱 연결** | 6543 | DATABASE_URL | PgBouncer (커넥션 풀링) |
| **마이그레이션** | 5432 | DIRECT_URL | 직접 연결 (DDL 권한 필요) |

---

## 🎯 Step 1: Supabase 프로젝트 Resume (필수!)

**Supabase 무료 플랜은 7일간 활동 없으면 자동 일시중지됩니다.**

### Resume 방법:

1. **https://app.supabase.com** 접속 후 로그인
2. 프로젝트 목록에서 상태 확인:
   - 🔴 **Paused** → **"Resume Project"** 클릭
   - 🟢 **Active** → 다음 단계 진행
3. **중요: Resume 후 2-3분 대기!** ⏳
   - 데이터베이스가 완전히 깨어날 때까지 시간이 필요합니다

---

## 🎯 Step 2: Prisma 마이그레이션 실행 (올바른 방법!)

### ✅ Prisma 방식 (권장)

**단 하나의 명령어로 모든 것을 자동화:**

```bash
npx prisma migrate dev --name init_schema
```

**이 명령어가 수행하는 작업:**

1. ✅ `.env.local`의 `DIRECT_URL` 읽기 (Port 5432)
2. ✅ Supabase PostgreSQL 연결
3. ✅ `schema.prisma`와 DB 상태 비교
4. ✅ 필요한 SQL 마이그레이션 파일 자동 생성
5. ✅ Supabase에 SQL 실행 (테이블, 인덱스, 외래키, 트리거 생성)
6. ✅ `prisma/migrations` 폴더에 이력 저장
7. ✅ `_prisma_migrations` 테이블에 실행 기록
8. ✅ Prisma Client 자동 재생성

**예상 출력:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres"

Applying migration `20241106000000_init_schema`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20241106000000_init_schema/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

### ❌ 수동 SQL 방식 (비권장 - 사용하지 마세요!)

~~Supabase SQL Editor에 수동으로 SQL 붙여넣기~~
- ❌ `schema.prisma`와 DB 상태가 따로 관리됨
- ❌ 마이그레이션 이력 관리 불가
- ❌ 스키마 변경 시 충돌 발생

---

## 🎯 Step 3: 연결 테스트

마이그레이션 완료 후, 앱 연결 테스트 (Port 6543 - PgBouncer):

```bash
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('✅ Supabase 연결 성공! (Port 6543 PgBouncer)')).catch(err => console.error('❌ 연결 실패:', err.message)).finally(() => prisma.\$disconnect());"
```

**성공 시:**
```
✅ Supabase 연결 성공! (Port 6543 PgBouncer)
```

---

## 🎯 Step 4: Next.js 앱 실행

```bash
npm run dev
```

**브라우저 자동 실행:** http://localhost:3000

---

## 🔧 트러블슈팅

### 문제 1: "Connection failed" 또는 "Can't reach database server"

**원인:** Supabase 프로젝트 Paused 상태 (90% 확률)

**해결:**
1. https://app.supabase.com 접속
2. "Resume Project" 클릭
3. **2-3분 대기** (중요!)
4. `npx prisma migrate dev --name init_schema` 재실행

### 문제 2: "Port 5432 연결 실패" (마이그레이션 시)

**원인:** DIRECT_URL 설정 오류

**해결:**
```env
DIRECT_URL="postgresql://postgres:비밀번호@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres"
```

### 문제 3: "Port 6543 연결 실패" (앱 실행 시)

**원인:** DATABASE_URL 설정 오류

**해결:**
```env
DATABASE_URL="postgresql://postgres:비밀번호@db.jdiqtblpbzukxcdqfmdd.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
```

### 문제 4: "Drift detected" 또는 스키마 불일치

**원인:** 이전에 수동으로 생성한 테이블이 남아있음

**해결:**
```bash
# Supabase SQL Editor에서 기존 테이블 삭제
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

# 그 다음 Prisma 마이그레이션 실행
npx prisma migrate dev --name init_schema
```

---

## 🎊 스키마 변경 예시 (향후)

### 예: User 모델에 필드 추가

1. **`prisma/schema.prisma` 수정:**
```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  displayName String
  avatar      String?  // ← 새 필드 추가
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  folders Folder[]
  notes   Note[]
  
  @@map("users")
}
```

2. **마이그레이션 실행:**
```bash
npx prisma migrate dev --name add_user_avatar
```

3. **완료!**
- Supabase에 `avatar` 컬럼 자동 추가
- `prisma/migrations` 폴더에 변경 이력 저장
- Prisma Client 자동 업데이트

---

## 📊 Prisma vs 수동 SQL 비교

| 항목 | Prisma Migrate | 수동 SQL |
|------|----------------|----------|
| 스키마 관리 | ✅ `schema.prisma` 하나 | ❌ 파일 + SQL 따로 |
| 변경 이력 | ✅ Git으로 추적 가능 | ❌ 이력 없음 |
| 팀 협업 | ✅ 충돌 방지 | ❌ 충돌 위험 높음 |
| 타입 안전성 | ✅ 자동 생성 | ❌ 수동 작성 필요 |
| 롤백 | ✅ 간단함 | ❌ 어려움 |

---

## 🚀 지금 바로 시작!

### 1. Supabase Resume
**https://app.supabase.com** → "Resume Project" → **2-3분 대기**

### 2. 기존 테이블 정리 (최초 1회)
**Supabase SQL Editor:**
```sql
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### 3. Prisma 마이그레이션
```bash
npx prisma migrate dev --name init_schema
```

### 4. 앱 실행
```bash
npm run dev
```

### 5. 테스트
**http://localhost:3000** → 회원가입 → Supabase Table Editor 확인!

---

**Prisma의 강력한 마이그레이션 기능을 활용하세요!** 🎉

