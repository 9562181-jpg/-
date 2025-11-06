import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정
// 실제 프로젝트에서는 환경 변수로 관리하는 것이 좋습니다
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Authentication 및 Firestore 인스턴스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

