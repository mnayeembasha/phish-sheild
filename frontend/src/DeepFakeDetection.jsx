import { motion } from "framer-motion";

export default function DeepFakeDetection() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">
         <div className="flex flex-col justify-center items-center px-10 md:px-0 text-center">
         <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          className="hidden md:block text-[2.75rem] font-bold bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent ">
            DeepFake Scam Detection
          </motion.h2>
         <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          className="md:hidden text-[2.75rem] font-bold bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent leading-[1.1]">
            <span className="bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent "> DeepFake </span> <br className="md:hidden"/> <span className="bg-gradient-to-b from-blue-300 to-blue-700 bg-clip-text text-transparent">Scam Detection</span>
          </motion.h2>
          <motion.p initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 1 }} className="mt-4 md:mt-0 text-center text-gray-400 max-w-2xl mx-auto text-lg">
          Identifies AI-generated voices and fraudulent video calls to stop CEO frauds and fake emergency scams before they fool you
          </motion.p>
          <motion.p initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 1 }} className="text-center text-gray-400 max-w-2xl mx-auto text-2xl mt-8">
          Coming soon....
          </motion.p>
         </div>
    </div>
  )
}
