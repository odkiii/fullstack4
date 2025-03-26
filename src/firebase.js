import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAg3lUD-jlXsLJlXQKKknIjQFnwAFdK0hY",
  authDomain: "reactfullstack5.firebaseapp.com",
  projectId: "reactfullstack5",
  storageBucket: "reactfullstack5.firebasestorage.app",
  messagingSenderId: "437580608416",
  appId: "1:437580608416:web:2420932382bd8c4de82ac5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 