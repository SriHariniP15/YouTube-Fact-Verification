import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <ul className="footer-links">
        <li><a href="/about">About</a></li>
        <li><a href="https://github.com/yourrepo" target="_blank" rel="noopener noreferrer">GitHub</a></li>
      </ul>
      <p className="footer-disclaimer">Disclaimer: For educational purposes only.</p>
      <p className="footer-copy">© 2025 FactCheck. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
