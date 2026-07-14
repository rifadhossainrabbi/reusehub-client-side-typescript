'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const ImpactSection = () => {
  return (
    <section className="py-24 w-full bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight"
            >
              Empowering a Smarter <br className="hidden md:block" /> Tech
              Economy
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              We're more than just a marketplace. We're a growing community
              redefining how high-end electronics are consumed and valued.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-700 hover:bg-blue-800 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20"
            >
              Read our Impact Report
            </motion.button>
          </div>

          {/* Right Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Transactions */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-4"
            >
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Monthly Transactions</span>
                <span className="text-blue-600 flex items-center gap-1">
                  +12% <TrendingUp size={12} />
                </span>
              </div>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">
                $4.2M+
              </h4>
              {/* Simple Visual Bars */}
              <div className="flex items-end gap-2 h-16 pt-4">
                {[40, 60, 45, 80, 55, 95].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-t-lg ${i === 5 ? 'bg-blue-700' : 'bg-blue-100 dark:bg-blue-900/30'}`}
                  ></div>
                ))}
              </div>
            </motion.div>

            {/* Card 2: Carbon Offset */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-4"
            >
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Carbon Offset</span>
                <span>Goal: 50T</span>
              </div>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">
                24.8T
              </h4>
              {/* Progress Bar */}
              <div className="space-y-4 pt-4">
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '48%' }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-blue-700 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-500 font-bold">
                  Prevented from entering landfills this year
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
