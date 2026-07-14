'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Tag, ArrowUpRight } from 'lucide-react';

// Props Interface (Requirement: TypeScript Mandatory)
interface ProductCardProps {
  item: {
    _id: string;
    title: string;
    category: string;
    price: number;
    imageUrl: string;
    shortDescription: string;
    createdAt?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full">
      {/* 1. Clickable Image Section */}
      <Link
        href={`/explore/${item._id}`}
        className="relative h-56 overflow-hidden bg-slate-50 dark:bg-slate-950 block cursor-pointer"
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm z-10">
          <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
            <Tag size={10} /> {item.category}
          </p>
        </div>
      </Link>

      {/* 2. Content Section */}
      <div className="p-6 flex flex-col flex-grow space-y-3">
        <div className="flex justify-between items-start gap-2">
          {/* Title also made clickable for better UX */}
          <Link
            href={`/explore/${item._id}`}
            className="cursor-pointer group/title"
          >
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight line-clamp-1 group-hover/title:text-blue-700 transition-colors">
              {item.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold">4.9</span>
          </div>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed flex-grow">
          {item.shortDescription}
        </p>

        {/* 3. Price & Action Button Row */}
        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
              Offer Price
            </p>
            <p className="text-2xl font-black text-blue-700 dark:text-blue-500">
              ${item.price}
            </p>
          </div>

          <Link href={`/explore/${item._id}`}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg cursor-pointer"
              title="View Details"
            >
              <ArrowUpRight size={20} />
            </motion.button>
          </Link>
        </div>

        {/* 4. Full Width View Details Button (Fixed at Bottom) */}
        <Link href={`/explore/${item._id}`} className="block pt-2">
          <button className="w-full py-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 hover:text-white transition-all duration-300 cursor-pointer active:scale-95">
            View Artifact Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
