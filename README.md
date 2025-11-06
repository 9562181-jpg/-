# 📝 메모 앱 (Next.js + Prisma + Supabase)

밝은 파스텔 테마의 메모 앱입니다. **Next.js Full-stack**으로 구축되었습니다.

## 🎯 기술 스택

### Frontend
- **Next.js 15** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** (밝은 파스텔 테마)

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **JWT** (인증)
- **bcrypt** (비밀번호 해싱)

### Database
- **Supabase PostgreSQL** (클라우드 데이터베이스)

## 📋 기능

- ✅ 사용자 회원가입/로그인/로그아웃
- ✅ 메모 생성/수정/삭제
- ✅ 폴더 생성/수정/삭제
- ✅ 메모 검색/정렬
- ✅ 휴지통 (삭제된 메모 복원)
- ✅ 최근 메모 캐러셀

## 🚀 빠른 시작

### 1. 환경 변수 설정

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

### 2. Supabase 프로젝트 Resume

⚠️ **필수!** Supabase 무료 플랜은 7일 비활성 시 자동 일시중지됩니다.

1. **https://app.supabase.com** 접속 후 로그인
2. 프로젝트 상태 확인:
   - 🔴 **Paused** → **"Resume Project"** 클릭
   - 🟢 **Active** → 다음 단계 진행
3. Resume 후 **1-2분 대기**

### 3. 테이블 생성 (최초 1회)

**Supabase Dashboard → SQL Editor → New Query**

`SUPABASE_마이그레이션.sql` 파일 내용을 복사하여 실행:

**실행 결과:**
```
✅ 마이그레이션 완료!
users_table: 1
folders_table: 1
notes_table: 1
```

### 4. 의존성 설치

```bash
npm install
```

### 5. Next.js 개발 서버 실행

```bash
npm run dev
```

**예상 출력:**
```
   ▲ Next.js 15.1.0
   - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 2.3s
```

### 6. 브라우저 접속

**http://localhost:3000** 접속!

---

## 📁 프로젝트 구조

```
memo/
├── app/                     # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # 인증 API
│   │   │   ├── signup/
│   │   │   ├── login/
│   │   │   └── me/
│   │   ├── notes/          # 메모 API
│   │   └── folders/        # 폴더 API
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   ├── providers.tsx       # Context Providers
│   └── globals.css         # 글로벌 스타일
│
├── components/             # React 컴포넌트
│   ├── AuthPage.tsx        # 로그인/회원가입
│   ├── MemoApp.tsx         # 메인 앱
│   ├── FolderList.tsx      # 폴더 목록
│   ├── NoteList.tsx        # 메모 목록
│   ├── NoteEditor.tsx      # 메모 에디터
│   ├── SearchPage.tsx      # 검색
│   └── Carousel.tsx        # 캐러셀
│
├── lib/                    # 유틸리티
│   ├── prisma.ts          # Prisma 클라이언트
│   ├── auth.ts            # JWT 인증
│   └── api.ts             # API 클라이언트
│
├── prisma/                # Prisma 설정
│   └── schema.prisma      # DB 스키마
│
├── types/                 # TypeScript 타입
│   └── index.ts
│
├── utils/supabase/        # Supabase 클라이언트
│   ├── server.ts          # Server Components
│   ├── client.ts          # Client Components
│   └── middleware.ts      # Middleware
│
├── next.config.js         # Next.js 설정
├── tailwind.config.ts     # Tailwind 설정
├── tsconfig.json          # TypeScript 설정
└── package.json           # 의존성
```

---

## 🔧 주요 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# Lint 실행
npm run lint

# Prisma Client 생성
npx prisma generate

# Prisma Studio (DB GUI)
npx prisma studio
```

---

## 📦 API 엔드포인트

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

## 🔍 문제 해결

### 문제 1: "Can't reach database server"

**원인**: Supabase 프로젝트가 Paused 상태

**해결**:
1. https://app.supabase.com 접속
2. "Resume Project" 클릭
3. 1-2분 대기
4. 서버 재시작: `npm run dev`

### 문제 2: "Module not found"

**원인**: 의존성 미설치

**해결**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 문제 3: "Prisma Client did not initialize yet"

**원인**: Prisma Client 미생성

**해결**:
```bash
npx prisma generate
npm run dev
```

### 문제 4: "Environment variable not found"

**원인**: `.env.local` 파일 없음

**해결**:
1. 루트 디렉토리에 `.env.local` 파일 생성
2. 환경 변수 추가 (위 '환경 변수 설정' 참고)
3. 서버 재시작

---

## 🚀 프로덕션 배포

### Vercel 배포 (권장)

1. **GitHub에 푸시**
```bash
git add .
git commit -m "Next.js 메모 앱 배포 준비"
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

---

## 📖 가이드 문서

- **NEXTJS_전환_가이드.md**: Next.js 전환 완벽 가이드
- **SUPABASE_Prisma_마이그레이션_가이드.md**: Prisma + Supabase 설정
- **ENV_설정_가이드.md**: 환경 변수 상세 설명
- **SUPABASE_마이그레이션.sql**: DB 테이블 생성 SQL

---

## 🎊 특징

### ✅ Express에서 Next.js로 전환
- **이전**: React (Frontend) + Express (Backend)
- **현재**: Next.js (Full-stack)
- **장점**: 하나의 서버, 간단한 배포, 타입 안전성

### ✅ Prisma ORM
- 타입 안전한 데이터베이스 쿼리
- 자동 마이그레이션
- Prisma Studio (DB GUI)

### ✅ 밝은 파스텔 테마
- Tailwind CSS 커스텀 디자인
- 글래스모피즘 효과
- 애니메이션

---

## 📦 GitHub

**Repository**: https://github.com/9562181-jpg/-.git

---

## 🎯 다음 단계

1. ✅ **http://localhost:3000** 접속하여 테스트
2. ✅ 회원가입 → 메모 작성 → Supabase에서 데이터 확인
3. ✅ GitHub에 푸시
4. ✅ Vercel에 배포 (선택사항)

**모든 기능이 동일하게 작동하며, 더 빠르고 간단해졌습니다!** 🚀
