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
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/shared/ProductCard';
import toast, { Toaster } from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const ProductDetailsById = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Data States
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState('');

  // Real-time UI States
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);

  // Initial Data Fetching
  useEffect(() => {
    const fetchArtifactData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Main Product Details
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setSelectedImg(data.imageUrl);
        setFavCount(data.favoriteCount || 0); // Initialize from DB

        // 2. Fetch Related Items from the same category
        const relRes = await fetch(
          `http://localhost:5000/api/products/related/${data.category}`,
        );
        const relData = await relRes.json();
        setRelated(relData.filter((p: any) => p._id !== id));

        // 3. Check current user favorite status
        if (session?.user) {
          const favRes = await fetch(
            `http://localhost:5000/api/favorites/check?userId=${session.user.id}&productId=${id}`,
          );
          const favData = await favRes.json();
          setIsFavorited(favData.isFavorited);
        }
      } catch (err) {
        toast.error('Failed to retrieve artifact data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArtifactData();
  }, [id, session]);

  /**
   * Toggles Favorite state in DB and syncs count locally
   */
  const handleToggleFavorite = async () => {
    if (!session?.user)
      return toast.error('Identification required to preserve artifact!');

    try {
      const res = await fetch(`http://localhost:5000/api/favorites/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product._id,
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          category: product.category,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setIsFavorited(data.isFavorited);
        // Syncing counter: 5 to 6 or 6 to 5
        setFavCount(prev =>
          data.isFavorited ? prev + 1 : Math.max(0, prev - 1),
        );
        toast.success(data.message);
      }
    } catch (err) {
      toast.error('Sync to archives failed');
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black uppercase tracking-[0.4em] animate-pulse text-blue-600">
        Accessing Artifact...
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#020617] transition-colors duration-500 min-h-screen">
      <Toaster position="top-right" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 space-y-16">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>{' '}
          /
          <Link
            href="/explore"
            className="hover:text-blue-600 transition-colors mx-2"
          >
            Explore
          </Link>{' '}
          /<span className="text-blue-600 truncate">{product.title}</span>
        </div>

        {/* --- SECTION 1: VISUALS & PURCHASE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Visual Gallery (Removed Rotation/Video) */}
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
                  className={`w-24 h-24 rounded-3xl border-2 shrink-0 transition-all ${selectedImg === product.imageUrl ? 'border-blue-600 shadow-lg' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}
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

          {/* Pricing Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    Mint Condition
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                  <Heart
                    size={14}
                    className={isFavorited ? 'text-red-500 fill-red-500' : ''}
                  />{' '}
                  {favCount} Interested
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

              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all cursor-pointer">
                  Acquire Artifact
                </button>
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
                <SidebarAction
                  icon={<ExternalLink size={14} />}
                  label="Compare"
                />
                <SidebarAction icon={<Share2 size={14} />} label="Share" />
                <SidebarAction
                  icon={<MessageCircle size={14} />}
                  label="Merchant"
                />
              </div>
            </div>

            {/* Merchant Display */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                  TR
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm uppercase">
                    TECHREVIVE CO. ✓
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Verified Premium Seller
                  </p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 text-blue-600 rounded-xl text-[10px] font-black uppercase">
                Message
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: SPECIFICATIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Artifact Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-lg italic bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border dark:border-slate-800">
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
                <SpecRow label="Condition" value="Certified Pre-owned" />
                <SpecRow
                  label="Seller"
                  value={product.seller?.name || 'Premium Merchant'}
                />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
              <h4 className="font-black uppercase text-xs tracking-widest mb-6 opacity-60">
                Seeker Shield
              </h4>
              <ul className="space-y-6">
                <FAQItem
                  title="Secure Portal"
                  desc="Every transaction is encrypted and verified."
                />
                <FAQItem
                  title="Inspected Artifacts"
                  desc="Undergoes rigorous tech health checks."
                />
              </ul>
            </div>
            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
              <ShieldCheck size={40} className="opacity-30" />
              <h4 className="text-xl font-black uppercase">Buyer Protection</h4>
              <p className="text-xs font-bold opacity-80 leading-relaxed">
                Full repatriation of funds if the artifact doesn't match
                sanctuary logs.
              </p>
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
const SidebarAction = ({ icon, label }: any) => (
  <button className="flex flex-col items-center gap-2 text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all cursor-pointer group">
    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-blue-50 transition-all">
      {icon}
    </div>
    {label}
  </button>
);

const SpecRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center p-8 border-b border-slate-50 dark:border-slate-800 last:border-none">
    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
      {label}
    </span>
    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">
      {value}
    </span>
  </div>
);

const FAQItem = ({ title, desc }: any) => (
  <div className="space-y-1">
    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">
      {title}
    </p>
    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
      {desc}
    </p>
  </div>
);

export default ProductDetailsById;
