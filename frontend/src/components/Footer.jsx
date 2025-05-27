// src/components/Footer.jsx
import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full bg-black z-30 text-white px-4 py-4 border-t border-gray-800">

      <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        
        {/* License and credit */}
        <div className="text-sm">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold">WorldExplorer</span>. All rights reserved.
          </p>
          <p className="text-gray-400 mt-1">
            Built with <Heart size={14} className="inline text-red-500 mx-1 animate-pulse" /> by Royson Dsouza & Lavanya.
          </p>
          <p className="text-gray-500 mt-1">
            Licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">MIT License</a>.
          </p>
        </div>

        {/* GitHub or socials */}
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/Lavanya-rao05/World-Explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-400 hover:text-white transition"
          >
            <Github size={18} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
