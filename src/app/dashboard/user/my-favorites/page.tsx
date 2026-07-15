'use client';
import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  Trash2,
  Eye,
  Heart,
  Loader2,
  Package,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import FavDeleteModal from './FavDeleteModal';

const MyFavoritePage = () => {
  const { data: session } = authClient.useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchFavorites = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${session.user.id}`,
      );
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      toast.error('Wishlist sync failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [session]);

  const openDeleteModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${selectedItem._id}`,
        {
          method: 'DELETE',
        },
      );
      if (res.ok) {
        setFavorites(favorites.filter(fav => fav._id !== selectedItem._id));
        toast.success('Artifact removed from wishlist');
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error('Removal protocol failed');
    }
  };

  if (loading)
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Syncing Wishlist...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <Toaster position="top-right" />

      {/* Confirmation Modal */}
      <FavDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedItem?.title || ''}
      />

      <header className="border-b dark:border-slate-800 pb-8 px-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Saved Artifacts
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Manage gadgets you have earmarked for future acquisition.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-24 rounded-[3rem] text-center border border-dashed dark:border-slate-800 shadow-inner">
          <Heart
            className="mx-auto text-slate-200 dark:text-slate-800 mb-6"
            size={72}
          />
          <h3 className="text-xl font-bold text-slate-400">
            Your wishlist is empty.
          </h3>
          <Link
            href="/explore"
            className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all cursor-pointer shadow-lg"
          >
            Discover Gear
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b dark:border-slate-800">
                  <th className="px-8 py-6">Gadget Info</th>
                  <th className="px-6 py-6 text-center">Category</th>
                  <th className="px-6 py-6 text-center">Price</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {favorites.map(fav => (
                  <tr
                    key={fav._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <Link
                          href={`/explore/${fav.productId}`}
                          className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 cursor-pointer ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all"
                        >
                          <img
                            src={fav.imageUrl}
                            alt="p"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </Link>
                        <div>
                          <Link
                            href={`/explore/${fav.productId}`}
                            className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter hover:text-blue-600 cursor-pointer transition-colors block mb-1"
                          >
                            {fav.title}
                          </Link>
                          <p className="text-[10px] font-bold text-slate-400">
                            Added on{' '}
                            {new Date(fav.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                        {fav.category}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        ${fav.price.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link href={`/explore/${fav.productId}`}>
                          <button
                            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => openDeleteModal(fav)}
                          className="p-3 bg-slate-100 dark:bg-slate-800 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-sm"
                          title="Remove from Wishlist"
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
      )}
    </div>
  );
};

export default MyFavoritePage;
