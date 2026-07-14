'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const ProductModalDelete: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          {/* ১. ব্যাকড্রপ এনিমেশন */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-default"
          />

          {/* ২. মোডাল কার্ড */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-950 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-rose-100 dark:border-rose-900/20 relative z-[160]"
          >
            {/* ক্লোজ বাটন */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              {/* মেইন ওয়ার্নিং আইকন */}
              <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] flex items-center justify-center text-rose-500 border border-rose-100 dark:border-rose-900/30 shadow-inner">
                <ShieldAlert size={40} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Erase Artifact
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-2">
                  You are about to permanently purge{' '}
                  <span className="text-rose-600 font-black italic">
                    "{title}"
                  </span>
                  .
                  <br />{' '}
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-2 block italic">
                    All linked orders and wishlists will be destroyed.
                  </span>
                </p>
              </div>

              {/* অ্যাকশন বাটনসমূহ */}
              <div className="flex w-full gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Trash2 size={14} /> Purge Log
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModalDelete;
