'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={28} />,
    title: 'Join Hub',
    description:
      'Create a professional profile in minutes with simple verification.',
  },
  {
    icon: <Search size={28} />,
    title: 'Find Deals',
    description:
      'Browse verified listings with ultra-high-def photography and logs.',
  },
  {
    icon: <CreditCard size={28} />,
    title: 'Secure Pay',
    description: 'Pay via encrypted portal with 100% money-back guarantee.',
  },
  {
    icon: <CheckCircle size={28} />,
    title: 'Enjoy Tech',
    description: 'Unbox your gadget and verify the condition before release.',
  },
];

const StepsSection = () => {
  return (
    <section className="py-20 w-full bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
            Get Your Gear in 4 Simple Steps
          </p>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/4 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                {/* Icon Circle */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto mb-6 text-blue-700 dark:text-blue-500 shadow-sm group-hover:border-blue-600 group-hover:shadow-xl transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
