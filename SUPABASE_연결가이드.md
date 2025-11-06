# 🌐 Supabase 연결 가이드

## ⚠️ 네트워크 연결 문제

현재 **로컬 환경에서 Supabase PostgreSQL 서버에 직접 연결할 수 없습니다.**

```
Error: Can't reach database server at db.jdiqtblpbzukxcdqfmdd.supabase.co:5432
```

### 원인:
- 방화벽이 PostgreSQL 포트(5432) 차단
- 회사/학교 네트워크 제한
- VPN 설정 필요
- Supabase 프로젝트 일시중지 상태

## ✅ 해결 방법

### 방법 1: Supabase SQL Editor를 통한 마이그레이션 (권장)

로컬에서 직접 연결할 수 없지만, **Supabase 웹 인터페이스**는 사용 가능합니다!

#### 단계:

**1. Supabase 대시보드 접속**
- URL: https://jdiqtblpbzukxcdqfmdd.supabase.co
- 비밀번호: `dlwndrl131001`

**2. 프로젝트 상태 확인**
- 대시보드 상단에 **"Active"** 또는 **"Paused"** 표시 확인
- **Paused**면 → **"Resume Project"** 클릭
- 1-2분 대기 후 Active 상태로 변경

**3. SQL Editor에서 테이블 생성**
- 왼쪽 메뉴 → **SQL Editor**
- **+ New Query** 클릭
- `SUPABASE_마이그레이션.sql` 파일의 전체 내용 복사
- SQL Editor에 붙여넣기
- **Run** 버튼 클릭

**4. 성공 확인**
```
✅ 마이그레이션 완료!
users_table: 1
folders_table: 1
notes_table: 1
```

**5. Table Editor에서 확인**
- 왼쪽 메뉴 → **Table Editor**
- `users`, `folders`, `notes` 테이블이 보이면 성공!

**6. 앱에서 Supabase 사용**

`server/prisma/schema.prisma` 파일 수정:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

터미널에서:
```bash
cd server
npx prisma generate
npm run dev
```

### 방법 2: SQLite 계속 사용 (현재 작동 중)

**즉시 사용 가능!** 모든 기능이 정상 작동합니다.

#### 장점:
- ✅ 네트워크 문제 없음
- ✅ 빠른 성능
- ✅ 설정 불필요

#### 데이터 위치:
- `server/prisma/dev.db` 파일

#### 나중에 Supabase로 전환:
SQLite 데이터를 Supabase로 이동 가능 (별도 마이그레이션)

## 🎯 권장 사항

### 현재 상황:
1. **SQLite로 앱 사용** (즉시 가능)
2. **나중에 Supabase 전환** (네트워크 환경 개선 후)

### Supabase 전환이 필요한 경우:
1. Supabase SQL Editor에서 테이블 생성
2. schema.prisma를 postgresql로 변경
3. Prisma Client 재생성
4. 서버 재시작

## 📊 비교

| 항목 | SQLite | Supabase |
|------|--------|----------|
| 설정 | ✅ 즉시 가능 | ⚠️ 네트워크 설정 필요 |
| 성능 | ✅ 빠름 | 🌐 네트워크 의존 |
| 저장 위치 | 💾 로컬 파일 | ☁️ 클라우드 |
| 백업 | 📁 파일 복사 | ✅ 자동 |
| 접근성 | 💻 로컬만 | 🌍 어디서나 |

## 🚀 현재 앱 실행 중!

브라우저가 곧 자동으로 열립니다 (http://localhost:3000)

**SQLite로 모든 기능을 즉시 사용할 수 있습니다!**

