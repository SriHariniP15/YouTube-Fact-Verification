// backend/server.js

import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ YouTube Fact Verifier API is running");
});

// ✅ /api/verify route
app.post("/api/verify", async (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" });
  }

  try {
    // Extract transcript or video title if available (placeholder)
    const claimText = "COVID-19 vaccine causes magnetic effect"; // example text to test
    const apiKey = process.env.FACTCHECK_API_KEY;

    // Call Google Fact Check Tools API
    const response = await axios.get(
      `https://factchecktools.googleapis.com/v1alpha1/claims:search`,
      {
        params: {
          query: claimText,
          key: apiKey,
        },
      }
    );

    const claims = response.data.claims || [];

    res.json({
      videoId,
      totalClaims: claims.length,
      claims: claims.map((c) => ({
        text: c.text,
        claimant: c.claimant,
        rating: c.claimReview?.[0]?.textualRating,
        publisher: c.claimReview?.[0]?.publisher?.name,
      })),
    });
  } catch (error) {
    console.error("Error verifying:", error.message);
    res.status(500).json({ error: "Failed to verify claims" });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
