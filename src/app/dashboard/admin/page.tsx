'use client';
import React, { useEffect, useState } from 'react';
import {
  Users,
  Box,
  Clock,
  ShoppingCart,
  Activity,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Star,
  Heart,
  DollarSign,
  CheckCircle2,
  UserCog,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { getData } from '@/lib/api';

const AdminDashboardHomePage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    setIsMounted(true);
    const fetchAdminData = async () => {
      try {
        const result = await getData('/api/admin/dashboard-stats');

        if (!result?.summary) {
          throw new Error('Malformed analytics payload');
        }
        setData(result);
      } catch (err: any) {
        console.error('Dashboard sync error', err);
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const COLORS = [
    '#2563eb',
    '#8b5cf6',
    '#f59e0b',
    '#10b981',
    '#ef4444',
    '#ec4899',
  ];
  const STATUS_COLORS: Record<string, string> = {
    approved: '#10b981',
    pending: '#f59e0b',
    rejected: '#ef4444',
    completed: '#2563eb',
  };

  if (loading || !isMounted)
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          Authenticating System Intel...
        </p>
      </div>
    );

  if (error || !data?.summary)
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4 text-center px-4">
        <ShieldCheck className="text-red-500" size={40} />
        <p className="text-sm font-black uppercase tracking-widest text-red-500">
          System Intel Unreachable
        </p>
        <p className="text-xs text-slate-400 max-w-sm">
          {error || 'No analytics data returned from server.'} Nishchit koro
          backend (localhost:5000) run hocche ebong{' '}
          <code className="text-blue-500">/api/admin/dashboard-stats</code>{' '}
          route thik ache.
        </p>
      </div>
    );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700 px-2">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            System Terminal
          </h1>
          <p className="text-slate-500 font-medium italic">
            Global sanctuary oversight and artifact distribution analytics.
          </p>
        </div>
        <div className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
          <ShieldCheck size={20} />
          <span className="text-xs font-black uppercase tracking-widest">
            Administrator Access
          </span>
        </div>
      </header>

      {/* --- GLOBAL STATS GRID (8 cards) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          label="Total Seekers"
          val={data.summary.totalUsers}
          icon={<Users />}
          color="text-blue-600"
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <AdminStatCard
          label="Live Artifacts"
          val={data.summary.totalProducts}
          icon={<Box />}
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-900/20"
        />
        <AdminStatCard
          label="Pending Verifications"
          val={data.summary.pendingProducts}
          icon={<Clock />}
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-900/20"
        />
        <AdminStatCard
          label="Exchange Requests"
          val={data.summary.totalOrders}
          icon={<ShoppingCart />}
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <AdminStatCard
          label="Approved Artifacts"
          val={data.summary.approvedProducts}
          icon={<CheckCircle2 />}
          color="text-green-600"
          bg="bg-green-50 dark:bg-green-900/20"
        />
        <AdminStatCard
          label="Featured Items"
          val={data.summary.featuredProducts}
          icon={<Star />}
          color="text-yellow-600"
          bg="bg-yellow-50 dark:bg-yellow-900/20"
        />
        <AdminStatCard
          label="Total Wishlists"
          val={data.summary.totalFavorites}
          icon={<Heart />}
          color="text-pink-600"
          bg="bg-pink-50 dark:bg-pink-900/20"
        />
        <AdminStatCard
          label="Avg. Price"
          val={data.summary.avgPrice}
          icon={<DollarSign />}
          color="text-indigo-600"
          bg="bg-indigo-50 dark:bg-indigo-900/20"
          prefix="৳"
        />
      </div>

      {/* --- ROW 2: CATEGORY BAR + STATUS PIE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ChartCard
          title="Inventory Distribution by Architecture"
          icon={<Activity size={20} />}
          color="text-blue-600"
          span="lg:col-span-8"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categoryStats}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(203, 213, 225, 0.2)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar
                dataKey="value"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Approval Status"
          icon={<TrendingUp size={20} />}
          color="text-purple-600"
          span="lg:col-span-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.statusStats}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.statusStats.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* --- ROW 3: USER GROWTH + LISTING TREND --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard
          title="Seeker Growth Trend"
          icon={<Users size={20} />}
          color="text-blue-600"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.userGrowth}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(203, 213, 225, 0.2)"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#2563eb"
                fill="url(#userGrad)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Artifact Listing Trend"
          icon={<Box size={20} />}
          color="text-purple-600"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.listingTrend}>
              <defs>
                <linearGradient id="listGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(203, 213, 225, 0.2)"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="listings"
                stroke="#8b5cf6"
                fill="url(#listGrad)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* --- ROW 4: TOP SELLERS + TOP FAVORITED + ORDER STATUS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartCard
          title="Top 5 Sellers"
          icon={<UserCog size={18} />}
          color="text-emerald-600"
          height="h-[260px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topSellers} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar
                dataKey="listings"
                fill="#10b981"
                radius={[0, 6, 6, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top 5 Favorited"
          icon={<Heart size={18} />}
          color="text-pink-600"
          height="h-[260px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topFavorited} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar
                dataKey="favorites"
                fill="#ec4899"
                radius={[0, 6, 6, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Order Status"
          icon={<ShoppingCart size={18} />}
          color="text-amber-600"
          height="h-[260px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.orderStatusStats}
                innerRadius={40}
                outerRadius={65}
                paddingAngle={5}
                dataKey="value"
              >
                {data.orderStatusStats.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: '9px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* --- ROW 5: PRICE DISTRIBUTION --- */}
      <ChartCard
        title="Price Range Distribution"
        icon={<DollarSign size={20} />}
        color="text-indigo-600"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.priceStats}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(203, 213, 225, 0.2)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            <Bar
              dataKey="value"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* --- ROW 6: RECENT ACTIVITY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentListCard
          title="Recent Seekers"
          items={data.recentUsers?.map((u: any) => ({
            primary: u.name || 'Unnamed',
            secondary: u.email,
          }))}
        />
        <RecentListCard
          title="Recent Artifacts"
          items={data.recentProducts?.map((p: any) => ({
            primary: p.title,
            secondary: `৳${p.price} · ${p.status}`,
          }))}
        />
        <RecentListCard
          title="Recent Requests"
          items={data.recentOrders?.map((o: any) => ({
            primary: `Order · ${o.status}`,
            secondary: o.productId,
          }))}
        />
      </div>

      <Link
        href="/dashboard/admin/manage-products"
        className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 py-4 rounded-2xl text-blue-600 font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all max-w-md mx-auto"
      >
        Manage All Artifacts <ArrowRight size={14} />
      </Link>
    </div>
  );
};

// --- Sub Components ---
const AdminStatCard = ({ label, val, icon, color, bg, prefix }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
    <div
      className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-inner`}
    >
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
      {label}
    </p>
    <h3 className="text-3xl font-black text-slate-900 dark:text-white">
      {prefix}
      {(val ?? 0).toLocaleString()}
    </h3>
  </div>
);

const ChartCard = ({ title, icon, color, span, height, children }: any) => (
  <div
    className={`${span || ''} bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8`}
  >
    <div
      className={`flex items-center gap-3 ${color} border-b dark:border-slate-800 pb-4`}
    >
      {icon}
      <h3 className="font-black uppercase text-xs tracking-widest">{title}</h3>
    </div>
    <div className={`${height || 'h-[350px]'} w-full`}>{children}</div>
  </div>
);

const RecentListCard = ({ title, items }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
    <h3 className="font-black uppercase text-xs tracking-widest text-slate-500">
      {title}
    </h3>
    <div className="space-y-3">
      {items?.length ? (
        items.map((item: any, i: number) => (
          <div
            key={i}
            className="flex flex-col border-b border-slate-50 dark:border-slate-800 pb-3 last:border-0"
          >
            <span className="text-sm font-bold text-slate-800 dark:text-white truncate">
              {item.primary}
            </span>
            <span className="text-xs text-slate-400 truncate">
              {item.secondary}
            </span>
          </div>
        ))
      ) : (
        <p className="text-xs text-slate-400 italic">No recent data</p>
      )}
    </div>
  </div>
);

export default AdminDashboardHomePage;
