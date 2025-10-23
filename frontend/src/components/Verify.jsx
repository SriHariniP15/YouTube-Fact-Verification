
import React, { useState } from "react";

function Verify() {
  const [videoLink, setVideoLink] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    // Extract videoId from YouTube URL
    const videoId = videoLink.split("v=")[1]?.split("&")[0] || videoLink;

    try {
      const response = await fetch("http:D//localhost:5000/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error verifying:", error);
      alert("Error verifying claims.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <h2>Verify YouTube Video Facts</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>

      {loading && <p>Checking claims...</p>}

      {results && (
        <div className="results">
          <h3>Results:</h3>
          {results.claims && results.claims.length > 0 ? (
            results.claims.map((claim, i) => (
              <div key={i} className="claim-card">
                <p><strong>Claim:</strong> {claim.text}</p>
                {claim.claimReview?.map((review, j) => (
                  <p key={j}>
                    ✅ <strong>{review.publisher.name}:</strong> {review.textualRating}
                  </p>
                ))}
              </div>
            ))
          ) : (
            <p>No fact-checks found for this video.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Verify;
