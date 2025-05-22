// src/pages/Hero.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="../public/droneshot.mp4" type="video/mp4" />
      </video>
      <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-40 text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Explore the World, Your Way
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl max-w-2xl mb-10"
        >
          Personalized travel planning powered by AI — discover, plan, and explore with ease.
        </motion.p>
        <div className="flex gap-6">
          <button
            onClick={() => navigate('/planner')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg"
          >
            Plan My Trip
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-xl text-lg"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}
