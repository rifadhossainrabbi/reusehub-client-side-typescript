'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  FaShieldAlt,
  FaLock,
  FaTruck,
  FaHeadset,
  FaLeaf,
  FaUndo,
} from 'react-icons/fa';

const features = [
  {
    icon: <FaShieldAlt className="text-blue-600" />,
    title: 'Quality Checked',
    description:
      'Every featured listing undergoes a rigorous 40-point diagnostic check by our certified tech team.',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: <FaLock className="text-purple-600" />,
    title: 'Secure Escrow',
    description:
      "Funds are held safely in escrow and only released when the buyer confirms the item's condition.",
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: <FaTruck className="text-orange-600" />,
    title: 'Insured Shipping',
    description:
      "All shipments are fully insured and tracked. If it's lost or damaged, you're covered 100%.",
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: <FaHeadset className="text-rose-600" />,
    title: 'Expert Support',
    description:
      'Our dedicated tech support team is available 24/7 to resolve disputes and answer hardware queries.',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
  },
  {
    icon: <FaLeaf className="text-emerald-600" />,
    title: 'Sustainable Tech',
    description:
      'Extend the lifecycle of high-end electronics and reduce e-waste with every transaction.',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: <FaUndo className="text-indigo-600" />,
    title: 'Easy Returns',
    description:
      'Not what you expected? Enjoy a hassle-free 7-day return policy for a full refund.',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
];

const WhyReuseHub = () => {
  // এনিমেশন ভেরিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section className="py-24 w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        {/* হেডার সেকশন */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Why Buy on{' '}
            <span className="text-blue-700 dark:text-blue-500">ReuseHub?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed"
          >
            We've built an ecosystem focused on transparency, security, and the
            absolute best value for both buyers and sellers.
          </motion.p>
        </div>

        {/* ফিচার কার্ড গ্রিড */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, translateY: -5 }}
              className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 group cursor-pointer"
            >
              {/* আইকন বক্স */}
              <div
                className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center text-2xl mb-6 transition-transform group-hover:rotate-12`}
              >
                {feature.icon}
              </div>

              {/* টেক্সট কন্টেন্ট */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyReuseHub;
