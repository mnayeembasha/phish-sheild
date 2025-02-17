require("dotenv").config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
module.exports.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
module.exports.APILAYER_API=process.env.APILAYER_API;
module.exports.GOOGLE_SAFE_BROWSING_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`;
module.exports.SPAM_CHECKER_URL = "https://api.apilayer.com/spamchecker";
