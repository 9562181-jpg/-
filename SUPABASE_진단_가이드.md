# 🔍 Supabase 연결 진단 가이드

## ✅ 수정 완료된 항목

### 1. SSL 설정 추가 ✅
```
이전: postgresql://postgres:...@host:5432/postgres
현재: postgresql://postgres:...@host:6543/postgres?sslmode=require&pgbouncer=true
```

### 2. 포트 변경 ✅
```
이전: 5432 (직접 연결)
현재: 6543 (PgBouncer - Supabase 권장)
```

### 3. DIRECT_URL 추가 ✅
```
DATABASE_URL  → 6543 (앱 쿼리용)
DIRECT_URL    → 5432 (Prisma 마이그레이션용)
```

### 4. Prisma Schema 업데이트 ✅
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // ← 추가됨
}
```

---

## ❌ 현재 문제: "Can't reach database server"

### 네트워크 연결 실패 원인

#### 🔴 1순위: **Supabase 프로젝트 일시중지**

**Supabase 무료 플랜은 7일간 활동 없으면 자동 일시중지됩니다!**

##### ✅ 해결 방법:
1. **https://jdiqtblpbzukxcdqfmdd.supabase.co** 접속
2. 로그인
3. 대시보드 상단에서 프로젝트 상태 확인
4. **"Paused"** 또는 **"일시중지됨"** 표시 확인
5. **"Resume Project"** 또는 **"프로젝트 재개"** 버튼 클릭
6. 1-2분 대기
7. **"Active"** 상태 확인

#### 🟡 2순위: 로컬 네트워크/방화벽 차단

**회사, 학교, 카페 네트워크는 데이터베이스 포트를 차단할 수 있습니다.**

##### 진단 방법:

**Windows PowerShell에서 테스트:**
```powershell
# 6543 포트 테스트
Test-NetConnection -ComputerName db.jdiqtblpbzukxcdqfmdd.supabase.co -Port 6543

# 5432 포트 테스트
Test-NetConnection -ComputerName db.jdiqtblpbzukxcdqfmdd.supabase.co -Port 5432
```

##### 결과 해석:
```
TcpTestSucceeded : True  → 포트 열림 (정상)
TcpTestSucceeded : False → 포트 차단됨 (방화벽 문제)
```

##### ✅ 해결 방법:
- VPN 사용 중이면 **끄기**
- 다른 네트워크(모바일 핫스팟 등)로 변경
- 회사/학교 네트워크라면 IT 관리자에게 포트 개방 요청

#### 🟢 3순위: Supabase IP 화이트리스트 설정

**Supabase 기본 설정은 모든 IP 허용이지만, 수동으로 제한했을 수 있습니다.**

##### ✅ 확인 방법:
1. Supabase Dashboard → **Settings** → **Database**
2. **Network Restrictions** 섹션 찾기
3. IP 화이트리스트 확인
   - 비어있음 → 모든 IP 허용 (정상)
   - 리스트 있음 → **1.228.225.19** 추가 필요

---

## 🎯 단계별 해결 프로세스

### Step 1: Supabase 프로젝트 상태 확인 (필수!)

```
1. https://jdiqtblpbzukxcdqfmdd.supabase.co 접속
2. 프로젝트 상태가 "Active"인지 확인
3. "Paused"면 → "Resume Project" 클릭
```

### Step 2: 네트워크 포트 테스트

```powershell
Test-NetConnection -ComputerName db.jdiqtblpbzukxcdqfmdd.supabase.co -Port 6543
```

**결과가 False면 → 로컬 네트워크/방화벽 문제**

### Step 3: 연결 재시도

```bash
cd server
node test-supabase-ssl.js
```

**성공 시 출력:**
```
✅ Supabase PostgreSQL 연결 성공! (SSL 포함)
📊 데이터베이스 확인 중...
  - Users: 0명
  - Folders: 0개
  - Notes: 0개
🎉 모든 테스트 통과! Supabase 완벽 연결!
```

### Step 4: 앱 실행

```bash
cd ..
npm run start:all
```

---

## 📋 체크리스트

프로젝트가 연결되지 않을 때 순서대로 확인:

- [ ] **Supabase 프로젝트가 Active 상태인가?** (가장 중요!)
- [ ] **로컬 방화벽이 6543/5432 포트를 허용하는가?**
- [ ] **VPN을 사용 중인가? (끄기)**
- [ ] **회사/학교 네트워크가 아닌가?**
- [ ] **Supabase IP 화이트리스트에 내 IP가 있는가?**
- [ ] **.env 파일에 SSL 설정이 있는가?** (이미 수정됨 ✅)
- [ ] **포트가 6543인가?** (이미 수정됨 ✅)

---

## 🚨 최종 확인 사항

### 현재 .env 설정 (정확함 ✅)
```env
DATABASE_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://postgres:dlwndrl131001@db.jdiqtblpbzukxcdqfmdd.supabase.co:5432/postgres?sslmode=require"
```

### 호스트 주소 (정확함 ✅)
- Host: `db.jdiqtblpbzukxcdqfmdd.supabase.co`
- localhost 아님 ✅
- .supabase.co 도메인 ✅

### IP 정보 (확인됨 ✅)
- 내 IP: `1.228.225.19`

---

## 🎊 다음 단계

**1. Supabase 대시보드에서 프로젝트 Resume하기**

**2. PowerShell에서 포트 테스트:**
```powershell
Test-NetConnection -ComputerName db.jdiqtblpbzukxcdqfmdd.supabase.co -Port 6543
```

**3. 연결 테스트:**
```bash
cd server
node test-supabase-ssl.js
```

**4. 성공 시 앱 실행:**
```bash
cd ..
npm run start:all
```

---

**가장 가능성 높은 원인: Supabase 프로젝트 일시중지 상태** 🔴

**대시보드에서 Resume Project만 클릭하면 해결될 가능성이 매우 높습니다!** 🎯

