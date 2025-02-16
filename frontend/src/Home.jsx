import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
      const contentTimer = setTimeout(() => setShowContent(true), 1500);
      return () => clearTimeout(contentTimer);
    }, 2500);
    return () => clearTimeout(loadingTimer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute w-full h-full flex justify-center items-center bg-gray-950"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} transition={{ duration: 1.5 }}>
            <div className="text-6xl">🔐</div>
            <p className="mt-3 text-lg">ShieldAI Securing Access...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const features = [
    {
      title: "Smart URL & Website Verification",
      path: "/url-inspector",
      desc: "Cross-checks links in real-time, analyzing SSL certificates, domain age, and website structure to block fake login pages instantly.",
      icon: "🔗",
    },
    {
      title: "Deepfake Scam Detection",
      path: "/deepfake-detection",
      desc: "Identifies AI-generated voices and fraudulent video calls to stop CEO frauds and fake emergency scams before they fool you.",
      icon: "🎭",
    },
    {
      title: "Fake/Spam Email Detection",
      path: "/check-spam-email",
      desc: "Detects and filters out fake and spam emails using AI-powered analysis to protect users from scams and phishing attempts.",
      icon: "📧",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="flex flex-col min-h-screen bg-gray-900 text-white">
      <motion.nav
  className="fixed top-0 w-full bg-gray-900 p-4 flex justify-between items-center"
>
  <Link to={"/"}>
    <h1

      className="text-[1.5rem] font-bold ml-2 flex items-center justify-center"
    >
      <span>🔐</span>
      <span className="bg-gradient-to-b bg-clip-text text-transparent from-gray-200 to-gray-400 ml-2 pt-2">Shield AI</span>
    </h1>
  </Link>
</motion.nav>

        {/* <ul className="flex space-x-4 text-white">
          <li><Link to="/" className="hover:text-blue-400">URL Inspector</Link></li>
          <li><Link to="/about" className="hover:text-blue-400">EmailSpam Checker</Link></li>
          <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
        </ul> */}

      {showContent && (
        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} transition={{ duration: 1.5 }} className="flex-1 bg-gray-900 flex flex-col items-center justify-evenly pt-24 px-6 text-center">
          <motion.div>
          <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          className="hidden md:block text-[2.75rem] font-bold bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent ">
            Secure your Digital World
          </motion.h2>
         <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          className="md:hidden text-[2.75rem] mt-4 md:mt-0 font-bold bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent leading-[1.2]">
            <span className="bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent "> Secure your </span> <br className="md:hidden"/> <span className="bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent"> Digital World</span>
          </motion.h2>
          <motion.p initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 1 }} className="text-gray-400 max-w-2xl mx-auto text-lg">
            Protect yourself from phishing scams, deepfake frauds, and fake emails with our cutting-edge AI-powered security system.
          </motion.p>

          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 md:px-15 mt-10">
            {features.map((feature, index) => (
              <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={feature.path}
                className="block bg-gray-800/50 hover:bg-gray-800/90 backdrop-blur-xl  shadow-xl
                           p-6 rounded-xl  transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold bg-gradient-to-b bg-clip-text text-transparent from-blue-400 to-blue-700">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-200 mt-2">{feature.desc}</p>
              </Link>
            </motion.div>

            ))}
          </div>



        </motion.div>
      )}

      {showContent && <motion.div initial={{ y: 50 }} animate={{ y: 0 }} transition={{ duration: 2.5 }}>
      <motion.footer initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 1 }}  className="mt-10 p-4 bg-gray-900 text-gray-400 text-center ">
        <p>&copy; 2024 ShieldAI. All Rights Reserved.</p>
      </motion.footer>
      </motion.div>}
    </motion.div>
  );
}