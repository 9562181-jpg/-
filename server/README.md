# 🔥 메모 앱 백엔드 서버

SQLite + Prisma ORM + Express로 구축된 RESTful API 서버입니다.

## 🛠 기술 스택

- **Express**: Node.js 웹 프레임워크
- **Prisma**: 차세대 ORM
- **SQLite**: 경량 데이터베이스
- **JWT**: JSON Web Token 인증
- **bcrypt**: 비밀번호 암호화

## 🚀 설치 및 실행

### 1. 패키지 설치
```bash
cd server
npm install
```

### 2. Prisma 마이그레이션
```bash
npm run prisma:migrate
```

데이터베이스 스키마를 생성하고 `dev.db` 파일이 생성됩니다.

### 3. 서버 실행
```bash
npm run dev
```

서버가 http://localhost:5000 에서 실행됩니다.

## 📋 API 엔드포인트

### 인증 API (`/api/auth`)

#### POST /api/auth/signup
회원가입

**요청:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "홍길동"
}
```

**응답:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "홍길동"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
로그인

**요청:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "홍길동"
  },
  "token": "jwt-token"
}
```

#### GET /api/auth/me
현재 사용자 정보 조회 (인증 필요)

**헤더:**
```
Authorization: Bearer {token}
```

**응답:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "홍길동"
  }
}
```

### 메모 API (`/api/notes`)

모든 엔드포인트는 인증이 필요합니다.

#### GET /api/notes
사용자의 모든 메모 조회

#### POST /api/notes
메모 생성

**요청:**
```json
{
  "folderId": "folder-uuid",
  "content": "메모 내용"
}
```

#### PUT /api/notes/:id
메모 수정

**요청:**
```json
{
  "content": "수정된 메모 내용"
}
```

#### DELETE /api/notes/:id
메모 삭제

#### PATCH /api/notes/:id/move
메모를 다른 폴더로 이동

**요청:**
```json
{
  "folderId": "target-folder-uuid"
}
```

### 폴더 API (`/api/folders`)

모든 엔드포인트는 인증이 필요합니다.

#### GET /api/folders
사용자의 모든 폴더 조회

#### POST /api/folders
폴더 생성

**요청:**
```json
{
  "name": "새 폴더",
  "parentId": null
}
```

#### PUT /api/folders/:id
폴더 이름 수정

**요청:**
```json
{
  "name": "수정된 폴더 이름"
}
```

#### DELETE /api/folders/:id
폴더 삭제 (포함된 메모는 휴지통으로 이동)

## 🔒 보안

### 비밀번호 암호화
- bcrypt를 사용하여 비밀번호를 해시화
- 평문 비밀번호는 절대 저장되지 않음

### JWT 인증
- 토큰 기반 인증
- 7일 유효기간
- 각 요청에 Bearer 토큰 포함

### 데이터 격리
- 각 사용자는 자신의 데이터만 접근 가능
- 모든 API에서 userId 검증

## 📦 Prisma 명령어

### 스키마 변경 후 마이그레이션
```bash
npm run prisma:migrate
```

### Prisma Client 재생성
```bash
npm run prisma:generate
```

### Prisma Studio (데이터베이스 GUI)
```bash
npm run prisma:studio
```

브라우저에서 http://localhost:5555 열기

## 🗄 데이터베이스 스키마

### User (사용자)
- id: UUID (PK)
- email: String (Unique)
- password: String (bcrypt 해시)
- displayName: String
- createdAt: DateTime
- updatedAt: DateTime

### Folder (폴더)
- id: UUID (PK)
- name: String
- parentId: String (nullable)
- isSpecial: Boolean
- userId: String (FK → User)
- createdAt: DateTime
- updatedAt: DateTime

### Note (메모)
- id: UUID (PK)
- content: String
- folderId: String (FK → Folder)
- userId: String (FK → User)
- createdAt: DateTime
- modifiedAt: DateTime

## 📁 디렉토리 구조

```
server/
├── prisma/
│   ├── schema.prisma      # Prisma 스키마 정의
│   ├── migrations/        # 마이그레이션 파일들
│   └── dev.db            # SQLite 데이터베이스
├── src/
│   ├── index.js          # 메인 서버 파일
│   ├── middleware/
│   │   └── auth.js       # JWT 인증 미들웨어
│   └── routes/
│       ├── auth.js       # 인증 API
│       ├── notes.js      # 메모 API
│       └── folders.js    # 폴더 API
└── package.json
```

## 🐛 문제 해결

### 포트 충돌
서버가 실행되지 않으면 5000 포트가 사용 중일 수 있습니다.
`.env` 파일에서 PORT를 변경하세요.

### 데이터베이스 리셋
```bash
rm prisma/dev.db
npm run prisma:migrate
```

### Prisma Client 오류
```bash
npm run prisma:generate
```

## 📚 추가 자료

- [Prisma 문서](https://www.prisma.io/docs)
- [Express 문서](https://expressjs.com/)
- [JWT 문서](https://jwt.io/)

