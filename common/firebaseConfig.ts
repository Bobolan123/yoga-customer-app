import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQMOOzBlO_M0Uiur28p_vIuz9xBOLxVXQ",
  authDomain: "yogaclassapp-3d478.firebaseapp.com",
  projectId: "yogaclassapp-3d478",
  storageBucket: "yogaclassapp-3d478.appspot.com",
  messagingSenderId: "641681052789",
  appId: "1:641681052789:android:a53e3efa0968321ce7143c",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
