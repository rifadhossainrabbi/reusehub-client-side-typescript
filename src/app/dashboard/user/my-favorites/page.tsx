'use client';
import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Trash2, Eye, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const MyFavoritePage = () => {
  const { data: session } = authClient.useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/favorites/${session.user.id}`,
        );
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [session]);

  const removeFavorite = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFavorites(favorites.filter(fav => fav._id !== id));
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      toast.error('Removal failed');
    }
  };

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
          Saved Gadgets
        </h1>
        <p className="text-slate-500 font-medium">
          Items you've earmarked for your future collection.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] text-center border border-dashed border-slate-200 dark:border-slate-800">
          <Heart className="mx-auto text-slate-200 mb-4" size={60} />
          <h3 className="text-xl font-bold text-slate-400">
            Your wishlist is empty.
          </h3>
          <Link
            href="/explore"
            className="text-blue-600 font-bold hover:underline mt-2 block uppercase text-xs tracking-widest"
          >
            Discover Gadgets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map(fav => (
            <div
              key={fav._id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={fav.imageUrl}
                  alt={fav.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full text-[9px] font-black text-blue-700 uppercase tracking-widest">
                  {fav.category}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">
                  {fav.title}
                </h3>
                <p className="text-xl font-black text-blue-600">${fav.price}</p>
                <div className="flex gap-2 border-t dark:border-slate-800 pt-4">
                  <Link
                    href={`/explore/${fav.productId}`}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 py-3 rounded-xl flex items-center justify-center transition-all"
                  >
                    <Eye size={18} />
                  </Link>
                  <button
                    onClick={() => removeFavorite(fav._id)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 py-3 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Trash2 size={18} />
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

export default MyFavoritePage;
