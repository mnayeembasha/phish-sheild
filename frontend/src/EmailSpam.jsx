import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BACKEND_URL } from "./config";

export const EmailSpam = () => {
  const [emailContent, setEmailContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkSpam = async () => {
    if (!emailContent.trim()) {
      setError("Please enter email content.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/check-spam`, { emailContent });
      setResult(response.data.result);
    } catch (error) {
      setResult({ error: "❌ Failed to check the email. Try again later." });
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-3 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-2xl py-10 px-4 md:py-10 md:px-14 rounded-2xl bg-gray-800/30 shadow-xl"
      >
        {/* Heading */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center space-y-6 max-w-[800px] mb-8 md:mb-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent">
              Email Spam Checker
            </h1>
            <p className="text-lg text-gray-400">
              If it sounds too good to be true, it probably is a scam.
            </p>
          </div>
        </motion.div>

        {/* Textarea */}
        <motion.textarea
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 h-32 md:min-h-42"
          rows={6}
          placeholder="Paste your email content here..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        ></motion.textarea>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-red-500 text-sm mt-2"
          >
            {error}
          </motion.p>
        )}

        {/* Check Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-b from-blue-400 to-blue-700 hover:opacity-90 text-white font-bold h-12 px-6 rounded-lg mt-4 transition-all"
          onClick={checkSpam}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check for Spam"}
        </motion.button>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`mt-4 p-4 rounded-lg font-semibold ${
              result.is_spam ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {result.error ? result.error : result.is_spam ? "🚨 Spam Detected!" : "✅ Safe Email!"}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
