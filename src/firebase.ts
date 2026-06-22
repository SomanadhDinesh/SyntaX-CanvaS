import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0337627624",
  appId: "1:343968314950:web:229a0cfb9262944d65fc47",
  apiKey: "AIzaSyDSp_X4WKp8uNyHUL6yjSGgVCgxnsQGphY",
  authDomain: "gen-lang-client-0337627624.firebaseapp.com",
  storageBucket: "gen-lang-client-0337627624.firebasestorage.app",
  messagingSenderId: "343968314950",
  measurementId: ""
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
