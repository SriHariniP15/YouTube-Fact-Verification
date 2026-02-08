const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { google } = require('googleapis');
const { getSubtitles } = require('youtube-captions-scraper');
const { GoogleGenerativeAI } = require('@google/generative-ai');

//avbe

// --- Initialize API Clients ---
if (!process.env.API_KEY || !process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: API keys are not defined in the .env file.");
  process.exit(1);
}
const youtube = google.youtube({ version: 'v3', auth: process.env.API_KEY });
const factCheck = google.factchecktools({ version: 'v1alpha1', auth: process.env.API_KEY });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiBase: "https://generativelanguage.googleapis.com",
});

const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

// --- Root Route for Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Backend is running successfully!' });
});

// --- Helper Functions ---
function getVideoId(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
    const videoId = urlObj.searchParams.get('v');
    if (!videoId) throw new Error("No video ID found in URL");
    return videoId;
  } catch (error) {
    console.error("Invalid URL provided:", url, error);
    return null;
  }
}

async function extractClaimsWithGemini(text) {
  try {
    console.log("Attempting to extract claims with Gemini...");
    // Use gemini-1.5-flash for speed and reliability
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' }); 
    
    const prompt = `Analyze the following text from a video and extract specific, verifiable factual claims. 
    Return ONLY a valid JSON array of strings. 
    Example: ["The moon is 384,400 km away", "Water boils at 100 degrees Celsius"].
    If no claims found, return [].
    
    Text: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawResponse = response.text();

    // CLEANING LOGIC: Extract only the content between [ and ]
    const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
    const jsonResponse = jsonMatch ? jsonMatch[0] : "[]";

    try {
      const claims = JSON.parse(jsonResponse);
      console.log(`Successfully parsed ${claims.length} claims.`);
      return claims;
    } catch (parseError) {
      console.error("Failed to parse Gemini response. Raw response was:", rawResponse);
      return [];
    }
  } catch (error) {
    console.error("FATAL ERROR during Gemini API call:", error.message);
    return [];
  }
}

// --- Main Verification Endpoint ---
app.post('/api/verify', async (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) return res.status(400).json({ error: 'videoUrl is required' });

  console.log(`\n--- New Request: ${videoUrl} ---`);
  try {
    const videoId = getVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL.' });
    }
    console.log(`1. Video ID: ${videoId}`);

    const videoResponse = await youtube.videos.list({ part: 'snippet', id: videoId });
    if (videoResponse.data.items.length === 0) return res.status(404).json({ error: 'Video not found.' });
    console.log("2. Fetched Metadata.");

    const snippet = videoResponse.data.items[0].snippet;
    let transcriptText = '';
    try {
      const subtitles = await getSubtitles({ videoID: videoId, lang: 'en' });
      transcriptText = subtitles.map(caption => caption.text).join(' ');
      console.log("3. Fetched Transcript.");
    } catch (e) {
      console.log('3. Transcript not available.');
    }
    
    const fullText = `${snippet.title}. ${snippet.description}. ${transcriptText}`;
    const claims = await extractClaimsWithGemini(fullText.substring(0, 20000)); 
    
    if (claims.length === 0) {
      console.log("4. No claims extracted or Gemini failed.");
      return res.json({ results: [{ claim: 'No specific claims found to verify', status: 'Unverified', information: 'The AI could not identify distinct factual claims in the video content.', sources: [] }] });
    }
    console.log(`4. Extracted ${claims.length} claims.`);

    const searchPromises = claims.map(claim => factCheck.claims.search({ 
      query: claim, 
      pageSize: 5,  // Increase results per claim
      languageCode: 'en' // Specify English language
    }));
    const searchResults = await Promise.all(searchPromises);
    console.log("5. Searched Fact Check API.");

    let allFoundClaims = searchResults.flatMap(result => result.data.claims || []);
    if (allFoundClaims.length === 0) {
      console.log("6. No matching fact-checks found in database.");
      return res.json({ results: [{ claim: 'No fact-check articles found for the extracted claims', status: 'Unverified', information: 'While claims were identified, no matching articles were found in the fact-check database.', sources: [] }] });
    }

    console.log(`6. Found ${allFoundClaims.length} matching fact-checks. Sending results.`);
    const formattedResults = allFoundClaims.map(claim => ({
      claim: claim.text,
      status: claim.claimReview[0].textualRating,
      information: `Review of a claim by "${claim.claimant || 'unknown'}".`,
      sources: [{ name: claim.claimReview[0].publisher.site, url: claim.claimReview[0].url }],
    }));

    res.json({ results: formattedResults });

  } catch (error) {
    console.error('--- UNHANDLED SERVER ERROR ---');
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred on the server.' });
  }
});
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
