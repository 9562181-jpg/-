# 📝 메모 앱 (Next.js + Prisma + Supabase)

밝은 파스텔 테마의 Full-stack 메모 앱입니다.

## 🎯 기술 스택

- **Frontend & Backend**: Next.js 15 (App Router)
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT
- **Styling**: Tailwind CSS

## 📋 기능

- ✅ 사용자 회원가입/로그인/로그아웃
- ✅ 메모 생성/수정/삭제
- ✅ 폴더 생성/수정/삭제
- ✅ 메모 검색/정렬
- ✅ 휴지통 (삭제된 메모 복원)
- ✅ 최근 메모 캐러셀

## 🚀 빠른 시작

### Step 1: 환경 변수 설정

루트 디렉토리에 `.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jdiqtblpbzukxcdqfmdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Prisma (중요: 포트가 다릅니다!)
# 앱 연결용 - Port 6543 (PgBouncer)
DATABASE_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# 마이그레이션용 - Port 5432 (직접 연결)
DIRECT_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET=memo-app-secret-key-2024
```

### Step 2: Supabase 프로젝트 Resume

⚠️ **필수!** Supabase 무료 플랜은 7일 비활성 시 자동 일시중지됩니다.

1. **https://app.supabase.com** 접속 후 로그인
2. 프로젝트 상태 확인:
   - 🔴 **Paused** → **"Resume Project"** 클릭
   - 🟢 **Active** → 다음 단계 진행
3. **중요: Resume 후 2-3분 대기!** ⏳

### Step 3: 의존성 설치

```bash
npm install
```

### Step 4: Prisma 마이그레이션 실행 ⭐

**올바른 Prisma 방식 - 단 하나의 명령어:**

```bash
npx prisma migrate dev --name init_schema
```

**이 명령어가 수행하는 작업:**
- ✅ `schema.prisma` → Supabase PostgreSQL 자동 동기화
- ✅ 테이블, 인덱스, 관계 모두 생성
- ✅ 마이그레이션 이력 관리 (`prisma/migrations` 폴더)
- ✅ Prisma Client 자동 생성

**성공 시:**
```
✔ Applying migration `20241106000000_init_schema`
Your database is now in sync with your schema.
```

### Step 5: Next.js 앱 실행

```bash
npm run dev
```

**브라우저 자동 실행:** http://localhost:3000

---

## 🔧 트러블슈팅

### "Connection failed" 오류

**원인 (90%):** Supabase 프로젝트 Paused 상태

**해결:**
1. https://app.supabase.com 접속
2. "Resume Project" 클릭
3. **2-3분 대기** (중요!)
4. 마이그레이션 재실행

### "Port 5432 연결 실패"

**원인:** DIRECT_URL 설정 오류 또는 VPN 차단

**해결:**
- `.env.local`의 DIRECT_URL 확인
- VPN 사용 중이면 끄기
- 모바일 핫스팟으로 테스트

### "Drift detected" 오류

**원인:** 수동으로 생성한 테이블이 남아있음

**해결:**
```bash
# Supabase SQL Editor에서 실행
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

# 그 다음
npx prisma migrate dev --name init_schema
```

---

## 📁 프로젝트 구조

```
memo/
├── app/
│   ├── api/              # Next.js API Routes
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/           # React 컴포넌트
├── lib/
│   ├── prisma.ts        # Prisma Client
│   ├── auth.ts          # JWT
│   └── api.ts
├── prisma/
│   ├── schema.prisma    # 데이터베이스 스키마 (진실의 원천)
│   └── migrations/      # 마이그레이션 이력
├── utils/supabase/      # Supabase 클라이언트
├── types/
└── .env.local           # 환경 변수
```

---

## 🔄 스키마 변경 시 (예시)

### 예: User 모델에 avatar 필드 추가

1. **`prisma/schema.prisma` 수정:**
```prisma
model User {
  // ...
  avatar String? // 추가
  // ...
}
```

2. **마이그레이션:**
```bash
npx prisma migrate dev --name add_user_avatar
```

3. **완료!** Supabase에 자동 반영됨

---

## 📦 주요 스크립트

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버
npx prisma studio    # DB GUI 도구
npx prisma migrate dev --name [이름]  # 마이그레이션
```

---

## 📖 가이드 문서

- **PRISMA_SUPABASE_가이드.md**: 완벽한 Prisma 마이그레이션 가이드

---

## 📦 GitHub

**Repository**: https://github.com/9562181-jpg/-.git

---

**Prisma의 강력한 마이그레이션 기능으로 데이터베이스를 안전하게 관리하세요!** 🎉
