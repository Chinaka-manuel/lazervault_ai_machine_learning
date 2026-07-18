import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiDownload, FiPlayCircle, FiTrash2, FiMonitor } from 'react-icons/fi';
import { commerceApi } from '@/services/commerce.api';
import { formatCurrency, formatDate } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Purchases = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = () => {
    commerceApi.myOrders().then(({ data }) => setOrders(data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (orderId: string, productId: string) => {
    try {
      setRemoving(productId);
      await commerceApi.removePurchasedItem(orderId, productId);
      toast.success('Removed from your purchases');
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return <Spinner />;

  const paidOrders = orders.filter((o) => o.status === 'paid');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Purchases</h1>
      {paidOrders.length === 0 ? (
        <div className="card py-16 text-center text-slate-500">
          No purchases yet. <Link to="/courses" className="text-brand-600">Browse courses</Link>
        </div>
      ) : (
        paidOrders.map((order) => (
          <div key={order._id} className="card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{order.reference}</p>
                <p className="text-xs text-slate-500">{formatDate(order.paidAt || order.createdAt)}</p>
              </div>
              <Badge color="green">Paid • {formatCurrency(order.total)}</Badge>
            </div>
            <div className="space-y-3">
              {order.items.length === 0 && (
                <p className="border-t border-slate-100 pt-3 text-sm text-slate-400 dark:border-slate-800">
                  All items removed.
                </p>
              )}
              {order.items.map((item: any, i: number) => (
                <div key={item.product || i} className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <FiPlayCircle className="text-brand-500" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs capitalize text-slate-500">{item.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.product && (
                      <Link to={`/product/${item.product}`} className="btn-ghost px-3 py-1.5 text-sm">View</Link>
                    )}
                    {item.type === 'video' && item.product && (
                      <button onClick={() => navigate(`/dashboard/library/${item.product}`)} className="btn-primary px-3 py-1.5 text-sm">
                        <FiMonitor /> Watch
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/dashboard/library/${item.product}`)}
                      className={item.type === 'video' ? 'btn-ghost px-3 py-1.5 text-sm' : 'btn-primary px-3 py-1.5 text-sm'}
                    >
                      <FiDownload /> {item.type === 'video' ? 'Open' : 'Download'}
                    </button>
                    <button
                      onClick={() => remove(order._id, item.product)}
                      disabled={removing === item.product}
                      aria-label="Remove from purchases"
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Purchases;
