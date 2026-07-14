'use client';
import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  ShoppingBag,
  Trash2,
  Eye,
  Calendar,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import DeleteOrderModal from './DeleteOrderModal';

const MyOrderPage = () => {
  const { data: session } = authClient.useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  /**
   * Fetch all buy requests sent by the current user
   */
  const fetchMyOrders = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/my-orders/${session.user.id}`,
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      toast.error('Archive sync failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [session]);

  // Open Cancel Confirmation
  const handleCancelClick = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Execute Cancellation
  const confirmCancelOrder = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${selectedOrder._id}`,
        {
          method: 'DELETE',
        },
      );
      if (res.ok) {
        setOrders(orders.filter(o => o._id !== selectedOrder._id));
        toast.success('Purchase request revoked');
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error('Failed to cancel request');
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center text-blue-600 italic font-black uppercase animate-pulse">
        <Loader2 className="animate-spin mr-2" /> Syncing Orders...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-right" />

      {/* Reusable Delete Modal for Cancellation */}
      <DeleteOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCancelOrder}
        title={selectedOrder?.title || ''}
      />

      <header className="border-b dark:border-slate-800 pb-8 px-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Purchase Requests
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Track the status of gadgets you intend to acquire.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-24 rounded-[3rem] text-center border border-dashed dark:border-slate-800 shadow-inner">
          <ShoppingBag
            className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
            size={72}
          />
          <h3 className="text-xl font-bold text-slate-400">
            You haven't requested any gear yet.
          </h3>
          <Link
            href="/explore"
            className="text-blue-600 font-black uppercase text-xs mt-6 inline-block hover:underline tracking-widest cursor-pointer"
          >
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative"
            >
              {/* Image Section (Clickable) */}
              <Link
                href={`/explore/${order.productId}`}
                className="relative h-56 block overflow-hidden bg-slate-50 dark:bg-slate-950 cursor-pointer"
              >
                <img
                  src={order.imageUrl}
                  alt="gear"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-blue-700 uppercase tracking-widest border dark:border-slate-700">
                  PENDING APPROVAL
                </div>
              </Link>

              {/* Content Section */}
              <div className="p-8 space-y-5">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    {order.category || 'Gadget'}
                  </p>
                  {/* Name (Clickable) */}
                  <Link
                    href={`/explore/${order.productId}`}
                    className="block group/title cursor-pointer"
                  >
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter line-clamp-1 group-hover/title:text-blue-700 transition-colors">
                      {order.title}
                    </h3>
                  </Link>
                </div>

                <div className="flex justify-between items-center py-4 border-y dark:border-slate-800">
                  <p className="text-2xl font-black text-blue-700 dark:text-blue-500">
                    ${order.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                    <Calendar size={12} />{' '}
                    {new Date(order.orderedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Link href={`/explore/${order.productId}`} className="flex-1">
                    <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 transition-all cursor-pointer flex items-center justify-center gap-2">
                      <Eye size={14} /> View Artifact
                    </button>
                  </Link>
                  <button
                    onClick={() => handleCancelClick(order)}
                    className="p-4 bg-slate-50 dark:bg-slate-800 text-red-400 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer border border-transparent hover:border-red-100"
                    title="Cancel Request"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrderPage;
