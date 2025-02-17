const {phishingKeywords} = require("../utils/phishingKeywords");
module.exports.emailSpamChecker = async (req, res) => {
  try {
      const { emailContent} = req.body;
      if (!emailContent) {
          return res.status(400).json({ error: 'Email content is required' });
      }
      const isPhishing = phishingKeywords.some(keyword => emailContent.toLowerCase().includes(keyword));
      res.json({ result: {
        is_spam:isPhishing,
        message:isPhishing ? "Phishing detected!" : "Safe email"
      } });

  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
}

