// src/app/not-found.tsx
'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Home,
  ArrowLeft,
  Search,
  Package,
  User,
  Store,
  Heart,
  AlertTriangle,
  Compass,
} from 'lucide-react';

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Page title update
    document.title = '404 - Artifact Not Found | ReuseHub';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-[#020617] dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-20 overflow-hidden">
      <div className="max-w-5xl w-full mx-auto relative">
        {/* Background Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Animated Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-2xl animate-pulse" />

              {/* Main 404 Design */}
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[4rem] p-12 shadow-2xl shadow-blue-600/20">
                {/* Shield Icon Background */}
                <div className="absolute inset-0 opacity-10">
                  <ShieldAlert
                    size={300}
                    className="absolute -top-10 -right-10 text-white"
                  />
                </div>

                <div className="relative z-10 text-center">
                  {/* 404 Number */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-8xl md:text-9xl font-black text-white tracking-tighter leading-none"
                  >
                    404
                  </motion.div>

                  {/* Divider */}
                  <div className="w-24 h-1 bg-white/30 mx-auto my-6 rounded-full" />

                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                    className="flex justify-center"
                  >
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                      <AlertTriangle size={48} className="text-white" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-4 -right-4 bg-amber-500 p-3 rounded-2xl shadow-lg shadow-amber-500/30"
              >
                <Search size={20} className="text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/30"
              >
                <Package size={20} className="text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
              <ShieldAlert
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Sanctuary Protocol Error
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Artifact Not Found
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mt-4 leading-relaxed">
                The artifact you're seeking has either been relocated to another
                sanctuary or no longer exists in our archives.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all active:scale-95"
              >
                <Home size={18} />
                Return Home
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                Explore Other Sanctuaries
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all"
                >
                  <Compass size={14} />
                  Explore All
                </Link>
                <Link
                  href="/dashboard/user/my-favorites"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all"
                >
                  <Heart size={14} />
                  Your Favorites
                </Link>
                <Link
                  href="/dashboard/user/add-product"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all"
                >
                  <Package size={14} />
                  List Artifact
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
          <p>⚡ Sanctuary Master Protocol v2.0 • Artifact Not Found</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
