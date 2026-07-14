'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, UserCheck, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const PromoteAdminModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          {/* Backdrop Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-default"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-950 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-blue-100 dark:border-blue-900/20 relative z-[160]"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer p-1"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              {/* Promotion Icon */}
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-600 border border-blue-100 dark:border-blue-900/30 shadow-inner">
                <ShieldCheck size={40} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Promote Seeker
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Are you sure you want to grant{' '}
                  <span className="text-blue-700 dark:text-blue-400 font-bold italic">
                    "{userName}"
                  </span>{' '}
                  administrative privileges?
                  <br />{' '}
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-2 block">
                    This action grants full sanctuary access.
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserCheck size={14} /> Grant Access
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromoteAdminModal;
