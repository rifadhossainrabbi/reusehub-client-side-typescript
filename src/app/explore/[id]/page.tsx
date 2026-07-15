'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  Clock,
  ArrowLeft,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Info,
  ChevronDown,
  Check,
  ExternalLink,
  Award,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Loader2,
  ShoppingCart,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/shared/ProductCard';
import toast, { Toaster } from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { getData, postData } from '@/lib/api';

const ProductDetailsById = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // --- COMPONENT STATES ---
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);

  // Derived state to check if current user is the owner
  const isOwner = session?.user?.id === product?.seller?.id;

  /**
   * Fetch all necessary data: Product Details, Related Items, and Favorite Status
   */
  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        setLoading(true);

        // ১. মেইন প্রোডাক্ট ডাটা
        const data = await getData(`/api/products/${id}`);
        setProduct(data);
        setSelectedImg(data.imageUrl);
        setFavCount(data.favoriteCount || 0);

        // ২. রিলেটেড আইটেমস
        const relData = await getData(`/api/products/related/${data.category}`);
        setRelated(relData.filter((p: any) => p._id !== id));

        // ৩. ফেভারিট স্ট্যাটাস চেক
        if (session?.user) {
          const favData = await getData(
            `/api/favorites/check?userId=${session.user.id}&productId=${id}`,
          );
          setIsFavorited(favData.isFavorited);
        }
      } catch (err: any) {
        toast.error(
          err.message || 'Protocol failure: Could not retrieve artifact',
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArchiveData();
  }, [id, session]);

  /**
   * Toggle favorite status and sync counter in real-time
   */
  const handleToggleFavorite = async () => {
    if (!session?.user)
      return toast.error('Identification required to save artifacts!');

    try {
      const data = await postData('/api/favorites/toggle', {
        userId: session.user.id,
        productId: product._id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        category: product.category,
      });

      setIsFavorited(data.isFavorited);
      setFavCount(prev =>
        data.isFavorited ? prev + 1 : Math.max(0, prev - 1),
      );
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message || 'Wishlist synchronization failed');
    }
  };

  /**
   * Send buy request to the owner (creates record in orders collection)
   */
  const handleBuyRequest = async () => {
    if (!session?.user)
      return toast.error('Identification required to purchase!');
    if (isOwner) return toast.error('Self-acquisition is forbidden!');

    setIsOrdering(true);
    const orderData = {
      productId: product._id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      sellerId: product.seller.id,
      buyerId: session.user.id,
      buyerName: session.user.name,
      buyerEmail: session.user.email,
    };

    try {
      await postData('/api/orders', orderData);
      toast.success('Request sent to seller successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Transmission failed');
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="font-black uppercase tracking-[0.5em] text-blue-600 animate-pulse">
          Syncing Artifact...
        </p>
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#020617] transition-colors duration-500 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 space-y-16">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>{' '}
          /
          <Link
            href="/explore"
            className="hover:text-blue-600 transition-colors mx-2"
          >
            Archives
          </Link>{' '}
          /<span className="text-blue-600 truncate">{product.title}</span>
        </div>

        {/* --- SECTION 1: HERO VIEW (Visuals & Sidebar) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Visual Box (Rotation/Video buttons removed) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 relative shadow-sm group">
              <motion.img
                key={selectedImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={selectedImg}
                alt={product.title}
                className="w-full h-full object-contain p-12"
              />
            </div>
            {/* Gallery Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {[1, 2, 3, 4].map(i => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(product.imageUrl)}
                  className={`w-24 h-24 rounded-3xl border-2 shrink-0 transition-all ${selectedImg === product.imageUrl ? 'border-blue-600 shadow-xl' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}
                >
                  <img
                    src={product.imageUrl}
                    className="w-full h-full object-cover p-2"
                    alt="thumb"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Interaction Sidebar */}
          <div className="lg:col-span-5 space-y-10 sticky top-28">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Sanctuary Pick
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                  <Heart
                    size={14}
                    className={isFavorited ? 'text-red-500 fill-red-500' : ''}
                  />{' '}
                  {favCount} Potential Seekers
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter">
                  {product.title}
                </h1>
                <p className="text-slate-400 font-bold text-sm leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              <div className="flex items-baseline gap-4 py-8 border-y dark:border-slate-800">
                <p className="text-5xl font-black text-blue-700 dark:text-blue-500">
                  ${product.price.toLocaleString()}
                </p>
                <span className="text-slate-300 line-through font-bold text-xl">
                  $ {(product.price * 1.25).toFixed(0)}
                </span>
              </div>

              {/* --- BUY BUTTON LOGIC --- */}
              <div className="flex gap-4">
                {isOwner ? (
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-center border dark:border-slate-700 opacity-80">
                    This is your listing
                  </div>
                ) : (
                  <button
                    onClick={handleBuyRequest}
                    disabled={isOrdering}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isOrdering ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                    {isOrdering ? 'Sending...' : 'Buy Artifact'}
                  </button>
                )}

                <button
                  onClick={handleToggleFavorite}
                  className={`p-5 rounded-2xl transition-all border shadow-sm cursor-pointer ${isFavorited ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100 dark:border-red-900/50 scale-110' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 border-transparent'}`}
                >
                  <Heart
                    size={24}
                    fill={isFavorited ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t dark:border-slate-800">
                <MiniAction icon={<ExternalLink size={14} />} label="Compare" />
                <MiniAction icon={<Share2 size={14} />} label="Share" />
                <MiniAction
                  icon={<MessageCircle size={14} />}
                  label="Merchant"
                />
              </div>
            </div>

            {/* Merchant Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-600 flex items-center justify-center text-blue-600 dark:text-white font-black text-xl">
                  TR
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-base">
                    TECHREVIVE CO. ✓
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Premium Merchant
                  </p>
                </div>
              </div>
              <button className="p-3 bg-white dark:bg-slate-800 text-blue-600 rounded-2xl shadow-sm hover:scale-110 transition-transform">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: DESCRIPTION & SPECS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Artifact Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-lg italic bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border dark:border-slate-800">
                "{product.fullDescription}"
              </p>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Technical Data
              </h2>
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <SpecRow
                  label="Sanctuary Registry"
                  value={`#${id?.slice(-8).toUpperCase()}`}
                />
                <SpecRow label="Architecture" value={product.category} />
                <SpecRow label="Deployment" value="Late 2023" />
                <SpecRow label="Security" value="Escrow Secured" />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800">
              <h4 className="font-black uppercase text-xs tracking-widest mb-10 opacity-50">
                Seeker Shield
              </h4>
              <div className="space-y-6">
                <FAQRow q="Sanctuary Inspection?" />
                <FAQRow q="Artifact Lineage?" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-700 to-blue-800 p-10 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
              <ShieldCheck
                size={40}
                className="opacity-30 absolute -top-2 -right-2 scale-150 rotate-12"
              />
              <h4 className="text-2xl font-black uppercase flex items-center gap-3">
                <Award size={24} /> Shield Active
              </h4>
              <ul className="space-y-5 text-sm font-bold opacity-80">
                <li className="flex items-center gap-3">
                  <Check size={16} /> 100% Repatriation Guarantee.
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} /> Full Tracking for Artifacts.
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* --- SECTION 3: SIMILAR ARTIFACTS --- */}
        <section className="space-y-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Similar Artifacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((item: any) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Local Mini UI Components ---
const MiniAction = ({ icon, label }: any) => (
  <button className="flex flex-col items-center gap-2 text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all cursor-pointer group">
    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-blue-50 transition-all">
      {icon}
    </div>
    {label}
  </button>
);

const SpecRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center p-8 border-b border-slate-50 dark:border-slate-800 last:border-none hover:bg-slate-50/30 transition-colors">
    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
      {label}
    </span>
    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">
      {value}
    </span>
  </div>
);

const FAQRow = ({ q }: any) => (
  <div className="flex justify-between items-center pb-6 border-b dark:border-slate-800 last:border-none cursor-pointer group">
    <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-all">
      {q}
    </span>
    <ChevronDown size={14} className="text-slate-400" />
  </div>
);

export default ProductDetailsById;
