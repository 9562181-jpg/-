# 📝 메모 앱 (React + Express + Supabase PostgreSQL)

밝은 테마의 메모 앱입니다. 사용자 인증과 CRUD 기능을 제공합니다.

## 🎯 기술 스택

### 프론트엔드
- **React** 18 + **TypeScript**
- **Tailwind CSS** (밝은 파스텔 테마)
- **React Router** (라우팅)
- **Axios** (API 통신)

### 백엔드
- **Express.js** (Node.js 서버)
- **Prisma ORM** (데이터베이스 툴킷)
- **JWT** (인증)
- **bcrypt** (비밀번호 해싱)

### 데이터베이스
- **Supabase PostgreSQL** (클라우드 데이터베이스)

## 📋 기능

- ✅ 사용자 회원가입/로그인/로그아웃
- ✅ 메모 생성/수정/삭제
- ✅ 폴더 생성/수정/삭제
- ✅ 메모 검색/정렬
- ✅ 휴지통 (삭제된 메모 복원)
- ✅ 최근 메모 캐러셀

## 🚨 현재 상태

### ✅ 완료된 설정
- [x] SSL 연결 설정 (`sslmode=require`)
- [x] Port 6543 (PgBouncer - Supabase 권장)
- [x] DIRECT_URL (Prisma 마이그레이션용)
- [x] Prisma Schema (PostgreSQL)
- [x] 호스트 주소 확인: `db.jdiqtblpbzukxcdqfmdd.supabase.co`
- [x] 내 IP 확인: `1.228.225.19`

### ❌ 현재 문제
**DNS 조회 실패: Supabase 호스트 주소를 찾을 수 없습니다.**

```
db.jdiqtblpbzukxcdqfmdd.supabase.co → Name resolution failed
```

### 🔍 원인
1. **Supabase 프로젝트 일시중지/삭제**
2. **호스트 주소 변경됨**
3. **프로젝트 ID 오류**

### ✅ 해결 방법
**`SUPABASE_호스트주소_확인방법.md`** 파일을 참고하여:
1. Supabase 대시보드 접속
2. 프로젝트 상태 확인 (Active/Paused/Deleted)
3. Settings → Database → Connection String 복사
4. 정확한 호스트 주소 확인

---

## 🚀 Prisma + Supabase 마이그레이션 및 실행

### Step 1: Supabase 프로젝트 Resume

⚠️ **필수!** Supabase 무료 플랜은 7일 비활성 시 자동 일시중지됩니다.

1. **https://app.supabase.com** 접속 후 로그인
2. 프로젝트 상태 확인:
   - 🔴 **Paused** → **"Resume Project"** 클릭
   - 🟢 **Active** → 다음 단계 진행
3. Resume 후 **1-2분 대기**

### Step 2: Supabase 마이그레이션 실행

**Supabase Dashboard → SQL Editor → New Query**

`SUPABASE_마이그레이션.sql` 파일 전체 내용을 복사하여 실행:

```sql
-- users, folders, notes 테이블 생성
-- 인덱스, 트리거, 함수 자동 설정
-- (전체 SQL은 SUPABASE_마이그레이션.sql 참고)
```

**실행 결과:**
```
✅ 마이그레이션 완료!
users_table: 1
folders_table: 1
notes_table: 1
```

**Table Editor에서 확인:**
- ✅ `users` (사용자)
- ✅ `folders` (폴더)
- ✅ `notes` (메모)

### Step 3: 의존성 설치

```bash
# 프론트엔드
npm install

# 백엔드
cd server
npm install
```

### Step 4: 환경 변수 확인

`server/.env` 파일 (이미 설정됨):

```env
DATABASE_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET=memo-app-secret-key-2024
PORT=5000
```

### Step 5: Prisma Client 생성

```bash
cd server
npx prisma generate
```

### Step 6: 앱 실행

```bash
# 프로젝트 루트에서
npm run start:all
```

또는 개별 실행:

```bash
# 백엔드
cd server
npm run dev

# 프론트엔드 (새 터미널)
npm start
```

### Step 7: 브라우저 접속

- **프론트엔드**: http://localhost:3000 (자동으로 열림)
- **백엔드 API**: http://localhost:5000

### Step 8: 회원가입 및 데이터 확인

1. 브라우저에서 회원가입
2. **Supabase Dashboard → Table Editor → users**
3. 새 사용자 데이터 실시간 확인! 🎉

---

## 📁 프로젝트 구조

```
memo/
├── src/                          # 프론트엔드
│   ├── components/               # React 컴포넌트
│   │   ├── AuthPage.tsx         # 로그인/회원가입
│   │   ├── FolderList.tsx       # 폴더 목록
│   │   ├── NoteList.tsx         # 메모 목록
│   │   ├── NoteEditor.tsx       # 메모 에디터
│   │   └── Carousel.tsx         # 최근 메모 캐러셀
│   ├── context/                  # 상태 관리
│   │   ├── AuthContext.tsx      # 인증 컨텍스트
│   │   └── AppContext.tsx       # 앱 전역 상태
│   ├── api/                      # API 클라이언트
│   │   └── client.ts            # Axios 설정
│   └── App.tsx                   # 메인 앱
│
├── server/                       # 백엔드
│   ├── prisma/                   
│   │   └── schema.prisma        # Prisma 스키마
│   ├── src/
│   │   ├── index.js             # Express 서버
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT 인증 미들웨어
│   │   └── routes/
│   │       ├── auth.js          # 인증 라우트
│   │       ├── notes.js         # 메모 라우트
│   │       └── folders.js       # 폴더 라우트
│   └── .env                      # 환경 변수
│
├── SUPABASE_마이그레이션.sql      # DB 테이블 생성 SQL
├── SUPABASE_진단_가이드.md        # 연결 문제 해결 가이드
├── SUPABASE_호스트주소_확인방법.md # 호스트 주소 확인 방법
└── README.md                      # 이 파일
```

---

## 🔧 문제 해결

### 1. "Can't reach database server" 오류
→ **`SUPABASE_진단_가이드.md`** 참고

### 2. "Name resolution failed" 오류
→ **`SUPABASE_호스트주소_확인방법.md`** 참고

### 3. "Environment variable not found" 오류
→ `server/.env` 파일이 있는지 확인

### 4. "EADDRINUSE: port already in use" 오류
→ `taskkill /F /IM node.exe` 실행 후 재시도

---

## 📦 GitHub

**Repository**: https://github.com/9562181-jpg/-.git

---

## 📞 다음 단계

1. **Supabase 대시보드**에서 프로젝트 상태 확인
2. **Connection String** 복사
3. `server/.env` 업데이트
4. 앱 실행

**Supabase 호스트 주소만 확인하면 즉시 실행 가능합니다!** 🚀
