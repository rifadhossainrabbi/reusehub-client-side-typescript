'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const FavDeleteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="text-center space-y-5">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 mx-auto border border-red-100 dark:border-red-900/30">
                <AlertTriangle size={30} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Remove from Wishlist?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Are you sure you want to remove{' '}
                <span className="text-slate-900 dark:text-white font-bold">
                  "{itemName}"
                </span>
                ? You can always add it back later from the gallery.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-pointer hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-red-600 text-white shadow-lg shadow-red-500/30 cursor-pointer hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Remove Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FavDeleteModal;
