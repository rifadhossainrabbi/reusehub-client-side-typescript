'use client';
import React, { useEffect, useState } from 'react';
import {
  Trash2,
  Search,
  Loader2,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
  Crown,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import PromoteAdminModal from './PromoteAdminModal';
import DeleteUserModal from './DeleteUsersModa'; // Ensure the file name is correct
import { useRouter } from 'next/navigation';
import { deleteData, getData, patchData } from '@/lib/api';

const ManageUsers = () => {
  // --- STATES ---
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  // Modal Control States
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  /**
   * Fetch users from sanctuary archives with pagination
   */
  /**
   * Fetch users from sanctuary archives with pagination
   */
  const fetchUsers = async (pageNum: number, showLoader = true) => {
    try {
      if (showLoader) setLoading(true); // শুধু প্রথমবার লোডার দেখাবে

      const data = await getData(`/api/admin/users?page=${pageNum}`);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Protocol Error: Could not sync citizen database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, true); // প্রথমে লোডার দেখাবে
  }, [page]);

  // Handle Role Toggle
  const handleToggleRole = async () => {
    if (!selectedUser) return;
    try {
      const data = await patchData(
        `/api/admin/users/toggle-role/${selectedUser._id}`,
        {},
      );

      toast.success(data.message);
      setIsPromoteModalOpen(false);
      fetchUsers(page, false); // সাইলেন্ট আপডেট
    } catch (err: any) {
      // এখানে সার্ভারের পাঠানো আসল মেসেজটি দেখাবে
      toast.error(err.message || 'Role synchronization failed');
    }
  };

  // Handle Account Purge
  const handlePurgeAccount = async () => {
    if (!selectedUser) return;
    try {
      const data = await deleteData(`/api/admin/users/${selectedUser._id}`);

      toast.success(data.message);
      setIsDeleteModalOpen(false);

      // ডিলিট করার পর লোডার ছাড়া ফেচ করবে (false পাঠানো হয়েছে)
      fetchUsers(page, false);
    } catch (err: any) {
      toast.error(err.message || 'Master purge protocol failed');
    }
  };
  // Local filtering for search bar
  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="font-black uppercase tracking-[0.4em] text-slate-400">
          Scanning Citizens...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700 px-2">
      <Toaster position="top-right" />

      {/* --- REUSABLE MODALS --- */}
      <PromoteAdminModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        onConfirm={handleToggleRole}
        userName={selectedUser?.name || ''}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handlePurgeAccount}
        userName={selectedUser?.name || ''}
      />

      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Citizen Management
          </h1>
          <p className="text-slate-500 font-medium italic">
            Granting privileges and maintaining sanctuary security.
          </p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search citizens..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all shadow-sm"
          />
        </div>
      </header>

      {/* --- CITIZEN TABLE --- */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b dark:border-slate-800">
                <th className="px-8 py-6">Identity Artifact</th>
                <th className="px-6 py-6 text-center">Auth Level</th>
                <th className="px-6 py-6 text-center">Joined Sanctuary</th>
                <th className="px-8 py-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filteredUsers.map(user => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      {/* Dynamic Avatar (Image or First 2 Letters) */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-sm uppercase overflow-hidden border-2 ${user.admin === 'master' ? 'border-amber-500 bg-amber-600' : 'border-blue-500 bg-blue-600'}`}
                      >
                        {user.image ? (
                          <img
                            src={user.image}
                            className="w-full h-full object-cover"
                            alt="avatar"
                          />
                        ) : (
                          user.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                          {user.name}{' '}
                          {user.admin === 'master' && (
                            <Crown size={14} className="text-amber-500" />
                          )}
                        </p>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span
                      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.admin === 'master' ? 'bg-amber-50 border-amber-200 text-amber-600' : user.role === 'admin' ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}
                    >
                      {user.admin === 'master'
                        ? 'Master Authority'
                        : `${user.role} Member`}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center text-xs font-bold text-slate-500 uppercase tracking-tighter">
                    {new Date(user.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      {user.admin !== 'master' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsPromoteModalOpen(true);
                            }}
                            className={`p-3 rounded-xl transition-all cursor-pointer shadow-sm border ${user.role === 'admin' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 border-transparent'}`}
                            title={
                              user.role === 'admin'
                                ? 'Demote to User'
                                : 'Promote to Admin'
                            }
                          >
                            <Shield size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-3 bg-slate-100 dark:bg-slate-800 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all cursor-pointer shadow-sm border border-transparent hover:border-rose-100"
                            title="Purge Citizen"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-900/30">
                          <Crown size={14} className="text-amber-600" />
                          <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-500 tracking-widest">
                            Protected
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      <div className="flex flex-col items-center gap-6 pt-10">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-2 px-4">
            <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-5 py-2 rounded-xl font-black text-sm">
              {page}
            </span>
            <span className="text-slate-300 font-bold uppercase text-[10px]">
              of
            </span>
            <span className="text-slate-500 font-bold">{totalPages}</span>
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
          Sanctuary Navigation Logs
        </p>
      </div>
    </div>
  );
};

export default ManageUsers;
