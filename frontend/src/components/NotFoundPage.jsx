import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileQuestion, ChevronRight, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col items-center justify-center">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-900/5 blur-[100px] rounded-full opacity-40"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 max-w-lg w-full px-6 text-center">
        
        {/* Icon Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-8 bg-zinc-900/50 border border-white/5 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-md group"
        >
          <FileQuestion size={40} className="text-zinc-500 group-hover:text-cyan-400 transition-colors duration-500" />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800">
            404
          </h1>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Page Not Found
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              The requested URL could not be found on this server. It may have been moved, deleted, or the address is incorrect.
            </p>
          </div>

          {/* Search / Path Display (Decorative) */}
          
        </motion.div>

        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <Link to="/">
            <button className="group relative px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 mx-auto">
              <Home size={16} />
              Return to Home
              <ChevronRight size={14} className="text-zinc-400 group-hover:translate-x-1 group-hover:text-black transition-all" />
            </button>
          </Link>
        </motion.div>

      </main>

    </div>
  );
};

export default NotFoundPage;