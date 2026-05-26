import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 환경변수에 실수로 공백/줄바꿈이 섞여도 안전하도록 trim 처리
const env = (v?: string) => v?.trim();

const firebaseConfig = {
  apiKey: env(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: env(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: env(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: env(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: env(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: env(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

// 개발 중 Fast Refresh로 앱이 중복 초기화되는 것을 방지
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
