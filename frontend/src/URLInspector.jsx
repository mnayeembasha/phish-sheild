import { motion } from "framer-motion";
import { URLChecker } from "./URLChecker";

export default function URLInspector() {
  return (
    <motion.div
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // transition={{ duration: 1.2 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gray-900/20 text-gray-200"
    >
      {/* Gradient background with animation */}
      <div className="bg-gray-900" />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gray-900 backdrop-blur-[2px]" />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 py-14 px-6 md:py-14 md:px-14 rounded-2xl bg-gray-800/30 shadow-xl"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center space-y-6 max-w-[800px] mb-12"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent">
              URL Safety Inspector
            </h1>
            <p className="text-lg text-gray-400">
              Protect yourself from phishing attempts. Check any URL before you click.
            </p>
          </div>
        </motion.div>

        {/* URLChecker component */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <URLChecker />
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="mt-12 text-center space-y-4 text-sm text-gray-500"
        >
          <p>Our application checks URLs against known phishing patterns and security threats.</p>
          <p>Always exercise caution when visiting unfamiliar websites.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
