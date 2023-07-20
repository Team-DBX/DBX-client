import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase-config";
import Header from "./components/Header";
import Login from "./components/Login";

function App() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  async function handleGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const data = await signInWithPopup(auth, provider);

      setUserData(data._tokenResponse);
    } catch (err) {
      navigate("/login");
    }
  }

  useEffect(() => {
    const authenticate = getAuth();

    onAuthStateChanged(authenticate, user => {
      if (user) {
        setUserEmail(user.email);
      }
    });
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              handleGoogleLogin={handleGoogleLogin}
              userData={userData}
              userEmail={userEmail}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
