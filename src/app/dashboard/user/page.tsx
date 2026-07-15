'use client';
import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Package,
  Heart,
  Clock,
  Activity,
  Zap,
  Loader2,
  ArrowRight,
  ShieldCheck,
  PieChart as PieIcon,
  BarChart3,
  DollarSign,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const DashboardUserHomePage = () => {
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const COLORS = ['#2563eb', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    setIsMounted(true);
    const fetchIntel = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/user-intel/${session.user.id}`,
        );
        const data = await res.json();
        setIntel(data);
      } catch (err) {
        toast.error('Failed to sync sanctuary intel');
      } finally {
        setLoading(false);
      }
    };
    fetchIntel();
  }, [session]);

  if (loading || !isMounted)
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
          Decoding Sanctuary Intelligence...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000 px-2">
      <Toaster position="top-right" />

      {/* 1. TOP STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Inventory Value"
          val={`$${intel.summary.totalValue.toLocaleString()}`}
          icon={<TrendingUp />}
          color="text-emerald-500"
          bg="bg-emerald-50 dark:bg-emerald-950/30"
        />
        <StatCard
          label="Avg. Item Price"
          val={`$${Math.round(intel.summary.avgPrice)}`}
          icon={<DollarSign />}
          color="text-blue-500"
          bg="bg-blue-50 dark:bg-blue-950/30"
        />
        <StatCard
          label="Conversion Intent"
          val={intel.totalRequests}
          icon={<Target />}
          color="text-indigo-500"
          bg="bg-indigo-50 dark:bg-indigo-950/30"
        />
        <StatCard
          label="Trust Status"
          val="99.9%"
          icon={<ShieldCheck />}
          color="text-purple-500"
          bg="bg-purple-50 dark:bg-purple-950/30"
        />
      </div>

      {/* 2. MAIN ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Engagement Area Chart (Left) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center gap-3 text-blue-600 border-b dark:border-slate-800 pb-4">
            <Activity size={20} />
            <h3 className="font-black uppercase text-xs tracking-widest">
              Artifact Popularity index
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={intel.chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(203, 213, 225, 0.1)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="favs"
                  stroke="#2563eb"
                  strokeWidth={4}
                  fill="url(#glow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Mix Pie Chart (Right) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 text-purple-600 border-b dark:border-slate-800 pb-4 mb-6">
            <PieIcon size={20} />
            <h3 className="font-black uppercase text-xs tracking-widest">
              Inventory Mix
            </h3>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={intel.categoryMix}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {intel.categoryMix.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">
            Distribution by category
          </p>
        </div>
      </div>

      {/* 3. CONDITION & ACTIVITY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Condition Breakdown Bar Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 border-b dark:border-slate-800 pb-4 mb-8">
            <BarChart3 size={20} />
            <h3 className="font-black uppercase text-xs tracking-widest">
              Gear Condition
            </h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intel.conditionMix}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 9 }}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full">
          <h4 className="font-black uppercase text-xs tracking-widest mb-10 pb-4 border-b dark:border-slate-800">
            Intelligence Feed
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {intel.recentRequests.map((req: any) => (
              <div
                key={req._id}
                className="p-5 bg-slate-50 dark:bg-slate-950 rounded-3xl border dark:border-slate-800 space-y-3 group"
              >
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Heart size={18} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase truncate">
                    {req.title}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                    Seeker: {req.buyerName}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/user/my-list"
            className="mt-10 flex items-center justify-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline"
          >
            Enter Sanctuary Vault <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ label, val, icon, color, bg }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
    <div
      className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-inner`}
    >
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">
      {label}
    </p>
    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
      {val}
    </h3>
  </div>
);

export default DashboardUserHomePage;
