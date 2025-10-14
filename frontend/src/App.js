// src/App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./pages/HomePage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Or use AuthContext

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      
      {/* ADDED className="main-content" TO ADD PADDING FOR THE FIXED NAVBAR */}
      <main className="main-content">
        <Routes>
          {/* If authenticated, HomePage is the default, else show Login */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <HomePage /> : <Login setIsAuthenticated={setIsAuthenticated} />
            } 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
      
      {isAuthenticated && <Footer />}
    </Router>
  );
}

export default App;