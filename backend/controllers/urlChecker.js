const { GOOGLE_SAFE_BROWSING_URL } = require("../config");
const axios = require("axios");
const whois = require("whois-json");

const puppeteer = require("puppeteer");
const sslChecker = require("ssl-checker");


// Function to check Google API
async function checkSafeBrowsing(url) {
    try {
        const response = await axios.post(GOOGLE_SAFE_BROWSING_URL,
            {
                client: { clientId: "yourcompany", clientVersion: "1.0" },
                threatInfo: {
                    threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                    platformTypes: ["ANY_PLATFORM"],
                    threatEntryTypes: ["URL"],
                    threatEntries: [{ url }],
                },
            }
        );
        return response.data.matches ? "Blacklisted by Google" : "✅ Not Blacklisted by Google";
    } catch (error) {
        return "❌ Error Checking Safe Browsing";
    }
}

// Function to check SSL certificate validity
async function checkSSL(domain) {
  try {
    const sslData = await sslChecker(domain);
    return sslData.valid ? "✅ SSL Valid" : "⚠️ Invalid SSL Certificate";
  } catch (error) {
    return "❌ SSL Check Failed";
  }
}

// Function to check domain age
async function checkDomainAge(domain) {
  try {
    const whoisData = await whois(domain);
    // console.log(whoisData);

    const createdDate = whoisData.creationDate;
    if (!createdDate) return "⚠️ Domain Creation Date Not Found";

    const ageInDays =
      (new Date() - new Date(createdDate)) / (1000 * 60 * 60 * 24);
    return ageInDays > 180
      ? `✅ Domain Age: ${Math.round(ageInDays)} days`
      : "⚠️ Newly Created Domain";
  } catch (error) {
    return "❌ Whois Lookup Failed";
  }
}

// Function to analyze website structure using Puppeteer
async function analyzeWebsite(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const formCount = await page.evaluate(() => document.forms.length);
    const suspiciousKeywords = ["password", "username", "login", "signin"];
    const hasSuspiciousForms = await page.evaluate((keywords) => {
      return Array.from(document.querySelectorAll("input")).some((input) =>
        keywords.some((keyword) => input.name.toLowerCase().includes(keyword))
      );
    }, suspiciousKeywords);

    await browser.close();

    if (formCount > 0 && hasSuspiciousForms) {
      return "⚠️ Fake Login Page Detected";
    } else {
      return "✅ Website Structure Looks Safe";
    }
  } catch (error) {
    return "Website Analysis Failed";
  }
}

function determineFinalVerdict(
  safeBrowsing,
  sslStatus,
  domainAge,
  websiteStructure
) {
//   const domainNotFound = domainAge === "⚠️ Domain Creation Date Not Found";

  if (
    // (domainNotFound || domainAge.startsWith("✅")) &&
    safeBrowsing === "✅ Not Blacklisted by Google" &&
    sslStatus === "✅ SSL Valid" &&
    (websiteStructure !== "Website Analysis Failed" ? websiteStructure === "✅ Website Structure Looks Safe":true)
    // websiteStructure === "✅ Website Structure Looks Safe"
  ) {
    return "✅ URL Testing Passed";
  }
  return "Phishing Detected (URL Not Safe)";
}

module.exports.urlChecker = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required." });

  try {
    const domain = new URL(url).hostname;
    const [safeBrowsing, sslStatus, domainAge, websiteStructure] =
      await Promise.all([
        checkSafeBrowsing(url),
        checkSSL(domain),
        checkDomainAge(domain),
        analyzeWebsite(url),
      ]);

    const finalVerdict = determineFinalVerdict(
      safeBrowsing,
      sslStatus,
      domainAge,
      websiteStructure
    );

    res.json({
      url,
      "isPhishing":finalVerdict!=="✅ URL Testing Passed",
      safeBrowsing,
      sslStatus,
      domainAge,
      websiteStructure,
      finalVerdict,
    });
  } catch (error) {
    console.error("Error checking URL:", error.message);
    res
      .status(500)
      .json({ error: "Failed to check the URL. Try again later." });
  }
};
