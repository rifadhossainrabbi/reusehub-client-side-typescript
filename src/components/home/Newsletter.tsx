'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-20 container mx-auto px-4 md:px-10">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-slate-900 dark:bg-blue-600 p-10 md:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10"
      >
        <div className="relative z-10 space-y-4 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-400 dark:text-blue-200 font-black text-[10px] uppercase tracking-[0.4em]">
            <Sparkles size={14} /> Stay Synchronized
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
            Get Sanctuary <br /> Updates
          </h2>
          <p className="font-medium opacity-80 max-w-sm">
            Be the first to know when flagship artifacts enter the archives.
          </p>
        </div>

        <div className="relative z-10 w-full lg:max-w-md">
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter seeker email..."
              className="flex-1 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 outline-none focus:ring-2 focus:ring-white/50 font-bold placeholder:text-white/50"
            />
            <button className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
              Join <Send size={14} />
            </button>
          </form>
          <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mt-4 text-center lg:text-left">
            No spam. Only high-end tech wisdom.
          </p>
        </div>

        {/* ডেকোরেশন */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full -mr-20 -mt-20 blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full -ml-20 -mb-20 blur-[80px]"></div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
