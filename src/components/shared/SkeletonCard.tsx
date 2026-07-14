'use client';
import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse flex flex-col h-full w-full">
      {/* ইমেজ প্লেসহোল্ডার */}
      <div className="h-56 bg-slate-100 dark:bg-slate-800 w-full" />

      {/* কন্টেন্ট প্লেসহোল্ডার */}
      <div className="p-6 space-y-4 flex-grow">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-10" />
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-5/6" />
        </div>

        <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-end">
          <div className="space-y-2">
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-lg w-12" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-20" />
          </div>
          <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>

        {/* বাটন প্লেসহোল্ডার */}
        <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl w-full mt-2" />
      </div>
    </div>
  );
};

export default SkeletonCard;
