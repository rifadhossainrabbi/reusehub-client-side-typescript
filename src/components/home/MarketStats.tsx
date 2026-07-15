'use client';
import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, Zap, Globe, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketStats = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home/market-stats`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <section className="py-20 w-full bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-900 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4">
        {!stats ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 text-center">
            <StatBox
              icon={<Users size={24} />}
              label="Total Seekers"
              val={stats.users + 5000}
            />
            <StatBox
              icon={<Zap size={24} />}
              label="Artifacts Archived"
              val={stats.products + 1200}
            />
            <StatBox
              icon={<ShieldCheck size={24} />}
              label="Verified Exchanges"
              val={stats.orders + 850}
            />
            <StatBox
              icon={<Globe size={24} />}
              label="Active Regions"
              val="24+"
            />
          </div>
        )}
      </div>
    </section>
  );
};

const StatBox = ({ icon, label, val }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="space-y-4"
  >
    <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 mx-auto shadow-sm border border-slate-100 dark:border-slate-800">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
        {val.toLocaleString()}
      </h4>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
    </div>
  </motion.div>
);

export default MarketStats;
