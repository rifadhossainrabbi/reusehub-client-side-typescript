'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { getData } from '@/lib/api';

const FeaturedSection = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // getData অটোমেটিক বেইজ ইউআরএল হ্যান্ডেল করবে
        const data = await getData('/api/products/featured');
        if (Array.isArray(data)) {
          setFeatured(data.slice(0, 6)); // ঠিক ৬টি কার্ড দেখানোর জন্য
        }
      } catch (err: any) {
        console.error('Fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-24 container mx-auto px-4 md:px-10 space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-900 pb-8">
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]"
          >
            <Sparkles size={14} /> Curated Selection
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase">
            Featured{' '}
            <span className="text-blue-700 dark:text-blue-500 italic">
              Artifacts
            </span>
          </h2>
        </div>
        <Link
          href="/explore"
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
        >
          Browse Archive{' '}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-2 transition-transform"
          />
        </Link>
      </div>

      {/* Grid Layout (Requirement: 3 columns for 6 cards in 2 rows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading
          ? // Show 6 skeletons while loading
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          : featured.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 dark:border-slate-900 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden relative"
              >
                {/* Clickable Media Area */}
                <Link
                  href={`/explore/${product._id}`}
                  className="relative h-64 m-2 rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-slate-900 block cursor-pointer"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-700 shadow-xl">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                </Link>

                {/* Info Content */}
                <div className="p-8 space-y-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {product.category}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-black text-xl">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter line-clamp-1 group-hover:text-blue-700 transition-colors">
                    {product.title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed flex-grow">
                    {product.shortDescription}
                  </p>

                  {/* View Details Button (Dynamic Route) */}
                  <Link href={`/explore/${product._id}`} className="block pt-4">
                    <button className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 cursor-pointer">
                      View Full Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
