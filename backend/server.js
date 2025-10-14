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
const PORT = process.env.PORT || 5000;
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
    // 💡 UPDATED: Changed model name to 'gemini-2.5-pro'
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    const prompt = `Analyze the following text from a video and extract specific, verifiable factual claims. Focus on:
1. Statistical claims or numbers
2. Historical events or dates
3. Scientific or medical statements
4. Claims about people, organizations, or events
5. Statements that can be proven true or false

Format each claim to be more general and searchable. Return ONLY a valid JSON array of strings. For example: ["Global temperatures increased by 1.5°C since 1900", "COVID-19 vaccines reduce hospitalization risk"]. If there are no factual claims, return an empty array []. Do not include any other text or markdown. 

Text: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawResponse = response.text();
    
    console.log("--- Gemini Raw Response ---");
    console.log(rawResponse);
    console.log("---------------------------");

    const jsonResponse = rawResponse.replace(/```json|```/g, '').trim();
    
    try {
      const claims = JSON.parse(jsonResponse);
      console.log(`Successfully parsed ${claims.length} claims.`);
      return claims;
    } catch (parseError) {
      console.error("ERROR: Failed to parse Gemini response into JSON.", parseError);
      return [];
    }
  } catch (error) {
    console.error("FATAL ERROR during Gemini API call:", error);
    if (error.status) console.error(`Status: ${error.status}, StatusText: ${error.statusText}`);
    if (error.errorDetails) console.error("Details:", error.errorDetails);
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
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

