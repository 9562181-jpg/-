# 메모 앱 ✨

React, TypeScript, Tailwind CSS, SQLite, Prisma ORM으로 만든 현대적이고 아름다운 메모 애플리케이션입니다.

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.2-38B2AC?logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![Prisma](https://img.shields.io/badge/Prisma-5.7.0-2D3748?logo=prisma)

## 🎨 주요 기능

### 🔐 인증 시스템
- **SQLite + Prisma ORM** 데이터베이스
- **JWT** 토큰 기반 인증
- **bcrypt** 비밀번호 암호화 (Salt rounds: 10)
- 이메일/비밀번호 기반 회원가입 및 로그인
- 사용자별 완전한 데이터 격리

### 📁 폴더 관리
- 폴더 생성 및 삭제
- 계층 구조 지원
- 특수 폴더: '모든 메모', '최근 삭제된 항목'
- 이모지 아이콘 기반 직관적 UI

### 📝 메모 관리
- 메모 생성, 수정, 삭제
- **자동 저장**: 사용자가 입력하는 즉시 자동으로 저장 (300ms 디바운싱)
- 첫 번째 줄이 자동으로 제목이 됨
- 생성/수정 날짜 자동 기록
- 카드 형식의 깔끔한 레이아웃

### ✨ 고급 기능
- **리치 텍스트 편집**: 굵게, 기울임, 밑줄
- **체크리스트**: 할 일 목록 작성
  - 엔터로 연속 추가
  - 빈 체크박스에서 엔터로 종료
  - 아래로 일렬 정렬
  - 그라데이션 배경
- **이미지 첨부**: 사진 추가 가능
- **정렬**: 최근 수정순, 생성 날짜순, 제목순
- **검색**: 모든 메모에서 키워드 검색
- **최근 메모 캐러셀**: 자동 슬라이드쇼

### 🗑️ 안전한 삭제
- 메모 삭제 시 '최근 삭제된 항목'으로 이동
- 복원 기능
- 영구 삭제 옵션

### 💾 데이터 저장
- **SQLite**: 파일 기반 경량 데이터베이스
- **Prisma ORM**: 타입 안전한 데이터베이스 접근
- **자동 저장**: 300ms 디바운싱으로 실시간 저장
- **데이터베이스 파일**: `server/prisma/dev.db`

### 🎨 밝은 분위기 디자인
- **파스텔 테마**: 핑크, 퍼플, 민트 등 밝은 색상
- **글래스모피즘 효과**: 반투명 유리 느낌
- **그라데이션**: 다채로운 색상 전환
- **부드러운 애니메이션**: float, fade-in, bounce
- **밝은 그림자**: 파스텔 톤의 그림자 효과
- 완전 반응형 디자인 (모바일/태블릿/데스크톱)

## 🚀 설치 및 실행

### 방법 1: 자동 실행 (권장)

```bash
# 1. 프론트엔드 패키지 설치
npm install

# 2. 백엔드 패키지 설치
cd server
npm install
cd ..

# 3. 전체 실행 (백엔드 + 프론트엔드)
npm run start:all
```

또는 Windows에서:
```bash
start_all.bat
```

### 방법 2: 수동 실행

**터미널 1 - 백엔드 서버:**
```bash
cd server
npm install
npm run dev
```

**터미널 2 - 프론트엔드:**
```bash
npm install
npm start
```

### 실행 확인

- **백엔드**: http://localhost:5000
- **프론트엔드**: http://localhost:3000

브라우저가 자동으로 열립니다!

### 빌드
```bash
npm run build
```

## 🛠 기술 스택

### 프론트엔드
- **React 18**: UI 프레임워크
- **TypeScript**: 타입 안정성
- **Tailwind CSS 3.3**: Utility-First CSS 프레임워크 + 파스텔 테마
- **React Router**: 라우팅

### 백엔드
- **Node.js + Express**: REST API 서버
- **SQLite**: 파일 기반 경량 데이터베이스
- **Prisma ORM**: 타입 안전한 데이터베이스 접근
- **JWT**: 토큰 기반 인증
- **bcrypt**: 비밀번호 암호화

## 📁 프로젝트 구조

```
memo/
├── src/                    # 프론트엔드 (React)
│   ├── api/
│   │   └── client.ts           # API 클라이언트
│   ├── components/
│   │   ├── AuthPage.tsx        # 로그인/회원가입 화면
│   │   ├── Carousel.tsx        # 최근 메모 캐러셀
│   │   ├── FolderList.tsx      # 폴더 목록 화면
│   │   ├── NoteList.tsx        # 메모 목록 화면
│   │   ├── NoteEditor.tsx      # 메모 편집 화면
│   │   └── SearchPage.tsx      # 검색 화면
│   ├── context/
│   │   ├── AppContext.tsx      # 전역 상태 관리
│   │   └── AuthContext.tsx     # 인증 상태 관리
│   ├── types/
│   │   └── index.ts            # TypeScript 타입
│   ├── utils/
│   │   └── storage.ts          # 유틸리티 함수
│   ├── styles/
│   │   └── index.css           # Tailwind 스타일
│   ├── App.tsx
│   └── index.tsx
├── server/                 # 백엔드 (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # 데이터베이스 스키마
│   │   ├── dev.db             # SQLite 데이터베이스
│   │   └── migrations/        # 마이그레이션 파일
│   ├── src/
│   │   ├── index.js           # Express 서버
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT 인증 미들웨어
│   │   └── routes/
│   │       ├── auth.js        # 인증 API
│   │       ├── notes.js       # 메모 API
│   │       └── folders.js     # 폴더 API
│   └── package.json
├── tailwind.config.js
├── package.json
└── start_all.bat          # 전체 실행 스크립트
```

## 📱 사용 방법

### 1. 회원가입 및 로그인
1. 앱 실행 → 로그인 페이지 표시
2. "회원가입" 탭에서 계정 생성:
   - 이름, 이메일, 비밀번호 입력
   - 비밀번호는 bcrypt로 암호화되어 저장
3. 회원가입 후 자동 로그인
4. 상단에 "SQLite + Prisma" 배지 표시

### 2. 메모 작성
1. **폴더 만들기**: 메인 화면에서 '새 폴더' 버튼 클릭
2. **메모 작성**: 폴더 선택 후 '새 메모' 버튼 클릭
3. **자동 저장**: 입력하는 즉시 자동으로 저장됨 (300ms)
4. **서식 적용**: 에디터 상단의 도구 모음 사용
5. **체크리스트**: 
   - ☑ 버튼으로 체크리스트 추가
   - 엔터로 다음 항목 추가
   - 빈 항목에서 엔터로 종료
6. **이미지 추가**: 📷 버튼으로 이미지 첨부
7. **검색**: 하단 네비게이션의 검색 아이콘 클릭

### 3. 사용자 전환
1. 로그아웃 클릭
2. 다른 계정으로 로그인 또는 새 계정 생성
3. 각 사용자는 완전히 독립된 메모 공간을 가짐

## ✨ Tailwind CSS 특징

### 사용된 주요 Utility Classes
- **레이아웃**: `flex`, `grid`, `container`, `mx-auto`
- **간격**: `p-4`, `m-2`, `gap-3`, `space-y-4`
- **크기**: `w-full`, `h-screen`, `max-w-7xl`
- **색상**: `bg-blue-600`, `text-white`, `border-gray-300`
- **효과**: `shadow-lg`, `rounded-xl`, `hover:shadow-2xl`
- **전환**: `transition-all`, `duration-300`, `transform`
- **반응형**: `sm:`, `md:`, `lg:`, `xl:` 브레이크포인트

### 커스텀 설정
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { ... },
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-in-out',
    },
  },
}
```

## 🎯 특징

### 백엔드
- ✅ **SQLite + Prisma ORM**: 타입 안전한 데이터베이스 접근
- ✅ **JWT 인증**: 토큰 기반 보안 인증
- ✅ **bcrypt 암호화**: 안전한 비밀번호 저장
- ✅ **RESTful API**: 표준 HTTP 메서드
- ✅ **사용자별 데이터 격리**: 완전한 데이터 분리

### 프론트엔드
- ✅ **완전한 CRUD 기능**: 생성, 조회, 수정, 삭제
- ✅ **자동 저장**: 300ms 디바운싱
- ✅ **완전 반응형**: Tailwind CSS
- ✅ **밝은 파스텔 테마**: 글래스모피즘 + 그라데이션
- ✅ **리치 텍스트 에디터**: 체크리스트, 이미지 지원
- ✅ **부드러운 애니메이션**: 모던한 UX
- ✅ **실시간 검색**: 즉시 결과 표시

## 📦 주요 패키지

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "typescript": "^4.9.5"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.2",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "react-scripts": "5.0.1"
  }
}
```

## 🌟 디자인 하이라이트

### 폴더 화면
- 그리드 레이아웃 (반응형)
- 호버 시 상승 효과 (`-translate-y-2`)
- 이모지 아이콘 (⭐📁)
- 모달 다이얼로그

### 메모 목록
- 카드 그리드 레이아웃
- 3줄 텍스트 클램프 (`line-clamp-3`)
- 날짜 배지 스타일
- 호버 시 그림자 확대

### 에디터
- 상단 고정 툴바 (`sticky top-0`)
- 체크리스트 그라데이션 (`bg-gradient-to-r`)
- 포커스 링 스타일 (`focus:ring-2`)
- 이미지 반응형 (`max-w-full`)

### 검색
- 실시간 검색 UI
- 아이콘 인풋 그룹
- 결과 카운트 배지
- 빈 상태 일러스트

## 💽 데이터베이스 정보

### SQLite 데이터베이스
- **위치**: `server/prisma/dev.db`
- **타입**: SQLite3 파일 기반 데이터베이스
- **크기**: 자동 증가 (메모에 따라)

### Prisma ORM
- **버전**: 5.7.0
- **클라이언트**: @prisma/client
- **마이그레이션**: `server/prisma/migrations/`

### 데이터 확인
```bash
# Prisma Studio 실행
cd server
npm run prisma:studio
```

http://localhost:5555 에서 GUI로 데이터 확인 가능

## 📚 추가 문서

- **`server/README.md`**: 백엔드 API 상세 문서
- **`SQLITE_PRISMA_GUIDE.md`**: 데이터베이스 가이드
- **`USER_GUIDE.md`**: 사용자 가이드

## 🔒 보안

### 비밀번호 보호
- bcrypt로 해시화 (Salt rounds: 10)
- 평문 비밀번호는 절대 저장 안됨

### JWT 토큰
- 7일 유효기간
- localStorage에 안전하게 저장
- 모든 API 요청에 자동 포함

### 데이터 격리
- 각 사용자는 자신의 데이터만 접근
- SQL 레벨에서 userId로 필터링
- Prisma의 타입 안전성 보장

## 📄 라이선스

MIT

---

Made with ❤️ using React + TypeScript + Tailwind CSS + SQLite + Prisma
