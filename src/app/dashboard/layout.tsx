'use client';
import DashboardSidebar from '@/components/dashboard/DashbaordSidebar';
import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    /* 
       flex-row ব্যবহার করা হয়েছে যাতে সাইডবার বামে এবং কন্টেন্ট ডানে থাকে।
       bg-slate-50 ডার্ক মোডে বদলে যাবে।
    */
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      {/* বাম দিকে ডাইনামিক সাইডবার */}
      <DashboardSidebar />

      {/* ডান দিকে মেইন কন্টেন্ট এরিয়া */}
      <main className="flex-1 p-4 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
