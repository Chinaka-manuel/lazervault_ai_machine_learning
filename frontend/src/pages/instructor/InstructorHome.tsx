import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiUsers, FiBox, FiStar } from 'react-icons/fi';
import { instructorApi } from '@/services/admin.api';
import { formatCurrency } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import Spinner from '@/components/ui/Spinner';

const InstructorHome = () => {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instructorApi.analytics().then(({ data }) => setData(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const stats = [
    { icon: FiDollarSign, label: 'Revenue', value: formatCurrency(data?.revenue || 0) },
    { icon: FiUsers, label: 'Students', value: data?.studentCount || 0 },
    { icon: FiBox, label: 'Products', value: data?.products?.length || 0 },
    { icon: FiStar, label: 'Avg Rating', value: (data?.products?.reduce((a: number, p: any) => a + p.rating, 0) / (data?.products?.length || 1)).toFixed(1) },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <p className="text-slate-500">Welcome, {user?.name}. Here's how your content is performing.</p>

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
        <h2 className="mb-4 text-lg font-bold">My Products</h2>
        {(!data?.products || data.products.length === 0) ? (
          <p className="py-8 text-center text-slate-500">No products yet. Upload your first course!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Views</th>
                  <th className="pb-3">Downloads</th>
                  <th className="pb-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.products.map((p: any) => (
                  <tr key={p._id}>
                    <td className="py-3 font-medium">{p.title}</td>
                    <td className="py-3">{formatCurrency(p.price)}</td>
                    <td className="py-3">{p.views}</td>
                    <td className="py-3">{p.downloads}</td>
                    <td className="py-3">{p.rating?.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorHome;
