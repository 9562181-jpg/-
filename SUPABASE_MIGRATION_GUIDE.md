# 🚀 Supabase 마이그레이션 가이드

## 📋 현재 상태

- ✅ Prisma 스키마: PostgreSQL로 설정 완료
- ✅ Supabase 프로젝트: 생성 완료
- ⏳ 데이터베이스 마이그레이션: 진행 중

## 🔧 방법 1: Supabase SQL Editor 사용 (권장)

### 단계 1: Supabase 대시보드 접속

1. https://jdiqtblpbzukxcdqfmdd.supabase.co 접속
2. 로그인 (비밀번호: `@ab131001`)
3. 왼쪽 메뉴에서 **SQL Editor** 선택

### 단계 2: SQL 스크립트 실행

1. **New Query** 클릭
2. `server/prisma/supabase_migration.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭 (또는 Ctrl+Enter)

### 단계 3: 확인

SQL Editor에서 다음 쿼리로 테이블 확인:

```sql
-- 생성된 테이블 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

예상 결과:
- users
- folders
- notes

## 🔧 방법 2: Prisma Migrate 사용

### 단계 1: Supabase 연결 문자열 확인

Supabase 대시보드에서:
1. **Settings** → **Database** 클릭
2. **Connection String** 섹션에서 **URI** 복사

연결 문자열 형식:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 단계 2: .env 파일 수정

현재 설정된 연결 문자열을 확인하고 필요시 수정:

```bash
cd server
type .env
```

**올바른 형식:**
```env
# Connection Pooler (일반 쿼리용)
DATABASE_URL="postgresql://postgres.jdiqtblpbzukxcdqfmdd:%40ab131001@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (마이그레이션용)
DIRECT_URL="postgresql://postgres:%40ab131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET="memo-app-secret-key-2024"

# Server Port
PORT=5000
```

**참고:** 비밀번호의 `@` 기호는 `%40`으로 URL 인코딩됨

### 단계 3: 마이그레이션 실행

```bash
cd server
npx prisma migrate deploy
```

## 🔧 방법 3: Supabase Direct Connection 테스트

연결 테스트:

```bash
cd server
npx prisma db push
```

이 명령어는 마이그레이션 없이 스키마를 바로 푸시합니다.

## 🐛 문제 해결

### 연결 오류 (P1001)

**증상:** `Can't reach database server`

**해결 방법:**

1. **Supabase 프로젝트 활성화 확인**
   - Supabase 대시보드에서 프로젝트가 "Active" 상태인지 확인

2. **방화벽/네트워크 확인**
   - 방화벽이 5432, 6543 포트를 차단하는지 확인

3. **연결 문자열 재확인**
   - Supabase Dashboard → Settings → Database → Connection String
   - URI 복사 후 비밀번호 부분 수동 입력

4. **IPv6 설정**
   - 일부 네트워크에서는 IPv6가 필요할 수 있음
   - `&sslmode=require` 추가 시도

### 비밀번호 특수문자 오류

비밀번호에 `@`, `#`, `&` 등이 있으면 URL 인코딩 필요:
- `@` → `%40`
- `#` → `%23`
- `&` → `%26`

### SSL 오류

연결 문자열에 SSL 옵션 추가:
```
?sslmode=require
```

## ✅ 수동 마이그레이션 (SQL Editor 사용)

만약 Prisma 연결이 계속 실패하면:

1. **Supabase SQL Editor** 접속
2. **`server/prisma/supabase_migration.sql`** 파일 내용 복사
3. SQL Editor에 붙여넣고 실행
4. 테이블 생성 확인
5. 앱 실행

이 방법이 가장 확실합니다!

## 🎯 마이그레이션 완료 후

### 1. Prisma Client 재생성
```bash
cd server
npx prisma generate
```

### 2. 서버 실행
```bash
npm run dev
```

### 3. 연결 확인
브라우저에서: http://localhost:5000/api/health

### 4. 앱 전체 실행
프로젝트 루트에서:
```bash
npm run start:all
```

## 📊 Supabase 장점

- ✅ **PostgreSQL**: 강력한 관계형 DB
- ✅ **실시간 구독**: 실시간 데이터 업데이트
- ✅ **Row Level Security**: 행 레벨 보안
- ✅ **자동 백업**: 데이터 보호
- ✅ **무료 티어**: 500MB 저장공간

## 🔗 유용한 링크

- [Supabase Dashboard](https://jdiqtblpbzukxcdqfmdd.supabase.co)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)

## 💡 추천 순서

1. ⭐ **Supabase SQL Editor**에서 `supabase_migration.sql` 실행 (가장 빠름)
2. Prisma Client 재생성
3. 서버 및 앱 실행
4. 회원가입/로그인 테스트

성공하시면 모든 데이터가 Supabase PostgreSQL에 안전하게 저장됩니다! 🎉

