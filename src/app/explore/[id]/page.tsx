'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  ShoppingCart,
  ExternalLink,
  Award,
  Headphones,
  Laptop,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/shared/ProductCard';

const ProductDetailsById = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
      setSelectedImg(data.imageUrl);

      // ক্যাটাগরি অনুযায়ী রিলেটেড প্রোডাক্ট আনা
      const relRes = await fetch(
        `http://localhost:5000/api/products/related/${data.category}`,
      );
      const relData = await relRes.json();
      setRelated(relData.filter((p: any) => p._id !== id));
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest animate-pulse text-blue-600 italic">
        Accessing Artifact Archives...
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#020617] transition-colors duration-500 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 space-y-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <Link href="/">Home</Link> /{' '}
          <Link href="/explore">Browse Gadgets</Link> /{' '}
          <span className="text-blue-600">{product.title}</span>
        </div>

        {/* --- SECTION 1: TOP HERO (Image & Main Purchase Card) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Interactive Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 relative group shadow-sm">
              <motion.img
                key={selectedImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={selectedImg}
                alt={product.title}
                className="w-full h-full object-contain p-10"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                <button className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-lg border dark:border-slate-700">
                  <Rotate3D size={14} /> 360° View
                </button>
                <button className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-lg border dark:border-slate-700">
                  <PlayCircle size={14} /> Preview
                </button>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[
                product.imageUrl,
                product.imageUrl,
                product.imageUrl,
                product.imageUrl,
              ].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={`w-24 h-24 rounded-2xl border-2 shrink-0 overflow-hidden transition-all ${selectedImg === img ? 'border-blue-600 shadow-md scale-95' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="thumb"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Purchase Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex gap-2">
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                  Like New
                </span>
                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck size={10} /> Verified Listing
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
                  {product.title}
                </h1>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                  {product.shortDescription}
                </p>
              </div>

              <div className="flex items-center gap-4 py-4 border-y dark:border-slate-800">
                <p className="text-4xl font-black text-blue-700 dark:text-blue-500">
                  ${product.price.toLocaleString()}
                </p>
                <span className="text-slate-300 line-through font-bold text-xl">
                  ${(product.price * 1.2).toFixed(0)}
                </span>
                <span className="text-emerald-500 font-black text-sm ml-auto">
                  Save 14%
                </span>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                  Buy Now
                </button>
                <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                  <Heart size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4">
                <ActionLink icon={<ExternalLink size={14} />} label="Compare" />
                <ActionLink icon={<Share2 size={14} />} label="Share" />
                <ActionLink
                  icon={<MessageCircle size={14} />}
                  label="Contact"
                />
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-black text-lg">
                  TR
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm uppercase">
                    TechRevive Co.{' '}
                    <span className="text-blue-500 font-black">✓</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                      ★ 4.9
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      2.4k Sales
                    </span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">
                Message
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: PRODUCT OVERVIEW & SPECS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Product Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-lg italic">
                "{product.fullDescription}"
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  'M3 Max with 16-Core CPU',
                  '32GB Unified Memory',
                  '1TB Ultra-fast SSD',
                  'Liquid Retina XDR Display',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>{' '}
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Technical Specifications
              </h2>
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <SpecRow label="Brand" value="Apple" />
                <SpecRow label="Model" value={product.title} />
                <SpecRow label="Processor" value="Apple M3 Max (16-core)" />
                <SpecRow label="Graphics" value="40-Core GPU" />
                <SpecRow label="Storage" value="1TB SSD NVMe" />
                <SpecRow label="Condition" value="Certified Pre-owned" />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
              <h4 className="font-black uppercase text-xs tracking-widest mb-6">
                Buyer FAQ
              </h4>
              <div className="space-y-4">
                <FAQItem question="What does 'Like New' mean?" />
                <FAQItem question="Is the battery original?" />
                <FAQItem question="Can I return the item?" />
              </div>
            </div>
            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl relative overflow-hidden">
              <ShieldCheck
                size={40}
                className="opacity-20 absolute -top-2 -right-2 scale-150 rotate-12"
              />
              <h4 className="text-xl font-black uppercase flex items-center gap-2">
                <Award size={20} /> Buyer Protection
              </h4>
              <ul className="space-y-4 text-xs font-bold opacity-90">
                <li className="flex items-center gap-2">
                  <Check size={14} /> Secure payments via sanctuary portal.
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} /> 100% Money-back if item not as described.
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} /> Full tracking provided for every shipment.
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* --- SECTION 3: REVIEWS & RELATED --- */}
        <section className="space-y-12">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Summary */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center space-y-2">
              <p className="text-5xl font-black text-slate-900 dark:text-white">
                4.9
              </p>
              <div className="flex justify-center text-amber-500">
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Based on 148 reviews
              </p>
            </div>
            {/* Individual Review Sample */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReviewCard
                name="James D."
                date="2 days ago"
                text="Indistinguishable from brand new. The Space Black is gorgeous!"
              />
              <ReviewCard
                name="Maya L."
                date="1 week ago"
                text="Upgraded from M1 and the difference is night and day. Delivery was fast!"
              />
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Related Laptops
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

// --- Helper UI Components ---
const ActionLink = ({ icon, label }: any) => (
  <button className="flex flex-col items-center gap-1 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all cursor-pointer">
    {icon} {label}
  </button>
);

const SpecRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center p-6 border-b border-slate-50 dark:border-slate-800 last:border-none">
    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
      {label}
    </span>
    <span className="text-sm font-bold text-slate-900 dark:text-white">
      {value}
    </span>
  </div>
);

const FAQItem = ({ question }: { question: string }) => (
  <div className="flex justify-between items-center py-4 border-b dark:border-slate-800 last:border-none cursor-pointer group">
    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
      {question}
    </span>
    <ChevronDown size={14} className="text-slate-400" />
  </div>
);

const ReviewCard = ({ name, date, text }: any) => (
  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
          JD
        </div>
        <div>
          <p className="text-sm font-black dark:text-white">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold">{date}</p>
        </div>
      </div>
      <div className="flex text-amber-500">
        <Star size={10} fill="currentColor" />
        <Star size={10} fill="currentColor" />
        <Star size={10} fill="currentColor" />
        <Star size={10} fill="currentColor" />
        <Star size={10} fill="currentColor" />
      </div>
    </div>
    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
      "{text}"
    </p>
  </div>
);

// Missing Lucide Icons Helper (for this demo)
const Rotate3D = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-rotate-3d"
  >
    <path d="M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2" />
    <path d="m15.194 13.707 3.814 1.86-1.86 3.814" />
    <path d="M19 15.57c0-1.04-.316-2.031-.877-2.825" />
  </svg>
);
const PlayCircle = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-play-circle"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

export default ProductDetailsById;
