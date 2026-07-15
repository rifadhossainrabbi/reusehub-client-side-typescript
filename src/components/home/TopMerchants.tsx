'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Box, Loader2 } from 'lucide-react';

const TopMerchants = () => {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home/top-merchants`)
      .then(res => res.json())
      .then(data => setMerchants(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-blue-600" />
      </div>
    );

  return (
    <section className="py-24 w-full bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-10">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
          >
            Elite{' '}
            <span className="text-blue-700 dark:text-blue-500">Merchants</span>
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Recognizing the most active contributors in our sustainable gadget
            sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {merchants.map((m: any, i: number) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center space-y-6 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 group"
            >
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 flex items-center justify-center border-2 border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner group-hover:border-blue-500 transition-colors">
                  {m.image ? (
                    <img
                      src={m.image}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt="merchant"
                    />
                  ) : (
                    <span className="text-3xl font-black text-blue-600">
                      {m.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white dark:border-slate-900">
                  <Award size={18} />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {m.name}
                </h3>
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  <Box size={12} /> {m.count} Artifacts Listed
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopMerchants;
