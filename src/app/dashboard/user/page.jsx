'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, Clock, CheckCircle } from 'lucide-react';

const DashboardUserHomePage = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* ওয়েলকাম হেডার */}
      <header>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Overview
        </h1>
        <p className="text-slate-500 font-medium">
          Welcome back! Here's what's happening with your gear.
        </p>
      </header>

      {/* স্ট্যাটস গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: 'Active Listings',
            val: '12',
            icon: <Package />,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            name: 'Total Earned',
            val: '$4,250',
            icon: <TrendingUp />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          },
          {
            name: 'Pending Orders',
            val: '03',
            icon: <Clock />,
            color: 'text-orange-600',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
          },
          {
            name: 'Completed',
            val: '48',
            icon: <CheckCircle />,
            color: 'text-purple-600',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div
              className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">
              {stat.name}
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stat.val}
            </h3>
          </div>
        ))}
      </div>

      {/* প্রোোগ্রেস কার্ড (স্ক্রিনশট স্টাইল) */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">
            Listing Score
          </h4>
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-slate-100 dark:border-t-slate-800 flex items-center justify-center text-[10px] font-black">
            45%
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl flex justify-between items-center">
            <span className="text-xs font-bold text-red-600">
              Image Quality
            </span>
            <span className="text-[10px] font-black uppercase bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded text-red-600">
              Low
            </span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-600">
              Description
            </span>
            <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded text-emerald-600">
              Good
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUserHomePage;
