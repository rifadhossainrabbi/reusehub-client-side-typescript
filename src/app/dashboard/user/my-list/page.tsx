'use client';
import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  Edit3,
  Trash2,
  Eye,
  Box,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfiramtionModal';

const MyProductList = () => {
  const { data: session } = authClient.useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchMyProducts = async (page: number) => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      // Backend URL should ideally be in env variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(
        `${apiUrl}/api/my-products/${session.user.id}?page=${page}`,
      );
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Could not connect to sanctuary archives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts(currentPage);
  }, [session, currentPage]);

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const executeDelete = async () => {
    if (!selectedProduct) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/products/${selectedProduct._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Gadget erased from archives');
        setModalOpen(false);
        fetchMyProducts(currentPage); // Refresh current view
      }
    } catch (err) {
      toast.error('Deletion protocol failed');
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-blue-600 animate-pulse">
        <Loader2 className="animate-spin mr-2" /> ACCESSING LOGS...
      </div>
    );

  return (
    <div className="space-y-8 pb-20 px-2">
      <Toaster position="top-right" />

      {/* Reusable Delete Modal */}
      <DeleteConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={executeDelete}
        title={selectedProduct?.title || ''}
      />

      <header className="flex justify-between items-end border-b dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            My Listings
          </h1>
          <p className="text-slate-500 font-medium italic">
            Monitoring {products.length} active gadget entries.
          </p>
        </div>
        <Link
          href="/dashboard/user/add-product"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          + New Listing
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="py-32 bg-white dark:bg-slate-900 rounded-[3rem] text-center border border-dashed dark:border-slate-800">
          <Box className="mx-auto text-slate-200 mb-4" size={64} />
          <h3 className="text-xl font-bold text-slate-400">
            Your archive is currently empty.
          </h3>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div
                key={product._id}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt="p"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 space-y-6">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1 uppercase tracking-tighter">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
                    <p className="text-2xl font-black text-blue-700">
                      ${product.price}
                    </p>
                    <span className="text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-blue-600">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/explore/${product._id}`}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-all"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={`/dashboard/user/edit-product/${product._id}`}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-all"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex items-center justify-center hover:bg-red-50 text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optimized Pagination UI */}
          <div className="flex items-center justify-center space-x-6 pt-16">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 disabled:opacity-20 hover:text-blue-600 transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-3 font-black text-sm uppercase tracking-widest">
              <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-5 py-2.5 rounded-2xl">
                {currentPage}
              </span>
              <span className="text-slate-300">of</span>
              <span className="text-slate-500">{totalPages}</span>
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 disabled:opacity-20 hover:text-blue-600 transition-all cursor-pointer shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyProductList;
