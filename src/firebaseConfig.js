// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVDVolpCHMWq5NjY3fZDvirc6MO-pdFrE",
  authDomain: "ascend-c3234.firebaseapp.com",
  projectId: "ascend-c3234",
  storageBucket: "ascend-c3234.appspot.com",
  messagingSenderId: "135739512372",
  appId: "1:135739512372:web:889088084af719f1db1c61",
  measurementId: "G-Q0FL3TSC8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

import { getStorage } from "firebase/storage";

export const storage = getStorage(app);
export { app, database };