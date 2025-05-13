import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, ref, set, get, update} from 'firebase/database';

// This configuration should be replaced with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCS_UutaEdL1O5fcI0r4qUmvPX6t2PadIg",
  authDomain: "excaliburscouting-6738e.firebaseapp.com",
  databaseURL: "https://excaliburscouting-6738e-default-rtdb.firebaseio.com",
  projectId: "excaliburscouting-6738e",
  storageBucket: "excaliburscouting-6738e.firebasestorage.app",
  messagingSenderId: "1006512770349",
  appId: "1:1006512770349:web:6d457e11718f00237b17a4",
  measurementId: "G-CYR4LETD6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {getDatabase, app, db, auth, onValue, ref , set, get, update};