import { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserContext from "../contexts/UserContext";
import Header from "./components/Header";
import Login from "./components/Login";
import InitialResourceForm from "./components/ResourceForms/InitialResourceForm";
import ResourceList from "./components/ResourceList";
import { auth } from "../config/firebase-config";
import ResourceVersionForm from "./components/ResourceForms/ResourceVersionForm";
import ResourceForm from "./components/ResourceForms/ResourceForm";
import ResourceVersionList from "./components/ResourceVersionList";

function App() {
  const { userEmail, setUserCredentials } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
        setUserCredentials(user.accessToken, user.email);
        navigate("/resource-list/BrandLogo");
      } else {
        setIsLoggedIn(false);
        navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, setUserCredentials]);

  return (
    <div className="relative bg-gradient-to-b from-stone-300 via-stone-300 to-black">
      <Header />
      <main className="flex items-center justify-center h-screen">
        <Routes>
          <Route
            path="/"
            element={
              userEmail ? (
                <Navigate to="/resource-list/BrandLogo" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/initial-resource-form"
            element={<InitialResourceForm />}
          />
          <Route path="/new-resource-form" element={<ResourceForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resource-list/:category" element={<ResourceList />} />
          <Route
            path="/new-resource-version-form"
            element={<ResourceVersionForm />}
          />
          <Route
            path="/resource-version-list"
            element={<ResourceVersionList />}
          />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
