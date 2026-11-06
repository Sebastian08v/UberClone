import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCulFO6WzOrh7eYYqiEWyRCXfvpX-2Af7Y",
  authDomain: "uberclone-947a5.firebaseapp.com",
  projectId: "uberclone-947a5",
  storageBucket: "uberclone-947a5.firebasestorage.app",
  messagingSenderId: "662715450526",
  appId: "1:662715450526:web:005451123cbcf0277ea78f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);