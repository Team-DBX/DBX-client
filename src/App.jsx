import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";

function App() {
	return (
		<Routes>
			<Route path="/" exact element={<Login />} />
			<Route path="/login" element={<Login />} />
		</Routes>
	);
}

export default App;
