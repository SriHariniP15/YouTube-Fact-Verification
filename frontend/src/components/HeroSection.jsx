import React, { useState } from 'react';
import HeroBackgroundImage from '../assets/images/hero-bg.jpeg';

// --- Sub-components for Results & Feedback ---

const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={index}
            className={ratingValue <= (hover || rating) ? 'on' : 'off'}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(rating)}
            aria-label={`Rate ${ratingValue} out of 5 stars`}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

const FeedbackSection = ({ resultsUrl }) => {
  const [message, setMessage] = useState('');

  const handleFeedbackClick = (type) => {
    if (type === 'helpful') {
      setMessage('Thanks for your feedback! 😊');
    } else if (type === 'notHelpful') {
      setMessage('Thanks! We will try to improve. 😔');
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      // Use Web Share API if available
      try {
        await navigator.share({
          title: 'Check out this analysis',
          text: 'I found this YouTube video fact-check interesting!',
          url: resultsUrl,
        });
        setMessage('Result shared successfully! 🚀');
      } catch (err) {
        console.error(err);
        setMessage('Sharing failed. 😕');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(resultsUrl);
        setMessage('Result URL copied to clipboard! 📋');
      } catch (err) {
        console.error(err);
        setMessage('Could not copy to clipboard. 😕');
      }
    }
  };

  return (
    <div className="feedback-section">
      <div className="feedback-query">
        <span>Was this analysis helpful?</span>
        <div className="feedback-buttons">
          <button className="feedback-btn" onClick={() => handleFeedbackClick('helpful')}>👍 Helpful</button>
          <button className="feedback-btn" onClick={() => handleFeedbackClick('notHelpful')}>👎 Not Helpful</button>
          <button className="feedback-btn" onClick={handleShareClick}>🔗 Share</button>
        </div>
      </div>
      <div className="feedback-rating">
        <span>Leave a rating:</span>
        <StarRating />
      </div>
      {message && <div className="feedback-message">{message}</div>}
    </div>
  );
};

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'misleading': return <span className="status-icon">⚠️</span>;
    case 'unverified': return <span className="status-icon">❓</span>;
    case 'verified': return <span className="status-icon">✅</span>;
    default: return <span className="status-icon">ℹ️</span>;
  }
};

// --- Main HeroSection Component ---

function HeroSection() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!url) return;
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setResults(data.results);

    } catch (error) {
      console.error('Failed to verify:', error);
      setResults([{
        claim: "Verification Failed",
        status: "Error",
        information: "Could not connect to the backend server or an error occurred. Please try again later.",
        sources: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="hero-section" style={{ backgroundImage: `url(${HeroBackgroundImage})` }}>
        <div className="hero-content">
          <h1>FactCheck</h1>
          <p className="subtitle">Verify facts and claims from YouTube videos instantly.</p>
          <form onSubmit={handleVerify} className="verify-form">
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste YouTube video URL here..." disabled={isLoading} />
            <button type="submit" disabled={isLoading}>{isLoading ? 'Analyzing...' : 'Verify Facts'}</button>
          </form>
          {isLoading && <div className="loading-spinner"><div className="spinner"></div></div>}
        </div>
      </section>

      {results && (
        <section className="results-display-area">
          <h2 className="section-title">Analysis Complete</h2>
          {results.map((result, index) => (
            <div key={index} className="result-card-detailed">
              <div className="card-header">{getStatusIcon(result.status)}<h3>{result.claim}</h3></div>
              <div className="card-body">
                <span className={`status-tag ${result.status.toLowerCase()}`}>{result.status}</span>
                <p className="info-text">{result.information}</p>
                <div className="sources-section">
                  <strong>Sources:</strong>
                  <div className="sources-list">
                    {result.sources.map((source, i) => <a key={i} href={source.url} target="_blank" rel="noopener noreferrer">{source.name} ↗</a>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <FeedbackSection resultsUrl={window.location.href} />
        </section>
      )}
    </>
  );
}

export default HeroSection;
