import React from 'react';
import { FaBolt, FaUsers, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

// NOTE: We will use the styles from HomePage.css to keep everything consistent.

function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        {/* Intro */}
        <div className="about-intro">
          <h2 className="section-title">About YouTube Fact Verifier</h2>
          <p className="about-subtitle">
            Our mission is to combat misinformation by providing instant, AI-powered
            fact-checking for YouTube content. We help viewers make informed
            decisions by verifying claims against trusted sources.
          </p>
        </div>

        {/* How It Works */}
        <h2 className="section-title">How It Works</h2>
        <div className="grid-container">
          <div className="grid-item">
            <span>1</span><h3>Paste URL</h3>
            <p>Submit any YouTube video link to begin the analysis process.</p>
          </div>
          <div className="grid-item">
            <span>2</span><h3>Extract Claims</h3>
            <p>AI analyzes transcripts and descriptions to identify factual claims.</p>
          </div>
          <div className="grid-item">
            <span>3</span><h3>Verify Facts</h3>
            <p>Cross-reference claims with fact-checking APIs and trusted databases.</p>
          </div>
          <div className="grid-item">
            <span>4</span><h3>Show Results</h3>
            <p>Present clear, color-coded results with sources and confidence scores.</p>
          </div>
        </div>

        {/* Understanding Results */}
        <h2 className="section-title">Understanding Results</h2>
        <div className="grid-container results-understanding">
          <div className="result-card verified">
            <h3><FaCheckCircle /> Verified</h3>
            <p>Claims supported by credible sources and fact-checking organizations.</p>
          </div>
          <div className="result-card false">
            <h3>❌ False/Misleading</h3>
            <p>Claims contradicted by reliable sources or identified as misinformation.</p>
          </div>
          <div className="result-card unverified">
            <h3>⚠️ Unverified</h3>
            <p>Claims that couldn’t be verified due to lack of sources or evidence.</p>
          </div>
        </div>

        {/* Key Features */}
        <h2 className="section-title">Key Features</h2>
        <div className="grid-container key-features">
          <div className="feature-card">
            <h4><FaBolt /> Real-Time Analysis</h4>
            <ul>
              <li>Instant fact-checking using advanced NLP</li>
              <li>YouTube API integration for transcript access</li>
              <li>Confidence scoring algorithm</li>
            </ul>
          </div>
          <div className="feature-card">
            <h4><FaUsers /> Community Features</h4>
            <ul>
              <li>User rating system for accuracy feedback</li>
              <li>Personal verification history</li>
              <li>Shareable fact-check reports</li>
            </ul>
          </div>
          <div className="feature-card">
            <h4><FaShieldAlt /> Trusted Sources</h4>
            <ul>
              <li>Google Fact Check Tools API</li>
              <li>Cross-referenced reports</li>
              <li>Reliable academic sources</li>
            </ul>
          </div>
          <div className="feature-card">
            <h4><FaCheckCircle /> Privacy & Security</h4>
            <ul>
              <li>No personal data collection</li>
              <li>Secure API connections</li>
              <li>GDPR compliant design</li>
            </ul>
          </div>
        </div>
        
        {/* Important Limitations */}
        <div className="limitations-box">
          <h2 className="section-title">Important Limitations</h2>
          <ul>
            <li>Accuracy depends on availability of transcripts/captions.</li>
            <li>Some claims may be too recent for fact-checking databases.</li>
            <li>Results should supplement, not replace, critical thinking.</li>
            <li>Always cross-reference important information with multiple sources.</li>
          </ul>
        </div>
        
        {/* Helpful Resources */}
        <div className="resources-box">
          <h2 className="section-title">Helpful Resources</h2>
          <p>You can use these resources to verify claims and stay informed.</p>
          <div className="resource-links">
            <a href="https://www.wikipedia.com" target="_blank" rel="noopener noreferrer">Wikipedia</a>
            <a href="https://www.snopes.com" target="_blank" rel="noopener noreferrer">Snopes</a>
            <a href="https://www.factcheck.org" target="_blank" rel="noopener noreferrer">FactCheck.org</a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;