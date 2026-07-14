'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import SkeletonCard from '@/components/shared/SkeletonCard';
import ProductCard from '@/components/shared/ProductCard';
import toast, { Toaster } from 'react-hot-toast';

const ExploreProductsPage = () => {
  // Data States
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter and Search States (Requirement 6)
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Data Fetching Function
  const fetchProducts = async () => {
    setLoading(true);
    const queryString = new URLSearchParams({
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page: page.toString(),
    }).toString();

    try {
      const res = await fetch(
        `http://localhost:5000/api/products?${queryString}`,
      );
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('Failed to connect to sanctuary archives');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on filter or page change
  useEffect(() => {
    fetchProducts();
  }, [category, sort, page]);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  // Reset all filters to default
  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 space-y-10">
      <Toaster position="top-right" />

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b dark:border-slate-800 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Browse Gadgets
          </h1>
          <p className="text-blue-600 font-bold text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            {totalItems}+ Active Listings in Sanctuary
          </p>
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button className="p-2.5 bg-white dark:bg-slate-700 rounded-xl text-blue-700 dark:text-blue-400 shadow-sm transition-all">
            <LayoutGrid size={18} />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-slate-600 transition-all">
            <List size={18} />
          </button>
        </div>
      </div>

      {/* 2. Main Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="flex-1 relative w-full">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for MacBook, iPhone, high-end gear..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all font-bold text-slate-700 dark:text-slate-200"
          />
        </form>
        <button
          onClick={handleSearch}
          className="w-full lg:w-auto bg-blue-700 hover:bg-blue-800 text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
        >
          Search Now
        </button>
      </div>

      {/* 3. Content Area (Filter Sidebar + Grid) */}
      <div className="flex flex-col lg:flex-row gap-10 relative">
        {/* Sticky Filter Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[1rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-500">
                  <SlidersHorizontal size={18} />
                  <h3 className="font-black uppercase text-xs tracking-widest">
                    Filters
                  </h3>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm outline-none border-none appearance-none cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <option value="All">All Sanctuary Gear</option>
                    <option value="Smartphone">Smartphones</option>
                    <option value="Laptop">Laptops & PC</option>
                    <option value="Watch">Smart Watches</option>
                    <option value="Audio">Audio & Sound</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">
                    Budget Range ($)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="w-1/2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm outline-none placeholder:text-slate-400 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-1/2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm outline-none placeholder:text-slate-400 dark:text-white"
                    />
                  </div>
                </div>

                {/* Sorting Options */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">
                    Sort Artifacts
                  </label>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm outline-none border-none appearance-none cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>

                <button
                  onClick={fetchProducts}
                  className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95 cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>
            </div>

            {/* Promotion Sidebar Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
              <Sparkles size={24} />
              <h4 className="text-xl font-black uppercase leading-tight tracking-tight">
                VIP Access Coming Soon
              </h4>
              <p className="text-xs font-medium opacity-80 leading-relaxed">
                Verified sellers and early birds get 10% cash-back on every
                gadget listed this week.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Side Main Content */}
        <div className="flex-1 space-y-12">
          {/* Summer Sale Promo Banner (Resized to be more compact) */}
          <div className="bg-gradient-to-r from-blue-700 to-white-500 rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden shadow-md border-none">
            <div className="relative z-10 space-y-3">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-white/20">
                Limited Time Offer
              </span>
              <h2 className="text-2xl md:text-4xl font-black uppercase leading-none tracking-tight">
                Summer Gadget Sale
              </h2>
              <p className="font-bold text-sm opacity-90 max-w-sm">
                Up to 45% off premium pre-owned gear.
              </p>
              <button className="bg-white text-blue-700 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-md active:scale-95 cursor-pointer">
                Shop Deals
              </button>
            </div>
            {/* Background Decoration (Reduced size) */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[60px]"></div>
            <div className="absolute bottom-0 right-0 p-6 opacity-10 hidden lg:block">
              <LayoutGrid size={80} />
            </div>
          </div>

          {/* Product Grid (Requirement 4: 4 cards per row check) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 min-h-[400px]">
            {loading ? (
              [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
            ) : products.length > 0 ? (
              products.map((item: any) => (
                <ProductCard key={item._id} item={item} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed dark:border-slate-800">
                <Search size={48} className="mx-auto text-slate-300" />
                <h3 className="text-xl font-bold text-slate-400">
                  No artifacts found in this sanctuary.
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-blue-600 font-black uppercase text-xs tracking-widest hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* 4. Pagination (Requirement 6) */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-6 pt-10">
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex items-center gap-2 px-4">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${page === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all cursor-pointer"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                Sanctuary Navigation Archives
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreProductsPage;
