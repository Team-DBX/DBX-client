import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./main.css";
import { UserContextProvider } from "../contexts/UserContext";
import { CategoryContextProvider } from "../contexts/CategoryContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <CategoryContextProvider>
          <App />
        </CategoryContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
