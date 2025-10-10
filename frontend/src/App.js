import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutPage from "./components/About";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Verify from "./components/Verify";

import "./App.css";

function HomePage() {
  return (
    <>
      <HeroSection />
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {/* Pass authentication state to Navbar */}
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <Routes>
        {/* Show Login first if not authenticated */}
        {!isAuthenticated ? (
          <>
            <Route
              path="/"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/signup" element={<Signup />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/verify" element={<Verify />} />
          </>
        )}
      </Routes>

      {isAuthenticated && <Footer />}
    </Router>
  );
}

export default App;
