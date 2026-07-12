import { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin.api';
import { formatCurrency, formatDate } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.products().then(({ data }) => setProducts(data.products || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-3">Title</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Instructor</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Views</th>
              <th className="pb-3">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="py-3 font-medium">{p.title}</td>
                <td className="py-3"><Badge>{p.type}</Badge></td>
                <td className="py-3 text-slate-500">{p.instructor?.name || '—'}</td>
                <td className="py-3">{formatCurrency(p.price)}</td>
                <td className="py-3">{p.views}</td>
                <td className="py-3 text-slate-500">{formatDate(p.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="py-12 text-center text-slate-500">No products yet.</p>}
      </div>
    </div>
  );
};

export default AdminProducts;
