import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

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

// Firebase 설정 여부 확인
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         firebaseConfig.projectId !== "YOUR_PROJECT_ID";
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Firebase 초기화 (설정이 완료된 경우에만)
try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase가 성공적으로 초기화되었습니다.');
  } else {
    console.warn('⚠️ Firebase 설정이 완료되지 않았습니다. FIREBASE_SETUP.md 파일을 참고하여 설정해주세요.');
    console.warn('💡 현재는 로컬 스토리지 모드로 실행됩니다.');
  }
} catch (error) {
  console.error('❌ Firebase 초기화 실패:', error);
  console.warn('💡 로컬 스토리지 모드로 실행됩니다.');
}

// Authentication 및 Firestore 인스턴스 내보내기
export { auth, db, app };
export { isFirebaseConfigured };

