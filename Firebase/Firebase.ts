import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAs6-Gm1xEx_codYlHA24pW8ENBm9_pFD4",
  authDomain: "alarmalert-1b85b.firebaseapp.com",
  projectId: "alarmalert-1b85b",
  storageBucket: "alarmalert-1b85b.appspot.com",
  messagingSenderId: "1063751050407",
  appId: "1:1063751050407:web:ff8ef9a3954539d0e86782",
  measurementId: "G-Q380L1Q416"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
