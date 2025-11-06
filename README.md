# 메모 앱 ✨

React, TypeScript, Tailwind CSS로 만든 현대적이고 아름다운 메모 애플리케이션입니다.

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.2-38B2AC?logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript)

## 🎨 주요 기능

### 🔐 인증 시스템
- **Firebase Authentication** 통합
- 이메일/비밀번호 기반 회원가입 및 로그인
- 사용자별 데이터 분리
- 로컬 모드 지원 (Firebase 설정 없이도 사용 가능)

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

### 💾 데이터 저장 (이중 모드)
- **Firebase 모드**: Firestore 클라우드 동기화
- **로컬 모드**: 브라우저 로컬 스토리지 (Firebase 설정 없이 사용 가능)
- 자동 Fallback 시스템

### 🎨 밝은 분위기 디자인
- **파스텔 테마**: 핑크, 퍼플, 민트 등 밝은 색상
- **글래스모피즘 효과**: 반투명 유리 느낌
- **그라데이션**: 다채로운 색상 전환
- **부드러운 애니메이션**: float, fade-in, bounce
- **밝은 그림자**: 파스텔 톤의 그림자 효과
- 완전 반응형 디자인 (모바일/태블릿/데스크톱)

## 🚀 설치 및 실행

### 1. 패키지 설치
```bash
npm install
```

### 2. Firebase 설정 (선택 사항)

**로컬 모드로 바로 사용 가능!** Firebase 설정 없이도 브라우저 로컬 스토리지를 사용하여 메모를 저장할 수 있습니다.

클라우드 동기화를 원하시면:
1. `FIREBASE_SETUP.md` 파일을 참고하여 Firebase 프로젝트를 생성하세요
2. `src/firebase/config.ts` 파일에서 Firebase 구성 정보를 업데이트하세요

### 3. 개발 서버 실행
```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인할 수 있습니다.

- **로컬 모드**: Firebase 설정이 없으면 자동으로 로컬 스토리지 모드로 실행됩니다
- **Firebase 모드**: Firebase 설정 시 클라우드 동기화가 활성화됩니다

### 4. 빌드
```bash
npm run build
```

## 🛠 기술 스택

- **React 18**: UI 프레임워크
- **TypeScript**: 타입 안정성
- **Tailwind CSS 3.3**: Utility-First CSS 프레임워크 + 파스텔 테마
- **React Router**: 라우팅
- **Firebase**: 인증 및 데이터베이스
  - Firebase Authentication (이메일/비밀번호)
  - Cloud Firestore (NoSQL 데이터베이스)
- **Local Storage**: 로컬 모드 데이터 영속성

## 📁 프로젝트 구조

```
src/
├── components/        # React 컴포넌트
│   ├── AuthPage.tsx      # 로그인/회원가입 화면
│   ├── Carousel.tsx      # 최근 메모 캐러셀
│   ├── FolderList.tsx    # 폴더 목록 화면
│   ├── NoteList.tsx      # 메모 목록 화면
│   ├── NoteEditor.tsx    # 메모 편집 화면 (리치 에디터)
│   └── SearchPage.tsx    # 검색 화면
├── context/           # Context API
│   ├── AppContext.tsx    # 전역 상태 관리
│   └── AuthContext.tsx   # 인증 상태 관리
├── firebase/          # Firebase 설정
│   └── config.ts         # Firebase 초기화
├── types/             # TypeScript 타입 정의
│   └── index.ts
├── utils/             # 유틸리티 함수
│   └── storage.ts        # 로컬/Firebase 스토리지 관리
├── styles/            # CSS 스타일
│   └── index.css         # Tailwind + 커스텀 스타일
├── App.tsx            # 메인 앱 컴포넌트
└── index.tsx          # 진입점
tailwind.config.js     # Tailwind 설정 (파스텔 테마)
postcss.config.js      # PostCSS 설정
FIREBASE_SETUP.md      # Firebase 설정 가이드
```

## 📱 사용 방법

### 로컬 모드 (Firebase 설정 없음)
1. 앱 실행 시 자동으로 로컬 사용자로 로그인됨
2. 상단에 "로컬 모드" 배지 표시
3. 모든 데이터는 브라우저 로컬 스토리지에 저장

### Firebase 모드
1. **회원가입/로그인**: Firebase 설정 완료 후 계정 생성
2. **사용자별 데이터**: 로그인한 사용자의 메모만 표시
3. **클라우드 동기화**: 모든 메모가 Firestore에 저장

### 일반 사용법
1. **폴더 만들기**: 메인 화면에서 '새 폴더' 버튼 클릭
2. **메모 작성**: 폴더 선택 후 '새 메모' 버튼 클릭
3. **자동 저장**: 입력하는 즉시 자동으로 저장됨
4. **서식 적용**: 에디터 상단의 도구 모음 사용
5. **체크리스트**: 
   - ☑ 버튼으로 체크리스트 추가
   - 엔터로 다음 항목 추가
   - 빈 항목에서 엔터로 종료
6. **이미지 추가**: 📷 버튼으로 이미지 첨부
7. **검색**: 하단 네비게이션의 검색 아이콘 클릭

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

- ✅ 완전한 CRUD 기능
- ✅ 자동 저장 (300ms 디바운싱)
- ✅ 완전 반응형 디자인 (Tailwind)
- ✅ Utility-First CSS 접근
- ✅ 이모지 기반 직관적 UI
- ✅ 부드러운 애니메이션 & 트랜지션
- ✅ 로컬 데이터 영속성
- ✅ 실시간 제목 동기화
- ✅ 안전한 삭제 및 복원
- ✅ 다크 모드 준비 완료

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

## 📄 라이선스

MIT

---

Made with ❤️ using React + TypeScript + Tailwind CSS
