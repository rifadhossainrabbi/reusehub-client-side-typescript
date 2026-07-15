'use client';
import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  ShieldCheck,
  Mail,
  Camera,
  Save,
  Edit2,
  Loader2,
  Link as LinkIcon,
  Crown,
  Settings,
  Users,
  Box,
  TrendingUp,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProfilePage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [systemStats, setStats] = useState({ users: 0, products: 0 });
  const [formData, setFormData] = useState({ name: '', image: '' });

  // Load user data and system stats
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        image: user.image || '',
      });

      // Fetch system overview stats
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`)
        .then(res => res.json())
        .then(data =>
          setStats(prev => ({ ...prev, users: data.users?.length || 0 })),
        );

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`)
        .then(res => res.json())
        .then(data =>
          setStats(prev => ({ ...prev, products: data.totalItems || 0 })),
        );
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    const loadingToast = toast.loading('Syncing admin credentials...');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();

      if (res.ok) {
        toast.success('Archives updated successfully!', { id: loadingToast });
        setIsEditing(false);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(data.message, { id: loadingToast });
      }
    } catch (err) {
      toast.error('Protocol failure', { id: loadingToast });
    } finally {
      setUpdating(false);
    }
  };

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20 px-2">
      <Toaster position="top-right" />

      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            Administrator Profile
          </h1>
          <p className="text-slate-500 font-medium italic">
            Manage sanctuary core identity and system privileges.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-xl ${isEditing ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'}`}
        >
          {isEditing ? (
            'Cancel Protocol'
          ) : (
            <>
              <Settings size={14} /> Edit Identity
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: AUTH CARD */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-6 relative overflow-hidden">
            {/* Master Decoration */}
            <div className="absolute -top-10 -right-10 opacity-5 dark:opacity-10 text-blue-600">
              <ShieldCheck size={200} />
            </div>

            <div className="relative group">
              <div
                className={`w-44 h-44 rounded-[2.5rem] overflow-hidden border-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-all ${user.role === 'admin' ? 'border-amber-400 ring-4 ring-amber-400/10' : 'border-blue-500 ring-4 ring-blue-500/10'}`}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt="admin"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShieldCheck size={80} className="text-slate-200" />
                )}
              </div>
              <div
                className={`absolute -bottom-2 -right-2 p-3 rounded-2xl text-white shadow-lg ${user.role === 'admin' ? 'bg-amber-500' : 'bg-blue-600'}`}
              >
                <Crown size={20} />
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {user.name}
              </h3>
              <p
                className={`font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 ${user.role === 'admin' ? 'text-amber-600' : 'text-blue-600'}`}
              >
                <ShieldCheck size={12} /> Sanctuary{' '}
                {(user as any).admin === 'master' ? 'Master' : 'Admin'}
              </p>
            </div>

            <div className="w-full pt-6 border-t dark:border-slate-800 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
              <Mail size={16} className="text-blue-600" /> {user.email}
            </div>
          </div>

          {/* SYSTEM OVERVIEW MINI STATS */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                Global Citizens
              </p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-blue-600" />{' '}
                {systemStats.users}
              </h4>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                Active Artifacts
              </p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white justify-end flex items-center gap-2">
                {systemStats.products}{' '}
                <Box size={18} className="text-blue-600" />
              </h4>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: UPDATE PORTAL */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="static"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
              >
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-600 border border-blue-100 dark:border-blue-900/30">
                  <Settings size={40} className="animate-spin-slow" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Security Protocol Active
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
                    Click the button in the header to modify administrator
                    records.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="editing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleUpdate}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-2">
                      Administrative Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent focus:ring-2 focus:ring-blue-600 rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                      placeholder="Enter legal name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-2">
                      Artifact Image URL
                    </label>
                    <div className="relative">
                      <LinkIcon
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={formData.image}
                        onChange={e =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent focus:ring-2 focus:ring-blue-600 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                        placeholder="https://sanctuary.com/admin.jpg"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.8rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {updating ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {updating ? 'Committing Changes...' : 'Commit Update'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
