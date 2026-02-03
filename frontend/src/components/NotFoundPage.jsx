import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileQuestion, ChevronRight, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30 overflow-hidden flex flex-col items-center justify-center">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#13703a]/10 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#38984c]/5 blur-[100px] rounded-full opacity-40"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 max-w-lg w-full px-6 text-center">
        
        {/* Icon Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-8 bg-[#111111] border border-white/5 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-md group"
        >
          <FileQuestion size={40} className="text-white/40 group-hover:text-[#51b749] transition-colors duration-500" />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
            404
          </h1>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Page Not Found
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              The requested URL could not be found on this server. It may have been moved, deleted, or the address is incorrect.
            </p>
          </div>

          {/* Search / Path Display (Decorative) */}
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] border border-white/5 text-white/40 text-xs font-mono">
              <Search size={12} />
              <span>https://emr.nitkkr.ac.in</span>
              <span className="text-white/20">/404</span>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <Link to="/">
            <button className="group relative px-8 py-3 rounded-full bg-[#51b749] text-white font-bold text-sm hover:bg-[#38984c] transition-all shadow-[0_0_30px_rgba(81,183,73,0.3)] flex items-center justify-center gap-2 mx-auto">
              <Home size={16} />
              Return to Home
              <ChevronRight size={14} className="text-white/70 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </button>
          </Link>
        </motion.div>

      </main>

    </div>
  );
};

export default NotFoundPage;