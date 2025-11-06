# 🔥 Firebase 설정 가이드

메모 앱에서 회원가입, 로그인, 데이터베이스 기능을 사용하려면 Firebase 설정이 필요합니다.

## 📋 설정 단계

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속합니다
2. "프로젝트 추가" 버튼을 클릭합니다
3. 프로젝트 이름을 입력하고 생성합니다

### 2. Firebase 웹 앱 등록

1. Firebase 프로젝트 설정 페이지로 이동합니다
2. "앱 추가" → "웹" 아이콘을 선택합니다
3. 앱 닉네임을 입력하고 등록합니다
4. Firebase SDK 구성 정보가 표시됩니다

### 3. Authentication 활성화

1. Firebase Console에서 "Authentication" 메뉴를 선택합니다
2. "Sign-in method" 탭을 클릭합니다
3. "이메일/비밀번호" 제공업체를 활성화합니다

### 4. Firestore Database 생성

1. Firebase Console에서 "Firestore Database" 메뉴를 선택합니다
2. "데이터베이스 만들기" 버튼을 클릭합니다
3. 테스트 모드 또는 프로덕션 모드를 선택합니다
   - **개발용**: 테스트 모드 선택
   - **배포용**: 프로덕션 모드 선택 후 보안 규칙 설정

### 5. Firebase 구성 정보 업데이트

`src/firebase/config.ts` 파일을 열고 다음 정보를 업데이트합니다:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // Firebase SDK에서 제공하는 API Key
  authDomain: "YOUR_AUTH_DOMAIN",      // 예: your-project.firebaseapp.com
  projectId: "YOUR_PROJECT_ID",        // 프로젝트 ID
  storageBucket: "YOUR_STORAGE_BUCKET", // 예: your-project.appspot.com
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Messaging Sender ID
  appId: "YOUR_APP_ID"                 // App ID
};
```

## 🔒 Firestore 보안 규칙 (권장)

배포 전에 다음 보안 규칙을 설정하는 것이 좋습니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 데이터만 읽고 쓸 수 있음
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## ✅ 설정 완료 확인

1. 앱을 실행합니다: `npm start`
2. 회원가입 페이지가 표시되는지 확인합니다
3. 새 계정을 만들고 로그인해봅니다
4. 메모를 생성하고 저장되는지 확인합니다

## 🎨 현재 적용된 기능

### ✨ 밝은 분위기의 디자인
- 파스텔톤 색상 팔레트
- 글래스모피즘 효과
- 그라데이션 버튼 및 배경
- 부드러운 애니메이션

### 🔐 인증 기능
- 이메일/비밀번호 회원가입
- 로그인/로그아웃
- 사용자 프로필 표시

### 💾 데이터베이스 연동
- Firestore를 통한 실시간 데이터 동기화
- 사용자별 메모 분리 저장
- 폴더 및 메모 자동 저장

## 🆘 문제 해결

### Firebase 초기화 오류
- Firebase 구성 정보가 정확한지 확인하세요
- Firebase 프로젝트가 생성되었는지 확인하세요

### 로그인 실패
- Authentication이 활성화되었는지 확인하세요
- 이메일/비밀번호 제공업체가 활성화되었는지 확인하세요

### 데이터 저장 안됨
- Firestore Database가 생성되었는지 확인하세요
- 보안 규칙이 너무 엄격하지 않은지 확인하세요

## 📚 추가 자료

- [Firebase 문서](https://firebase.google.com/docs)
- [Firestore 시작하기](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

