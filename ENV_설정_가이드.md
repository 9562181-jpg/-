# 🔐 환경 변수 설정 가이드

## 📋 Supabase + Prisma 환경 변수

### 프론트엔드 (루트 `.env`)

프로젝트 루트에 `.env` 파일이 필요한 경우 (Next.js 전환 시):

```env
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://jdiqtblpbzukxcdqfmdd.supabase.co

# Supabase Anon Key (공개용)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaXF0YmxwYnp1a3hjZHFmbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTIzNTksImV4cCI6MjA3Nzk4ODM1OX0.vrlmQcpOdBpzfYFkgb77RIVBOBneAWEvFjM5a80eGgE
```

### 백엔드 (`server/.env`) ✅ 현재 사용 중

```env
# Prisma + Supabase PostgreSQL 연결
DATABASE_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres?sslmode=require"

# Prisma 마이그레이션용 직접 연결
DIRECT_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres?sslmode=require"

# JWT Secret
JWT_SECRET=memo-app-secret-key-2024

# Server Port
PORT=5000
```

---

## 🎯 환경 변수 설명

### NEXT_PUBLIC_SUPABASE_URL
- **용도**: Supabase 프로젝트 URL
- **값**: `https://jdiqtblpbzukxcdqfmdd.supabase.co`
- **사용처**: 
  - Supabase 클라이언트 라이브러리 (`@supabase/supabase-js`)
  - Next.js에서 브라우저에서도 접근 가능 (NEXT_PUBLIC_ 접두사)

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **용도**: Supabase Anon(ymous) Key (공개 키)
- **특징**: 
  - ✅ 브라우저에 노출되어도 안전
  - ✅ Row Level Security (RLS)로 보호됨
  - ❌ 서버 측 작업에는 Service Role Key 필요 (별도)
- **사용처**: 
  - 클라이언트 사이드 Supabase 인증
  - 공개 데이터 조회

### DATABASE_URL
- **용도**: Prisma ORM이 사용하는 데이터베이스 연결 문자열
- **특징**:
  - ✅ SSL 필수 (`sslmode=require`)
  - ✅ Session mode (Port 5432)
  - ✅ Connection Pooling 가능 (Port 6543으로 변경 가능)
- **사용처**:
  - Express 백엔드 서버
  - Prisma Client 쿼리

### DIRECT_URL
- **용도**: Prisma 마이그레이션 전용 연결 문자열
- **특징**:
  - ⚠️ PgBouncer를 거치지 않는 직접 연결
  - ⚠️ 마이그레이션은 트랜잭션 모드 필요
- **사용처**:
  - `prisma migrate` 명령어
  - `prisma db push` 명령어

### JWT_SECRET
- **용도**: JWT 토큰 서명 키
- **특징**:
  - ⚠️ **절대 노출 금지**
  - ⚠️ 프로덕션에서는 강력한 랜덤 값 사용
- **사용처**:
  - 사용자 인증 토큰 생성/검증

---

## 🔒 보안 주의사항

### ✅ 안전하게 공개 가능
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ❌ 절대 공개 금지
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- Supabase Service Role Key (사용 시)

### .gitignore 확인

`.env` 파일이 Git에 커밋되지 않도록 확인:

```gitignore
# Environment Variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
server/.env
```

---

## 📦 Supabase 키 종류

### 1. Anon Key (익명 키) ✅ 현재 사용
- **노출**: 브라우저/클라이언트에 노출 가능
- **용도**: 공개 API 호출, 클라이언트 인증
- **보안**: Row Level Security (RLS)로 보호
- **위치**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Service Role Key ⚠️ 서버 전용
- **노출**: 절대 노출 금지
- **용도**: 서버 측에서 모든 데이터 접근
- **보안**: RLS 우회 가능
- **위치**: 서버 `.env`에만 저장 (필요 시)

---

## 🎯 현재 프로젝트 구조

### Backend (Express + Prisma)
```
server/.env:
  ├── DATABASE_URL (Prisma 사용)
  ├── DIRECT_URL (Prisma 마이그레이션)
  ├── JWT_SECRET (인증)
  └── PORT (서버 포트)
```

### Frontend (React)
```
현재는 백엔드 API만 호출
향후 Next.js 전환 시:
  ├── NEXT_PUBLIC_SUPABASE_URL
  └── NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 🚀 Next.js 전환 시 Supabase 클라이언트 설정

제공하신 코드 활용:

### 1. 서버 컴포넌트 (`utils/supabase/server.ts`)

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서 호출된 경우 무시
          }
        },
      },
    },
  );
};
```

### 2. 클라이언트 컴포넌트 (`utils/supabase/client.ts`)

```typescript
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );
```

### 3. 미들웨어 (`utils/supabase/middleware.ts`)

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return supabaseResponse;
};
```

---

## ✅ 현재 상태 요약

- [x] `server/.env` 설정 완료
- [x] Prisma ORM 연결 설정 완료
- [x] Supabase PostgreSQL 연결 정보 확인
- [x] SSL 보안 연결 설정
- [ ] Supabase 프로젝트 Resume 필요
- [ ] Supabase SQL Editor에서 마이그레이션 실행 필요

---

**Next.js로 전환을 원하시면 별도로 요청해주세요!**

