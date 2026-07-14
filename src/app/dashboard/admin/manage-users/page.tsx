'use client';
import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Trash2,
  UserCheck,
  Search,
  Loader2,
  Mail,
  Shield,
  RotateCcw,
  UserCircle,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import PromoteAdminModal from './PromoteAdminModal';
import DeleteUserModal from './DeleteUsersModa';

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Combined Modal States
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  /**
   * Fetch all registered citizens from the sanctuary
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to sync citizen database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- HANDLERS ---

  const handlePromoteClick = (user: any) => {
    setSelectedUser(user);
    setIsPromoteModalOpen(true);
  };

  const confirmPromotion = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/make-admin/${selectedUser._id}`,
        { method: 'PATCH' },
      );
      if (res.ok) {
        toast.success(`${selectedUser.name} promoted successfully`);
        setIsPromoteModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Promotion failed');
    }
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmPurge = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        { method: 'DELETE' },
      );
      if (res.ok) {
        toast.success('Citizen and all archives purged');
        setIsDeleteModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Purge sequence failed');
    }
  };

  // Live Filtering Logic
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
          Scanning Database...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Reusable Modals */}
      <PromoteAdminModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        onConfirm={confirmPromotion}
        userName={selectedUser?.name || ''}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmPurge}
        userName={selectedUser?.name || ''}
      />

      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b dark:border-slate-800 pb-8 px-2">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Citizen Control
          </h1>
          <p className="text-slate-500 font-medium italic">
            Manage privileges and access for all sanctuary seekers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all shadow-sm"
          />
        </div>
      </header>

      {/* User Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b dark:border-slate-800">
                <th className="px-8 py-6">Identity Artifact</th>
                <th className="px-6 py-6 text-center">Auth Level</th>
                <th className="px-6 py-6 text-center">Registry Date</th>
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
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-black text-sm uppercase overflow-hidden border dark:border-slate-800">
                        {user.image ? (
                          <img
                            src={user.image}
                            className="w-full h-full object-cover"
                            alt="avatar"
                          />
                        ) : (
                          user.name.slice(0, 2)
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                          {user.name}
                        </p>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span
                      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20' : 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20'}`}
                    >
                      {user.role} Member
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
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handlePromoteClick(user)}
                          className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 rounded-xl transition-all cursor-pointer shadow-sm border border-transparent hover:border-blue-100"
                          title="Grant Authority"
                        >
                          <Shield size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-3 bg-slate-100 dark:bg-slate-800 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all cursor-pointer shadow-sm border border-transparent hover:border-rose-100"
                        title="Purge Archives"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
