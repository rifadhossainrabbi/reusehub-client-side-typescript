'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaThLarge,
  FaChevronDown,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isLoggedIn = !!user;

  // ১. ডাইনামিক ড্যাশবোর্ড পাথ (রোল অনুযায়ী)
  const dashboardPath =
    user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user';

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen)
      document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isProfileOpen]);

  if (!mounted) return null;

  // ৩. নেভিগেশন লিঙ্ক ফিল্টার
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Gadgets', path: '/explore' },
  ];

  if (user?.role === 'admin') {
    navLinks.push(
      { name: 'Manage Products', path: '/dashboard/admin/manage-products' }, // আপনার পাথ অনুযায়ী আপডেট করতে পারেন
      { name: 'Manage Users', path: '/dashboard/admin/manage-users' },
    );
  } else if (user?.role === 'user') {
    navLinks.push(
      { name: 'Add Product', path: '/dashboard/user/add-product' },
      { name: 'My Favorites', path: '/dashboard/user/my-favorites' },
    );
  }
  navLinks.push({ name: 'About', path: '/about' });

  const handleLogout = async () => {
    await authClient.signOut();
    setIsProfileOpen(false);
    setIsMobileOpen(false);
    router.push('/');
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-1 group cursor-pointer shrink-0"
          >
            <span className="text-2xl md:text-3xl font-black text-blue-700 dark:text-blue-500 tracking-tighter">
              ReuseHub
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-bold transition-all relative pb-1 group cursor-pointer hover:text-blue-700 dark:hover:text-blue-400 ${pathname === link.path ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {link.name}
                {pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-700 dark:bg-blue-400"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-90"
            >
              {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            {isLoggedIn ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-500 transition-all"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="p"
                      className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-black">
                      {getInitials(user.name || 'User')}
                    </div>
                  )}
                  <FaChevronDown
                    size={10}
                    className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl z-50 overflow-hidden py-2"
                    >
                      <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                          {user.role}
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-2">
                        {/* ৪. এখানে ডাইনামিক পাথ ব্যবহার করা হয়েছে */}
                        <Link
                          href={dashboardPath}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 transition-all"
                        >
                          <FaThLarge size={14} /> <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                        >
                          <FaSignOutAlt size={14} /> <span>Logout Session</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:block">
                <Link
                  href="/login"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-2.5 rounded-full text-sm font-black transition-all shadow-lg active:scale-95 block"
                >
                  Sign In
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <FaBars size={26} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 h-screen w-[85%] bg-white dark:bg-slate-900 z-[70] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-black text-blue-700 italic text-2xl tracking-tighter">
                  ReuseHub
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-gray-500 cursor-pointer"
                >
                  <FaTimes size={26} />
                </button>
              </div>

              {isLoggedIn && (
                <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl mb-8 border border-slate-100 dark:border-slate-800">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="p"
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center text-white font-black">
                      {getInitials(user.name!)}
                    </div>
                  )}
                  <div className="overflow-hidden text-ellipsis">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-3 flex-1 overflow-y-auto">
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`p-4 rounded-2xl font-bold transition-all ${pathname === link.path ? 'bg-blue-700 text-white shadow-lg shadow-blue-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    {/* ৫. মোবাইল ড্রয়ারেও ডাইনামিক ড্যাশবোর্ড পাথ */}
                    <Link
                      href={dashboardPath}
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full flex justify-center py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black uppercase text-xs"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer shadow-lg shadow-red-500/20"
                    >
                      Logout Session
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full text-center py-4 bg-blue-700 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-blue-500/20"
                  >
                    Sign In Now
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
