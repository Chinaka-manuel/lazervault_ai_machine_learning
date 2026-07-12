import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiDownload, FiPlayCircle } from 'react-icons/fi';
import { commerceApi } from '@/services/commerce.api';
import { formatCurrency, formatDate } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Purchases = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    commerceApi.myOrders().then(({ data }) => setOrders(data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const download = async (productId: string) => {
    try {
      const { data } = await commerceApi.requestDownload(productId);
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      } else {
        toast.success('Download prepared');
      }
    } catch (e: any) {
      toast.error(e.message);
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
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
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
                    <button onClick={() => download(item.product)} className="btn-primary px-3 py-1.5 text-sm">
                      <FiDownload /> Download
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
