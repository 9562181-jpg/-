# 💽 SQLite + Prisma 데이터베이스 가이드

## 🎯 개요

이 메모 앱은 **SQLite** 데이터베이스와 **Prisma ORM**을 사용하여 데이터를 관리합니다.

### ✨ 주요 특징

- **SQLite**: 파일 기반 경량 데이터베이스
- **Prisma**: 타입 안전한 ORM
- **Express API**: RESTful API 서버
- **JWT 인증**: 토큰 기반 인증
- **bcrypt**: 비밀번호 암호화

## 🚀 빠른 시작

### 1. 백엔드 서버 설정

```bash
# 1. 서버 폴더로 이동
cd server

# 2. 패키지 설치
npm install

# 3. 데이터베이스 마이그레이션 (이미 완료됨)
npm run prisma:migrate

# 4. 서버 실행
npm run dev
```

서버가 http://localhost:5000 에서 실행됩니다.

### 2. 프론트엔드 실행

새 터미널 창에서:

```bash
# 프로젝트 루트에서
npm start
```

브라우저가 http://localhost:3000 에서 열립니다.

### 3. 한 번에 실행 (권장)

```bash
# 프로젝트 루트에서
npm run start:all
```

또는 Windows에서:

```bash
start_all.bat
```

백엔드와 프론트엔드가 동시에 실행됩니다!

## 📊 데이터베이스 구조

### User (사용자 테이블)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- bcrypt 해시
  displayName TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Folder (폴더 테이블)
```sql
CREATE TABLE folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parentId TEXT,
  isSpecial BOOLEAN DEFAULT 0,
  userId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Note (메모 테이블)
```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  content TEXT DEFAULT '',
  folderId TEXT NOT NULL,
  userId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (folderId) REFERENCES folders(id) ON DELETE CASCADE
);
```

## 🔐 보안 기능

### 1. 비밀번호 암호화 (bcrypt)
- Salt rounds: 10
- 평문 비밀번호는 절대 저장하지 않음
- 해시된 비밀번호만 DB에 저장

### 2. JWT 인증
- 토큰 유효기간: 7일
- 모든 API 요청에 Bearer 토큰 필요
- 토큰은 localStorage에 저장

### 3. 사용자 데이터 격리
- 모든 API에서 userId 검증
- Cascade 삭제로 데이터 정합성 유지
- SQL Injection 방지 (Prisma 자동 처리)

## 🔧 Prisma 명령어

### 스키마 수정 후 마이그레이션
```bash
cd server
npm run prisma:migrate
```

### Prisma Studio 실행 (데이터베이스 GUI)
```bash
cd server
npm run prisma:studio
```

브라우저에서 http://localhost:5555 로 접속하면 GUI에서 데이터를 확인/수정할 수 있습니다.

### Prisma Client 재생성
```bash
cd server
npm run prisma:generate
```

## 📝 회원별 CRUD 작동 원리

### 1. 회원가입
```javascript
// 1. 비밀번호 해시
const hashedPassword = await bcrypt.hash(password, 10);

// 2. 사용자 생성
const user = await prisma.user.create({
  data: { email, password: hashedPassword, displayName }
});

// 3. 기본 폴더 생성 (모든 메모, 최근 삭제된 항목)
await prisma.folder.createMany({ ... });

// 4. JWT 토큰 발급
const token = jwt.sign({ userId: user.id, email }, JWT_SECRET);
```

### 2. 로그인
```javascript
// 1. 사용자 찾기
const user = await prisma.user.findUnique({ where: { email } });

// 2. 비밀번호 확인
const isValid = await bcrypt.compare(password, user.password);

// 3. JWT 토큰 발급
const token = jwt.sign({ userId: user.id, email }, JWT_SECRET);
```

### 3. 메모 생성 (인증 필요)
```javascript
// 1. JWT 토큰 검증
const decoded = jwt.verify(token, JWT_SECRET);

// 2. 사용자의 메모 생성
const note = await prisma.note.create({
  data: {
    content,
    folderId,
    userId: decoded.userId  // 토큰에서 추출한 사용자 ID
  }
});
```

### 4. 메모 조회 (사용자별 필터링)
```javascript
// 현재 로그인한 사용자의 메모만 조회
const notes = await prisma.note.findMany({
  where: {
    userId: req.user.userId  // 미들웨어에서 설정
  }
});
```

## 🎯 데이터 분리 보장

### Prisma 레벨에서 보장
```javascript
// ❌ 다른 사용자의 메모는 절대 조회 불가
const notes = await prisma.note.findMany({
  where: {
    userId: "user-A-id"  // 항상 현재 사용자 ID로 필터링
  }
});

// ✅ user-B는 user-A의 메모를 볼 수 없음
```

### Cascade 삭제
```javascript
// 사용자 삭제 시 모든 관련 데이터 자동 삭제
onDelete: Cascade

User 삭제 → Folders 자동 삭제 → Notes 자동 삭제
```

## 🧪 테스트

### 1. 헬스 체크
```bash
curl http://localhost:5000/api/health
```

### 2. 회원가입 테스트
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","displayName":"테스트"}'
```

### 3. 로그인 테스트
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### 4. 메모 조회 테스트
```bash
curl http://localhost:5000/api/notes \
  -H "Authorization: Bearer {your-token}"
```

## 📈 성능 최적화

### 인덱스
- userId에 인덱스 추가 (빠른 사용자별 조회)
- folderId에 인덱스 추가 (빠른 폴더별 조회)

### 트랜잭션
- Prisma의 트랜잭션 기능 활용
- 데이터 정합성 보장

## 🔄 마이그레이션 히스토리

### 20251106070222_init
- 초기 스키마 생성
- User, Folder, Note 테이블 생성
- 관계 및 인덱스 설정

## 💡 팁

### Prisma Studio 활용
데이터를 GUI에서 확인하고 싶다면:
```bash
cd server
npm run prisma:studio
```

### 데이터베이스 백업
```bash
# dev.db 파일을 복사하여 백업
cp server/prisma/dev.db server/prisma/dev.db.backup
```

### 프로덕션 배포
1. SQLite 대신 PostgreSQL 또는 MySQL 사용 권장
2. `.env` 파일에서 DATABASE_URL 변경
3. JWT_SECRET을 안전한 값으로 변경

## ✅ 완료 체크리스트

- [x] SQLite 데이터베이스 생성
- [x] Prisma 스키마 정의
- [x] 마이그레이션 완료
- [x] Express API 서버 구축
- [x] JWT 인증 구현
- [x] bcrypt 비밀번호 암호화
- [x] 사용자별 데이터 격리
- [x] RESTful API 엔드포인트

## 🎉 이제 사용할 준비가 되었습니다!

서버를 실행하고 브라우저에서 메모 앱을 즐기세요!

