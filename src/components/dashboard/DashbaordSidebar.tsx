'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  List,
  ShoppingBag,
  Package,
  UserCircle,
  Users,
  Box,
  LogOut,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard/user', icon: LayoutDashboard },
    {
      name: 'Add Product',
      path: '/dashboard/user/add-product',
      icon: PlusCircle,
    },
    { name: 'My Listings', path: '/dashboard/user/my-list', icon: List },
    { name: 'My Orders', path: '/dashboard/user/my-orders', icon: ShoppingBag },
    {
      name: 'Received Orders',
      path: '/dashboard/user/received-orders',
      icon: Package,
    },
    { name: 'My Profile', path: '/dashboard/user/profile', icon: UserCircle },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
    {
      name: 'Manage Users',
      path: '/dashboard/admin/manage-users',
      icon: Users,
    },
    {
      name: 'Manage Products',
      path: '/dashboard/admin/manage-products',
      icon: Box,
    },
    {
      name: 'System Profile',
      path: '/dashboard/admin/profile',
      icon: UserCircle,
    },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    /* 
       ১. sticky top-20: ন্যাভবার h-20 (80px) তাই সাইডবার ২০ থেকে শুরু হবে।
       ২. h-[calc(100vh-5rem)]: পুরো হাইট থেকে ন্যাভবারের জায়গা বাদ।
    */
    <aside className="hidden lg:flex w-72 sticky top-20 h-[calc(100vh-5rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col z-30">
      {/* প্রোফাইল কার্ড */}
      <div className="p-6 mb-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center space-x-4 border border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
            {user?.image ? (
              <img
                src={user.image}
                alt="p"
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.slice(0, 1)
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* নেভিগেশন লিঙ্কস */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {links.map(link => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center space-x-3 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <link.icon size={18} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* বটম অ্যাকশনস */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 w-full px-5 py-3 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all cursor-pointer"
        >
          <LogOut size={18} /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
