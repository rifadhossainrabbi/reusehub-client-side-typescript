'use client';
import React, { useEffect, useState } from 'react';
import {
  Trash2,
  CheckCircle,
  Star,
  Search,
  Loader2,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import DeleteConfirmModal from '../../user/my-list/DeleteConfiramtionModal';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { deleteData, getData, patchData } from '@/lib/api';

const ManageProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [productToPurge, setProductToPurge] = useState<any>(null);

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  // fetchProducts আপডেট করা হয়েছে
  const fetchProducts = async (pageNum: number, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const data = await getData(`/api/admin/products?page=${pageNum}`);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Archive synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleToggle = async (id: string, action: 'approve' | 'feature') => {
    const endpoint = action === 'approve' ? `approve/${id}` : `feature/${id}`;
    try {
      const data = await patchData(`/api/admin/products/${endpoint}`, {});
      toast.success(data.message || 'Protocol updated');
      fetchProducts(page, false); // সাইলেন্ট আপডেট
    } catch (err) {
      toast.error('Sync failed');
    }
  };

  const confirmPurge = async () => {
    if (!productToPurge) return;
    try {
      await deleteData(`/api/admin/products/${productToPurge._id}`);
      toast.success('Artifact erased from logs');
      setModalOpen(false);
      fetchProducts(page, false); // সাইলেন্ট আপডেট
    } catch (err) {
      toast.error('Purge failed');
    }
  };

  const openPurgeModal = (product: any) => {
    setProductToPurge(product);
    setModalOpen(true);
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="font-black uppercase tracking-[0.4em] text-slate-400">
          Indexing Archives...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 pb-20 px-2 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      <DeleteConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmPurge}
        title={productToPurge?.title || ''}
      />

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b dark:border-slate-800 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Product Control
          </h1>
          <p className="text-slate-500 font-medium">
            Moderating sanctuary artifacts across {totalPages} pages.
          </p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Filter current view..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b dark:border-slate-800">
                <th className="px-8 py-6">Gadget Metadata</th>
                <th className="px-6 py-6 text-center">Protocol Status</th>
                <th className="px-6 py-6 text-center">Value</th>
                <th className="px-8 py-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filteredProducts.map(product => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <Link
                        href={`/explore/${product._id}`}
                        className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 cursor-pointer shadow-sm"
                      >
                        <img
                          src={product.imageUrl}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt="p"
                        />
                      </Link>
                      <div>
                        <Link
                          href={`/explore/${product._id}`}
                          className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter hover:text-blue-600 cursor-pointer transition-colors block mb-1"
                        >
                          {product.title}
                        </Link>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                          <Tag size={10} /> {product.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span
                      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${product.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'}`}
                    >
                      {product.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <p className="text-lg font-black text-blue-700 dark:text-blue-400">
                      ${product.price.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      {product.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleToggle(product._id, 'approve')}
                          className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 rounded-xl transition-all cursor-pointer shadow-sm"
                          title="Approve Listing"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggle(product._id, 'feature')}
                        className={`p-3 rounded-xl transition-all cursor-pointer shadow-sm ${product.isFeatured ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600'}`}
                        title="Toggle Featured"
                      >
                        <Star
                          size={18}
                          fill={product.isFeatured ? 'currentColor' : 'none'}
                        />
                      </button>
                      <button
                        onClick={() => openPurgeModal(product)}
                        className="p-3 bg-slate-100 dark:bg-slate-800 text-rose-400 hover:bg-rose-50 rounded-xl transition-all cursor-pointer shadow-sm"
                        title="Purge Artifact"
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

      <div className="flex flex-col items-center gap-6 pt-10">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-5 py-2 rounded-xl font-black text-sm">
              {page}
            </span>
            <span className="text-slate-300 font-bold">of</span>
            <span className="text-slate-500 font-bold">{totalPages}</span>
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
