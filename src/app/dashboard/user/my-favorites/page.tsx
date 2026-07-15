'use client';
import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  Trash2,
  Eye,
  Heart,
  Loader2,
  Calendar,
  Tag,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import FavDeleteModal from './FavDeleteModal';
import { useRouter } from 'next/navigation';

const MyFavoritePage = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
  
    useEffect(() => {
      if (!isPending && !session) {
        router.replace('/login');
      }
    }, [session, isPending, router]);

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
        { method: 'DELETE' },
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
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
          Syncing Wishlist...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 px-2 md:px-4">
      <Toaster position="top-right" />
      <FavDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedItem?.title || ''}
      />

      {/* Header Section */}
      <header className="border-b dark:border-slate-800 pb-8">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Saved Artifacts
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-medium mt-2 italic">
          Refining your earmarked sanctuary collection.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-16 md:p-24 rounded-[3rem] text-center border border-dashed dark:border-slate-800 shadow-inner">
          <Heart
            className="mx-auto text-slate-200 dark:text-slate-800 mb-6"
            size={64}
          />
          <h3 className="text-xl font-bold text-slate-400">
            Your wishlist is currently empty.
          </h3>
          <Link
            href="/explore"
            className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all cursor-pointer"
          >
            Explore archives
          </Link>
        </div>
      ) : (
        <>
          {/* --- 1. DESKTOP TABLE VIEW (Visible on LG screens and up) --- */}
          <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b dark:border-slate-800">
                    <th className="px-8 py-6">Gadget Metadata</th>
                    <th className="px-6 py-6 text-center">Category</th>
                    <th className="px-6 py-6 text-center">Valuation</th>
                    <th className="px-8 py-6 text-right">Moderation</th>
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
                            className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 cursor-pointer border dark:border-slate-800"
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
                            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                              <Calendar size={10} />{' '}
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
                      <td className="px-6 py-6 text-center font-black text-slate-900 dark:text-white">
                        ${fav.price.toLocaleString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/explore/${fav.productId}`}
                            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => openDeleteModal(fav)}
                            className="p-3 bg-slate-100 dark:bg-slate-800 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer"
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

          {/* --- 2. MOBILE & TABLET CARD VIEW (Visible on screens below LG) --- */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map(fav => (
              <div
                key={fav._id}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6"
              >
                <div className="flex items-center gap-4">
                  <Link
                    href={`/explore/${fav.productId}`}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0"
                  >
                    <img
                      src={fav.imageUrl}
                      alt="p"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate">
                      {fav.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase">
                        {fav.category}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                        <DollarSign size={10} />
                        {fav.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t dark:border-slate-800">
                  <Link href={`/explore/${fav.productId}`} className="flex-1">
                    <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                      <Eye size={14} /> View
                    </button>
                  </Link>
                  <button
                    onClick={() => openDeleteModal(fav)}
                    className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Purge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyFavoritePage;
