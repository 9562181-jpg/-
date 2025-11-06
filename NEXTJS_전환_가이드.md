# 🚀 Next.js 전환 완료 가이드

## ✅ 전환 완료 항목

### 1. 프로젝트 구조 ✅
```
memo/
├── app/                     # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # 인증 API
│   │   ├── notes/          # 메모 API
│   │   └── folders/        # 폴더 API
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   ├── providers.tsx       # Context Providers
│   └── globals.css         # 글로벌 스타일
├── components/             # React 컴포넌트
│   ├── AuthPage.tsx
│   ├── MemoApp.tsx
│   ├── FolderList.tsx
│   ├── NoteList.tsx
│   ├── NoteEditor.tsx
│   └── SearchPage.tsx
├── lib/                    # 유틸리티
│   ├── prisma.ts          # Prisma 클라이언트
│   ├── auth.ts            # JWT 인증
│   └── api.ts             # API 클라이언트
├── prisma/                # Prisma 설정
│   └── schema.prisma      # DB 스키마
├── types/                 # TypeScript 타입
│   └── index.ts
├── utils/supabase/        # Supabase 클라이언트
│   ├── server.ts
│   ├── client.ts
│   └── middleware.ts
├── next.config.js         # Next.js 설정
├── tailwind.config.ts     # Tailwind 설정
├── tsconfig.json          # TypeScript 설정
└── package.json           # 의존성
```

### 2. 기술 스택 ✅
- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT
- **Styling**: Tailwind CSS

### 3. 주요 변경 사항 ✅

#### Express → Next.js API Routes
```
이전: server/src/routes/auth.js
현재: app/api/auth/signup/route.ts
      app/api/auth/login/route.ts
      app/api/auth/me/route.ts
```

#### React Router → Next.js Navigation
```
이전: React Router (BrowserRouter, Routes, Route)
현재: Client-side state management
```

#### Context 통합
```
이전: src/context/AuthContext.tsx + AppContext.tsx
현재: app/providers.tsx (통합됨)
```

---

## 🚀 실행 방법

### Step 1: 환경 변수 설정

루트 디렉토리에 `.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jdiqtblpbzukxcdqfmdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaXF0YmxwYnp1a3hjZHFmbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTIzNTksImV4cCI6MjA3Nzk4ODM1OX0.vrlmQcpOdBpzfYFkgb77RIVBOBneAWEvFjM5a80eGgE

# Prisma + Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres?sslmode=require"

# JWT Secret
JWT_SECRET=memo-app-secret-key-2024
```

### Step 2: Supabase 프로젝트 Resume

⚠️ **필수!** Supabase 무료 플랜은 7일 비활성 시 자동 일시중지됩니다.

1. **https://app.supabase.com** 접속 후 로그인
2. 프로젝트 상태 확인:
   - 🔴 **Paused** → **"Resume Project"** 클릭
   - 🟢 **Active** → 다음 단계 진행
3. Resume 후 **1-2분 대기**

### Step 3: 테이블 확인

**Supabase Dashboard → Table Editor**에서 확인:
- ✅ `users` (사용자)
- ✅ `folders` (폴더)
- ✅ `notes` (메모)

**테이블이 없다면** `SUPABASE_마이그레이션.sql` 실행 필요!

### Step 4: 의존성 설치

```bash
# 기존 node_modules 삭제 (선택사항, 깨끗한 설치를 위해)
rm -rf node_modules package-lock.json

# 의존성 설치
npm install
```

### Step 5: Prisma Client 생성

```bash
npx prisma generate
```

**예상 출력:**
```
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

### Step 6: Next.js 개발 서버 실행

```bash
npm run dev
```

**예상 출력:**
```
   ▲ Next.js 15.1.0
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 2.3s
```

### Step 7: 브라우저 접속

**http://localhost:3000** 접속!

---

## 🎊 기능 테스트

### 1. 회원가입
1. 이메일, 비밀번호, 이름 입력
2. "회원가입" 클릭
3. **Supabase Dashboard → Table Editor → users**
4. 새 사용자 데이터 확인! ✅

### 2. 로그인
1. 이메일, 비밀번호 입력
2. "로그인" 클릭
3. 메모 앱 화면으로 이동 ✅

### 3. 폴더 보기
- "모든 메모" 폴더 확인 ✅
- "최근 삭제된 항목" 폴더 확인 ✅

### 4. 메모 작성
1. 폴더 선택
2. 메모 작성
3. **Supabase Dashboard → Table Editor → notes**
4. 새 메모 데이터 확인! ✅

---

## 📋 주요 API 엔드포인트

### 인증 API
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 메모 API
- `GET /api/notes` - 메모 목록 조회
- `POST /api/notes` - 메모 생성
- `PUT /api/notes/[id]` - 메모 수정
- `DELETE /api/notes/[id]` - 메모 삭제
- `PATCH /api/notes/[id]` - 메모 이동

### 폴더 API
- `GET /api/folders` - 폴더 목록 조회
- `POST /api/folders` - 폴더 생성
- `PUT /api/folders/[id]` - 폴더 수정
- `DELETE /api/folders/[id]` - 폴더 삭제

---

## 🔧 트러블슈팅

### 문제 1: "Can't reach database server"

**원인**: Supabase 프로젝트가 Paused 상태

**해결**:
1. https://app.supabase.com 접속
2. "Resume Project" 클릭
3. 1-2분 대기
4. 서버 재시작: `npm run dev`

### 문제 2: "Module not found"

**원인**: 의존성 미설치 또는 충돌

**해결**:
```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm run dev
```

### 문제 3: "Prisma Client did not initialize yet"

**원인**: Prisma Client 미생성

**해결**:
```bash
npx prisma generate
npm run dev
```

### 문제 4: "Environment variable not found: DATABASE_URL"

**원인**: `.env.local` 파일 없음

**해결**:
1. 루트 디렉토리에 `.env.local` 파일 생성
2. 환경 변수 추가 (위 Step 1 참고)
3. 서버 재시작

---

## 🎯 Express vs Next.js 비교

### 이전 (Express)
```
Frontend (React) → Backend (Express :5000) → Database (Supabase)
```

**단점**:
- 두 개의 서버 (React dev server + Express server)
- 복잡한 설정 (CORS, proxy)
- 별도의 배포 필요

### 현재 (Next.js)
```
Next.js (Frontend + Backend) → Database (Supabase)
```

**장점**:
- ✅ 하나의 서버로 통합
- ✅ API Routes 내장
- ✅ 타입 안전성 (TypeScript 전체 적용)
- ✅ Server Components (필요 시)
- ✅ 간단한 배포 (Vercel 원클릭)

---

## 🚀 프로덕션 배포

### Vercel 배포 (권장)

1. **GitHub에 푸시**
```bash
git add .
git commit -m "Next.js 전환 완료"
git push
```

2. **Vercel 연결**
   - https://vercel.com 접속
   - "Import Project"
   - GitHub 저장소 선택

3. **환경 변수 설정**
   - Vercel Dashboard → Settings → Environment Variables
   - `.env.local` 내용 추가

4. **자동 배포!**
   - Push할 때마다 자동 배포
   - Production URL 제공

### Supabase 무료 플랜 주의사항

- ⚠️ 7일간 활동 없으면 자동 일시중지
- ✅ Resume 무제한 가능
- ✅ 일시중지 방지 방법:
  - 주기적으로 앱 접속
  - Vercel Cron Jobs로 자동 핑
  - 또는 Supabase Pro 플랜 고려

---

## 📦 폴더 정리

### 삭제 가능한 폴더/파일
```bash
# 기존 React 앱 파일들
src/               # Next.js에서 사용 안 함
server/            # Express 서버 (Next.js API Routes로 대체)
public/index.html  # Next.js가 자동 생성
start_all.bat      # 더 이상 필요 없음
```

**삭제 명령어**:
```bash
rm -rf src server public/index.html start_all.bat
```

---

## 🎊 전환 완료!

**축하합니다! React + Express에서 Next.js Full-stack으로 성공적으로 전환되었습니다!** 🎉

### 다음 단계

1. ✅ **http://localhost:3000** 접속하여 테스트
2. ✅ 회원가입 → 메모 작성 → Supabase에서 데이터 확인
3. ✅ GitHub에 푸시
4. ✅ Vercel에 배포 (선택사항)

---

**모든 기능이 동일하게 작동하며, 더 빠르고 간단해졌습니다!** 🚀

