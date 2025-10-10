
import React, { useState } from "react";
import heroBg from "../assets/images/hero-bg.jpeg"; // adjust filename/extension if needed
import "./HeroSection.css";

export default function HeroSection({ onVerify }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onVerify) onVerify(url);
    else console.log("Verifying:", url);
  };

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      {/* semi-transparent overlay so text is readable */}
      <div className="hero__overlay" />

      <div className="container hero__content">
        <div className="hero__logoRow">
          <h1 className="hero__title">
            Fact<span>Check</span>
          </h1>
        </div>

        <p className="hero__subtitle">
          Verify facts and claims from YouTube videos instantly. Get reliable
          information with AI-powered fact-checking.
        </p>

        <form className="hero__form" onSubmit={handleSubmit} role="search">
          <label htmlFor="yt-url" className="sr-only">
            YouTube video URL
          </label>

          <div className="hero__inputGroup">
            <input
              id="yt-url"
              className="hero__input"
              type="url"
              placeholder="Paste YouTube video URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />

            <button type="submit" className="hero__btn" aria-label="Verify Facts">
              Verify Facts
            </button>
          </div>
        </form>

        <ul className="hero__features" aria-hidden="true">
          <li>✓ Data-Driven Fact-Checking</li>
          <li>✓ Real-time Verification</li>
          <li>✓ Reliable Sources</li>
        </ul>
      </div>
    </section>
  );
}
