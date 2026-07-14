'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaChevronRight,
} from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Home', path: '/' },
      { name: 'Explore Gadgets', path: '/explore' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ],
    categories: [
      { name: 'Smartphones', path: '/explore?category=smartphone' },
      { name: 'Laptops', path: '/explore?category=laptop' },
      { name: 'Watches', path: '/explore?category=watch' },
      { name: 'Accessories', path: '/explore?category=accessories' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Sustainability', path: '/impact' },
    ],
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-20 pb-8 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          {/* ১. ব্র্যান্ড ইনফো */}
          <div className="space-y-8 flex flex-col items-center md:items-start">
            <Link href="/" className="inline-block group cursor-pointer">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-black text-blue-700 dark:text-blue-500 tracking-tighter block"
              >
                ReuseHub
              </motion.span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto md:mx-0">
              The most trusted marketplace for pre-owned premium electronics.
              Giving tech a second life while saving the planet.
            </p>
            {/* সোশ্যাল আইকন */}
            <div className="flex space-x-4 justify-center md:justify-start">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{
                      y: -5,
                      backgroundColor: '#1d4ed8',
                      color: '#fff',
                    }}
                    className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800 transition-all cursor-pointer"
                  >
                    <Icon size={14} />
                  </motion.a>
                ),
              )}
            </div>
          </div>

          {/* ২. প্ল্যাটফর্ম লিঙ্ক */}
          <div className="lg:pl-10">
            <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.3em] mb-8 opacity-50">
              Platform
            </h4>
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="group flex items-center text-slate-500 dark:text-slate-400 font-bold text-sm cursor-pointer w-fit"
                  >
                    <span className="hidden md:inline-block w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-blue-600">
                      <FaChevronRight size={10} className="mr-2" />
                    </span>
                    <span className="group-hover:text-blue-700 dark:group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৩. ক্যাটাগরি লিঙ্ক */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.3em] mb-8 opacity-50">
              Categories
            </h4>
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              {footerLinks.categories.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="group flex items-center text-slate-500 dark:text-slate-400 font-bold text-sm cursor-pointer w-fit"
                  >
                    <span className="hidden md:inline-block w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-blue-600">
                      <FaChevronRight size={10} className="mr-2" />
                    </span>
                    <span className="group-hover:text-blue-700 dark:group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৪. কন্টাক্ট ইনফো */}
          <div className="space-y-8 flex flex-col items-center md:items-start">
            <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.3em] mb-8 opacity-50">
              Get in Touch
            </h4>
            <div className="space-y-6 w-full flex flex-col items-center md:items-start">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 group cursor-pointer justify-center md:justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                  <FaEnvelope size={14} />
                </div>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-700 transition-colors">
                  support@reusehub.com
                </span>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 group cursor-pointer justify-center md:justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                  <FaPhoneAlt size={14} />
                </div>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-700 transition-colors">
                  +880 1234 567 890
                </span>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start space-x-4 group cursor-pointer justify-center md:justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                  <FaMapMarkerAlt size={14} />
                </div>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-700 transition-colors leading-relaxed text-center md:text-left">
                  Tech Square, Gulshan-2
                  <br /> Dhaka, Bangladesh
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* বটম বার */}
        <div className="pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-center">
          <p className="text-slate-500 dark:text-slate-600 text-[11px] font-black uppercase tracking-[0.2em]">
            © {currentYear} ReuseHub. Distilling tech wisdom since 2024.
          </p>
          <div className="flex space-x-10 justify-center">
            <Link
              href="/privacy"
              className="relative group text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase cursor-pointer tracking-[0.2em]"
            >
              Privacy Scroll
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/terms"
              className="relative group text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase cursor-pointer tracking-[0.2em]"
            >
              Terms of Wisdom
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
