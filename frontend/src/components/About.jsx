import React from "react";
import "./About.css";
import { FaBolt, FaUsers, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

function About() {
  return (
    <div className="about-container">
      {/* About Section */}
      <section className="about-intro">
        <h1>About YouTube Fact Verifier</h1>
        <p>
          Our mission is to combat misinformation by providing instant, 
          AI-powered fact-checking for YouTube content. We help viewers make 
          informed decisions by verifying claims against trusted sources.
        </p>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="cards-grid">
          <div className="card">
            <h3>1</h3>
            <p><b>Paste URL</b><br />Submit any YouTube video link to begin the analysis process.</p>
          </div>
          <div className="card">
            <h3>2</h3>
            <p><b>Extract Claims</b><br />AI analyzes transcripts and descriptions to identify factual claims.</p>
          </div>
          <div className="card">
            <h3>3</h3>
            <p><b>Verify Facts</b><br />Cross-reference claims with fact-checking APIs and trusted databases.</p>
          </div>
          <div className="card">
            <h3>4</h3>
            <p><b>Show Results</b><br />Present clear, color-coded results with sources and confidence scores.</p>
          </div>
        </div>
      </section>

      {/* Understanding Results */}
      <section className="results">
        <h2>Understanding Results</h2>
        <div className="cards-grid">
          <div className="card success">
            <FaCheckCircle className="icon success-icon" />
            <h3>Verified ✅</h3>
            <p>Claims supported by credible sources and fact-checking organizations. High confidence score indicates strong evidence.</p>
          </div>
          <div className="card danger">
            <span className="icon danger-icon">❌</span>
            <h3>False/Misleading</h3>
            <p>Claims contradicted by reliable sources or identified as misinformation by fact-checkers. Exercise caution.</p>
          </div>
          <div className="card warning">
            <span className="icon warning-icon">⚠️</span>
            <h3>Unverified</h3>
            <p>Claims that couldn’t be verified due to lack of sources or inconclusive evidence. Requires further research.</p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="key-features">
        <h2>Key Features</h2>
        <div className="cards-grid">
          <div className="card">
            <FaBolt className="icon feature-icon" />
            <h3>Real-Time Analysis</h3>
            <ul>
              <li>Instant fact-checking using advanced NLP</li>
              <li>YouTube API integration for transcript access</li>
              <li>Multiple fact-checking database queries</li>
              <li>Confidence scoring algorithm</li>
            </ul>
          </div>
          <div className="card">
            <FaUsers className="icon feature-icon" />
            <h3>Community Features</h3>
            <ul>
              <li>User rating system for accuracy feedback</li>
              <li>Personal verification history</li>
              <li>Trending misinformation alerts</li>
              <li>Shareable fact-check reports</li>
            </ul>
          </div>
          <div className="card">
            <FaShieldAlt className="icon feature-icon" />
            <h3>Trusted Sources</h3>
            <ul>
              <li>Google Fact Check Tools API</li>
              <li>Partner verification database</li>
              <li>Cross-referenced reports</li>
              <li>Reliable academic sources</li>
            </ul>
          </div>
          <div className="card">
            <FaCheckCircle className="icon feature-icon" />
            <h3>Privacy & Security</h3>
            <ul>
              <li>No personal data collection</li>
              <li>Secure API connections</li>
              <li>End-to-end encrypted results</li>
              <li>GDPR compliant design</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Important Limitations */}
      <section className="limitations">
        <h2>Important Limitations</h2>
        <div className="limitations-box">
          <ul>
            <li>Accuracy depends on availability of transcripts/captions</li>
            <li>Some claims may be too recent for fact-checking databases</li>
            <li>Complex or nuanced statements may be difficult to verify automatically</li>
            <li>Results should supplement, not replace, critical thinking</li>
            <li>Always cross-reference important information with multiple sources</li>
          </ul>
        </div>
      </section>

      {/* Resources Section (merged from Resources.jsx) */}
      <section className="resources">
        <h2>Helpful Resources</h2>
        <p>Here are some trusted sites for fact-checking and media literacy:</p>
        <ul>
          <li><a href="https://www.snopes.com/" target="_blank" rel="noopener noreferrer">Snopes</a></li>
          <li><a href="https://www.factcheck.org/" target="_blank" rel="noopener noreferrer">FactCheck.org</a></li>
          <li><a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">YouTube (official platform)</a></li>
          <li><a href="https://developers.google.com/youtube" target="_blank" rel="noopener noreferrer">YouTube Data API</a></li>
        </ul>
        <p>You can use these resources to verify claims and stay informed.</p>
      </section>
    </div>
  );
}

export default About;
