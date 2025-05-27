import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ActionCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-full flex justify-center py-24 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="w-[800px] h-[200px] p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-30 justify-center items-center h-full">
          <button
            onClick={() => navigate('/planner')}
            className="px-8 py-3 rounded-xl font-semibold bg-purple-500 hover:bg-purple-600 text-white transition duration-300"
          >
            Plan My Trip
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="px-8 py-3 rounded-xl font-semibold bg-purple-500 hover:bg-purple-600 text-white transition duration-300"
          >
            Explore
          </button>
        </div>
      </div>
    </motion.div>
  );
}
