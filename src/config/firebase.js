import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBWPoE3H2axDYa0EHZuTEUDaDj82FrGoJU",
  authDomain: "student-ms-hackathon.firebaseapp.com",
  projectId: "student-ms-hackathon",
  storageBucket: "student-ms-hackathon.appspot.com",
  messagingSenderId: "428580276583",
  appId: "1:428580276583:web:4d64af72111dbc87ea87c2",
  measurementId: "G-JY9YW0TJ4R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);