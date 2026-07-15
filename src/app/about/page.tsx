'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Leaf,
  Users,
  Cpu,
  Target,
  Award,
  Globe,
  Zap,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  // এনিমেশন ভেরিয়েন্ট
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      {/* --- SECTION 1: HERO (REFINING TECHNOLOGY) --- */}
      <section className="relative py-24 md:py-32 border-b dark:border-slate-900 bg-slate-50/50 dark:bg-transparent">
        <div className="container mx-auto px-4 text-center space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-600/10 text-blue-600 dark:text-blue-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/20"
          >
            Our Mission & Legacy
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white leading-none tracking-tighter"
          >
            Redefining the Lifecycle <br /> of{' '}
            <span className="text-blue-700 dark:text-blue-500 italic">
              Technology.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
          >
            ReuseHub is a premium marketplace sanctuary built to bridge the gap
            between high-end innovation and sustainable trading.
          </motion.p>
        </div>
      </section>

      {/* --- SECTION 2: THE CORE PILLARS --- */}
      <section className="py-24 container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <PillarCard
            index={1}
            icon={<ShieldCheck size={32} />}
            title="Uncompromising Trust"
            desc="Every artifact listed undergoes a mandatory multi-point diagnostic log check to ensure it meets our sanctuary standards."
          />
          <PillarCard
            index={2}
            icon={<Leaf size={32} />}
            title="Circular Economy"
            desc="We believe in a world where premium gear doesn't end up in landfills. We give high-tech artifacts a well-deserved second life."
          />
          <PillarCard
            index={3}
            icon={<Globe size={32} />}
            title="Verified Network"
            desc="Our community consists of verified seekers and merchants, creating a secure portal for high-value tech exchanges."
          />
        </div>
      </section>

      {/* --- SECTION 3: IMPACT BY NUMBERS --- */}
      <section className="bg-slate-900 dark:bg-blue-900/10 py-20">
        <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
          <StatItem label="Active Seekers" val="50K+" />
          <StatItem label="Artifacts Traded" val="120K+" />
          <StatItem label="E-Waste Prevented" val="24.8T" />
          <StatItem label="Merchant Rating" val="4.9/5" />
        </div>
      </section>

      {/* --- SECTION 4: OUR STORY --- */}
      <section className="py-24 container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-[3rem] overflow-hidden border dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Sanctuary"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
              <Award size={48} />
            </div>
          </motion.div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                How it Started
              </h2>
              <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-lg">
              Founded in 2024, ReuseHub emerged from a simple realization:
              high-end gadgets are often discarded long before their utility
              ends. We envisioned a sanctuary where premium technology could be
              traded with the same confidence as buying new.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap size={20} />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  Rapid Deployment
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                  <Target size={20} />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  Focused Accuracy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: CALL TO ACTION --- */}
      <section className="py-24 container mx-auto px-4 text-center">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-blue-700 dark:bg-blue-600 p-12 md:p-20 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tight">
              Become a Part of the <br /> Ecosystem
            </h2>
            <p className="font-medium opacity-80 max-w-xl mx-auto text-lg">
              Whether you are seeking high-end gear or looking to offload an
              artifact, our sanctuary portal is open for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="bg-white text-blue-700 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
              >
                Start Your Journey
              </Link>
              <Link
                href="/explore"
                className="bg-transparent border border-white/40 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Explore Archives
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        </motion.div>
      </section>
    </div>
  );
};

// --- Helper Components ---

const PillarCard = ({ icon, title, desc, index }: any) => (
  <motion.div
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2 },
      }),
    }}
    className="p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
  >
    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-8 transition-transform group-hover:rotate-12 border dark:border-slate-800">
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
      {title}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

const StatItem = ({ label, val }: any) => (
  <div className="space-y-2">
    <h4 className="text-4xl md:text-5xl font-black">{val}</h4>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
      {label}
    </p>
  </div>
);

export default AboutPage;
