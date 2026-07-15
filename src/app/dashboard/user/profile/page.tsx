'use client';
import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  User,
  Mail,
  Shield,
  Camera,
  Save,
  Edit2,
  Loader2,
  Link as LinkIcon,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { patchData } from '@/lib/api';

const UserProfile = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });

  // সেশন ডাটা লোড হলে ফর্মে বসানো
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        image: user.image || '',
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // ১. আইডি ভ্যালিডেশন
    if (!user?.id) {
      return toast.error('Seeker identity not found. Please re-login.');
    }

    setLoading(true);
    const loadingToast = toast.loading('Updating sanctuary records...');

    try {
      // ২. শুধুমাত্র প্রয়োজনীয় ডাটা পেলোড হিসেবে পাঠানো
      const payload = {
        name: formData.name,
        image: formData.image,
      };

      // ৩. patchData ইউটিলিটি ব্যবহার করা হয়েছে
      const result = await patchData(`/api/users/${user.id}`, payload);

      toast.success(result.message || 'Identity updated successfully!', {
        id: loadingToast,
      });
      setIsEditing(false);

      // ৪. ব্রাউজার সেশন রিফ্রেশ করার জন্য ১.৫ সেকেন্ড পর রিলোড
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      // সার্ভারের আসল এরর মেসেজ দেখাবে
      toast.error(err.message || 'Connection protocol failed', {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="h-96 flex items-center justify-center animate-pulse text-blue-600 font-black uppercase tracking-widest">
        Identifying Seeker...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-right" />

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Account Identity
          </h1>
          <p className="text-slate-500 font-medium italic">
            Manage your public presence in the ReuseHub network.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${isEditing ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'}`}
        >
          {isEditing ? (
            'Cancel Edit'
          ) : (
            <>
              <Edit2 size={14} /> Edit Profile
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* বাম দিক: প্রোফাইল কার্ড */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl ring-2 ring-blue-500/20 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
              {user.image ? (
                <img
                  src={user.image}
                  alt="p"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <User size={60} className="text-slate-300" />
              )}
            </div>
            <div className="absolute bottom-2 right-2 bg-blue-600 p-2.5 rounded-full text-white shadow-lg">
              <Camera size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {user.name}
            </h3>
            <p className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1">
              <Shield size={12} /> Verified {user.role}
            </p>
          </div>

          <div className="w-full pt-6 border-t dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
              <Mail size={16} />{' '}
              <span className="text-sm font-medium">{user.email}</span>
            </div>
          </div>
        </div>

        {/* ডান দিক: আপডেট ফর্ম */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
              >
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                  <Shield size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-400">
                  Identity Encrypted
                </h4>
                <p className="text-sm text-slate-500 max-w-[250px]">
                  To change your information, click the edit button in the top
                  right corner.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleUpdate}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                      Legal Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent focus:ring-2 focus:ring-blue-600 rounded-2xl p-4 text-sm font-bold outline-none transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                      Avatar Artifact URL
                    </label>
                    <div className="relative">
                      <LinkIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        value={formData.image}
                        onChange={e =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent focus:ring-2 focus:ring-blue-600 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none transition-all"
                        placeholder="https://image-link.com"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {loading ? 'Syncing...' : 'Commit Changes'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
