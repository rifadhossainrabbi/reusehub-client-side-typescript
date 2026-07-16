// src/app/seller/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Store,
  Package,
  Star,
  Mail,
  Loader2,
  Users,
  Award,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import { getData } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

const SellerProductsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const sellerId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!sellerId) return;
      setLoading(true);
      try {
        const data = await getData(
          `/api/products/seller/${sellerId}?page=${page}`,
        );
        setProducts(data.products || []);
        setSeller(data.seller || null);
        setTotalItems(data.totalItems || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch seller artifacts');
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [sellerId, page]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="font-black uppercase tracking-[0.5em] text-blue-600 animate-pulse">
          Loading Merchant Archive....
        </p>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-950">
        <p className="font-black text-2xl text-slate-600">Merchant not found</p>
        <Link href="/explore" className="text-blue-600 hover:underline">
          Return to Archives
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
      <Toaster position="top-right" />
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 space-y-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Explore
        </button>

        {/* Seller Profile Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900/80 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-blue-500/30 shrink-0">
              {seller.image ? (
                <img
                  src={seller.image}
                  alt={seller.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                seller.name?.slice(0, 2).toUpperCase() || 'TR'
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {seller.name || 'Unknown Merchant'}
                </h1>
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {seller.role === 'admin' ? 'Verified Merchant' : 'Seller'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  <span>{seller.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-blue-600" />
                  <span>{totalItems} Artifacts Listed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="fill-amber-500 text-amber-500" />
                  <span>4.8 (12 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                All Artifacts by {seller.name}
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                {totalItems} artifacts available
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed dark:border-slate-800">
              <Package size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-400">
                No artifacts found from this merchant
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((item: any) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 pt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl disabled:opacity-30 hover:text-blue-600 transition-all"
              >
                Previous
              </button>
              <span className="font-bold text-sm text-slate-500 dark:text-slate-400 flex items-center">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl disabled:opacity-30 hover:text-blue-600 transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductsPage;
