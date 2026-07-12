import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiUsers, FiBox, FiShoppingBag } from 'react-icons/fi';
import { adminApi } from '@/services/admin.api';
import { formatCurrency } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';

const AdminHome = () => {
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.analytics(30)])
      .then(([s, a]) => {
        setStats(s.data.stats);
        setAnalytics(a.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { icon: FiDollarSign, label: 'Total Revenue', value: formatCurrency(stats?.revenue || 0) },
    { icon: FiUsers, label: 'Students', value: stats?.students || 0 },
    { icon: FiUsers, label: 'Instructors', value: stats?.instructors || 0 },
    { icon: FiBox, label: 'Products', value: stats?.products || 0 },
    { icon: FiShoppingBag, label: 'Orders', value: stats?.orders || 0 },
  ];

  const maxRevenue = Math.max(...(analytics?.revenueByDay?.map((d: any) => d.revenue) || [1]), 1);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((c) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            whileHover={{ y: -4 }}
            className="card"
          >
            <c.icon className="text-2xl text-brand-500" />
            <p className="mt-3 text-xl font-bold">{c.value}</p>
            <p className="text-xs text-slate-500">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-bold">Revenue (last 30 days)</h2>
        {analytics?.revenueByDay?.length ? (
          <div className="flex h-48 items-end gap-1">
            {analytics.revenueByDay.map((d: any) => (
              <div key={d._id} className="group flex flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-brand-600 to-accent-500 transition group-hover:opacity-80"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                  title={`${d._id}: ${formatCurrency(d.revenue)}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-slate-500">No revenue data yet.</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-bold">Top Products</h2>
          <div className="space-y-3">
            {analytics?.topProducts?.map((p: any) => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <span className="line-clamp-1">{p.title}</span>
                <span className="text-slate-500">{p.views} views</span>
              </div>
            )) || <p className="text-slate-500">No data</p>}
          </div>
        </div>
        <div className="card">
          <h2 className="mb-4 text-lg font-bold">Platform Health</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Active users (30d)</span><span className="font-semibold">{analytics?.activeUsers || 0}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Conversion rate</span><span className="font-semibold">{(analytics?.conversionRate || 0).toFixed(1)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Pending reviews</span><span className="font-semibold">{stats?.pendingReviews || 0}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
