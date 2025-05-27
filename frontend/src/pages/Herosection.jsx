import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';

export default function Hero() {
  const navigate = useNavigate();

  const images = [
    '/WE/pic1.jpg', '/WE/pic2.jpg', '/WE/pic3.jpg', '/WE/pic4.jpg',
    '/WE/pic5.jpg', '/WE/pic6.jpg', '/WE/pic7.jpg', '/WE/pic8.jpg',
    '/WE/pic9.jpg', '/WE/pic10.jpg',
  ];

  const quotes = [
    "Dream big. Travel bigger.",
    "Adventure is out there!",
    "Collect moments, not things.",
    "Wander often, wonder always.",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [prevImage, setPrevImage] = useState(null);
  const timeoutRef = useRef();

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      setPrevImage(currentImage);
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timeoutRef.current);
  }, [currentImage]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Images */}
      {prevImage !== null && (
        <motion.img
          key={prevImage}
          src={images[prevImage]}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => setPrevImage(null)}
          className="fixed top-0 left-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      <motion.img
        key={currentImage}
        src={images[currentImage]}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
       className="fixed top-0 left-0 w-full h-full object-cover pointer-events-none"

      />

      {/* Foreground Content */}
<div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 bg-black/40">
        

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-4"
        >
          <Globe size={48} className="text-white animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-white text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight mt-4"
        >
          Discover Your Next Adventure
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white text-[clamp(1rem,2.5vw,1.25rem)] mt-4 max-w-xl"
        >
          Let AI create the perfect travel plan based on your interests, budget, and time. Let’s go!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-white text-[clamp(1rem,2.5vw,1.5rem)] mt-6 font-semibold italic max-w-xl"
        >
          <Typewriter
            words={quotes}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </motion.div>
      </div>
    </div>
  );
}
