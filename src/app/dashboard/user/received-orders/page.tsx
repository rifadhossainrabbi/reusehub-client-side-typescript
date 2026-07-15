'use client';
import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { User, Mail, Calendar, Package, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ReceivedOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/received/${session.user.id}`,
        );
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        toast.error('Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [session]);

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      <header>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Received Requests
        </h1>
        <p className="text-slate-500 font-medium">
          Manage potential buyers interested in your sanctuary gear.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] text-center border border-dashed dark:border-slate-800">
          <Package className="mx-auto text-slate-200 mb-4" size={64} />
          <h3 className="text-xl font-bold text-slate-400">
            No purchase requests yet.
          </h3>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:shadow-md transition-all"
            >
              {/* Product Thumbnail */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-950">
                <img
                  src={order.imageUrl}
                  alt="p"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Order Details */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {order.title}
                </h3>
                <p className="text-blue-600 font-black text-xl">
                  ${order.price}
                </p>
              </div>

              {/* Seeker (Buyer) Info */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center border-t md:border-t-0 md:border-l dark:border-slate-800 pt-6 md:pt-0 md:pl-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Potential Seeker
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <User size={14} className="text-blue-600" />{' '}
                    {order.buyerName}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Mail size={12} /> {order.buyerEmail}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Requested On
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <Calendar size={14} className="text-blue-600" />{' '}
                    {new Date(order.orderedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                Approve & Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedOrders;
