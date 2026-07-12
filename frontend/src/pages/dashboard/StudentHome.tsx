import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiDownload, FiHeart, FiPlayCircle } from 'react-icons/fi';
import { commerceApi } from '@/services/commerce.api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate } from '@/utils/format';
import { staggerContainer, staggerItem } from '@/utils/motion';

const StudentHome = () => {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    commerceApi.myOrders().then(({ data }) => setOrders(data.orders || [])).catch(() => {});
    commerceApi.myDownloads().then(({ data }) => setDownloads(data.downloads || [])).catch(() => {});
    commerceApi.getWishlist().then(({ data }) => setWishlist(data.wishlist?.products || [])).catch(() => {});
  }, []);

  const paid = orders.filter((o) => o.status === 'paid');
  const purchasedItems = paid.flatMap((o) => o.items);

  const stats = [
    { icon: FiShoppingBag, label: 'Purchases', value: purchasedItems.length },
    { icon: FiDownload, label: 'Downloads', value: downloads.length },
    { icon: FiHeart, label: 'Wishlist', value: wishlist.length },
    { icon: FiPlayCircle, label: 'Orders', value: orders.length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500">Here's your learning overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            whileHover={{ y: -4 }}
            className="card"
          >
            <s.icon className="text-2xl text-brand-500" />
            <p className="mt-3 text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Link to="/dashboard/purchases" className="text-sm text-brand-600">View all</Link>
        </div>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No orders yet. <Link to="/courses" className="text-brand-600">Start learning</Link></p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o._id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800">
                <div>
                  <p className="font-medium">{o.reference}</p>
                  <p className="text-xs text-slate-500">{formatDate(o.createdAt)} • {o.items.length} items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(o.total)}</p>
                  <span className={`text-xs ${o.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
