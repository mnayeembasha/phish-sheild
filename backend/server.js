const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SAFE_BROWSING_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`;
const SPAM_CHECKER_URL = "https://api.apilayer.com/spamchecker";
const APILAYER_API=process.env.APILAYER_API;


app.post("/api/check-url", async (req, res) => {
  const { url } = req.body;
  console.log(url);
  if (!url) return res.status(400).json({ error: "URL is required." });

  try {
    const response = await axios.post(GOOGLE_SAFE_BROWSING_URL, {
      client: { clientId: "your-app", clientVersion: "1.0" },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }],
      },
    });

    const isPhishing = response.data.matches ? response.data.matches.length > 0 : false;
    res.json({ url, isPhishing });
  } catch (error) {
    console.error("Error checking URL:", error.message);
    res.status(500).json({ error: "Failed to check the URL. Try again later." });
  }
});

const preprocessText = (text) => {
  return text.toLowerCase().replace(/[^\w\s]/g, "");
};

const emails=[
  'Congratulations! You have won a $1,000 gift card. Click the link below to claim your prize now! [Claim Your Prize](http://spam-link.com) Act fast, this offer expires soon! ',
  "Hello John,I hope you're doing well. I wanted to follow up on our meeting last week regarding the project timeline.Please let me know when you're available for a quick call.Best,Sarah"
]

app.post('/api/check-spam', async (req, res) => {
  try {
      const { emailContent, threshold = 2.6 } = req.body;
      if (!emailContent) {
          return res.status(400).json({ error: 'Email content is required' });
      }
      const requestOptions = {
          method: 'POST',
          redirect: 'follow',
          headers:{"apikey":APILAYER_API},
          body: emailContent
      };


      const response = await fetch(`${SPAM_CHECKER_URL}?threshold=${threshold}`, requestOptions);
      const result = await response.json();

      if (response.ok) {
          return res.json(result);
      } else {
          return res.status(500).json({
              error: 'Failed to get response from spam check',
              status_code: response.status,
              response: result
          });
      }
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
