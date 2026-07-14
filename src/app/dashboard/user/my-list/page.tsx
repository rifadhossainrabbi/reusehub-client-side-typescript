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
      const res = await fetch(
        `http://localhost:5000/api/my-products/${session.user.id}?page=${page}`,
      );
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts(currentPage);
  }, [session, currentPage]);

  const confirmDelete = (product: any) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const executeDelete = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${selectedProduct._id}`,
        {
          method: 'DELETE',
        },
      );
      if (res.ok) {
        toast.success('Gadget erased');
        setModalOpen(false);
        fetchMyProducts(currentPage); // ডাটা রিফ্রেশ
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <Toaster position="top-right" />

      {/* মোডাল ইমপ্লিমেন্টেশন */}
      <DeleteConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={executeDelete}
        title={selectedProduct?.title || ''}
      />

      <header className="flex justify-between items-end border-b dark:border-slate-800 pb-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            My Listings
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your {products.length} listed items across {totalPages}{' '}
            pages.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="h-96 flex items-center justify-center text-blue-600">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] text-center border border-dashed border-slate-200 dark:border-slate-800">
          <Box className="mx-auto text-slate-300 mb-4" size={60} />
          <h3 className="text-xl font-bold text-slate-400">
            The sanctuary is empty.
          </h3>
          <Link
            href="/dashboard/user/add-product"
            className="text-blue-600 font-black uppercase text-xs mt-4 block hover:underline tracking-widest"
          >
            List Product Now
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div
                key={product._id}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1 uppercase tracking-tight">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
                    <p className="text-2xl font-black text-blue-600">
                      ${product.price}
                    </p>
                    <span className="text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-blue-700">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/explore/${product._id}`}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-3 rounded-xl flex items-center justify-center transition-all"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={`/dashboard/user/edit-product/${product._id}`}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-3 rounded-xl flex items-center justify-center transition-all"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button
                      onClick={() => confirmDelete(product)}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 p-3 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination UI */}
          <div className="flex items-center justify-center space-x-4 pt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:text-blue-600 transition-all cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center space-x-2 font-black text-sm">
              <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-900/30">
                {currentPage}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">{totalPages}</span>
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:text-blue-600 transition-all cursor-pointer"
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
