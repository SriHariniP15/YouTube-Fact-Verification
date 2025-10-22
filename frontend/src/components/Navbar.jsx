import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- NEW FUNCTION TO SCROLL TO TOP ---
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // This creates a smooth scrolling effect
    });
  };

  return (
    <nav className="navbar">
      {/* ADDED the onClick handler to the Link */}
      <Link to="/" className="navbar-logo-link" onClick={handleScrollToTop}>
        <div className="navbar-logo">
          <img src="/logo2.png" alt="Logo" />
          <h1>YouTube Fact Verifier</h1>
        </div>
      </Link>

      <ul className="navbar-links">
        {!isAuthenticated ? (
          <li><Link to="/">Login / Signup</Link></li>
        ) : (
          <>
            <li>
              {/* Also add the onClick handler to the "Home" link */}
              <Link to="/" onClick={handleScrollToTop}>Home</Link>
            </li>
            <li>
              <a href="#about" onClick={handleScrollToAbout}>About</a>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;