import { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin.api';
import { formatCurrency, formatDate } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.orders().then(({ data }) => setOrders(data.orders || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-3">Reference</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Items</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="py-3 font-mono text-xs">{o.reference}</td>
                <td className="py-3">{o.user?.name || '—'}</td>
                <td className="py-3">{o.items.length}</td>
                <td className="py-3 font-semibold">{formatCurrency(o.total)}</td>
                <td className="py-3">
                  <Badge color={o.status === 'paid' ? 'green' : o.status === 'pending' ? 'amber' : 'slate'}>{o.status}</Badge>
                </td>
                <td className="py-3 text-slate-500">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="py-12 text-center text-slate-500">No orders yet.</p>}
      </div>
    </div>
  );
};

export default AdminOrders;
