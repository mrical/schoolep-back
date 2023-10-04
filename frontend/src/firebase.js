// import functions of firebase for inicialition
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

//Paste here your own firebaseConfig
const firebaseConfig = {
  apiKey: 'AIzaSyD_DOWWIMFPQ20tA7fQB4aZwGy6qzKYSPY',
  authDomain: 'net-ninja-firestore-efec2.firebaseapp.com',
  databaseURL: 'https://net-ninja-firestore-efec2.firebaseio.com',
  projectId: 'net-ninja-firestore-efec2',
  storageBucket: 'net-ninja-firestore-efec2.appspot.com',
  messagingSenderId: '495744816837',
  appId: '1:495744816837:web:caf69470f4e2651004c2ac',
  measurementId: 'G-QCHQGFX4Z4',
  databaseURL: 'https://net-ninja-firestore-efec2.firebaseio.com/',
};

//inicialition function
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rdb = getDatabase(app);
const sdb = getStorage(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
// const projectManagement = firebase.projectManagement();
export { db, rdb, sdb, auth, analytics };
export default app;
