import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2sv9ay3Ey5K7Jzvf_7yP4Gu_mF0eS4LM",
  authDomain: "team-dbx.firebaseapp.com",
  projectId: "team-dbx",
  storageBucket: "team-dbx.appspot.com",
  messagingSenderId: "520693199073",
  appId: "1:520693199073:web:a71149a3d8ee861f2dc7a0",
  measurementId: "G-CTWCXQ9S23",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
