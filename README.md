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

## 🚀 설치 및 실행 (Supabase 연결 후)

### 1. 의존성 설치

```bash
# 프론트엔드
npm install

# 백엔드
cd server
npm install
```

### 2. 환경 변수 설정

`server/.env` 파일에 Supabase Connection String 입력:

```env
DATABASE_URL="postgresql://postgres:[비밀번호]@[호스트]:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://postgres:[비밀번호]@[호스트]:5432/postgres?sslmode=require"
JWT_SECRET=memo-app-secret-key-2024
PORT=5000
```

### 3. Supabase 테이블 생성

Supabase SQL Editor에서 `SUPABASE_마이그레이션.sql` 실행

### 4. Prisma Client 생성

```bash
cd server
npx prisma generate
```

### 5. 앱 실행

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

### 6. 브라우저 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:5000

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
