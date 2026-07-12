import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { commerceApi } from '@/services/commerce.api';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';

const Wishlist = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const add = useCartStore((s) => s.add);

  const load = () => {
    commerceApi.getWishlist().then(({ data }) => setProducts(data.wishlist?.products || [])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggle = async (id: string) => {
    await commerceApi.toggleWishlist(id);
    setProducts((p) => p.filter((x) => x._id !== id));
    toast.success('Removed from wishlist');
  };

  const addCart = async (id: string) => {
    await add(id);
    toast.success('Added to cart');
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Wishlist</h1>
      {products.length === 0 ? (
        <div className="card py-16 text-center text-slate-500">
          Your wishlist is empty. <Link to="/courses" className="text-brand-600">Explore courses</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <div key={p._id} className="card flex items-center gap-4">
              <div className="grid h-16 w-24 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600/20 to-accent-500/20 text-xs capitalize text-brand-500">
                {p.type}
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${p._id}`} className="line-clamp-1 font-semibold hover:text-brand-600">{p.title}</Link>
                <p className="font-bold gradient-text">{formatCurrency(p.price)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => addCart(p._id)} className="btn-primary px-3 py-1.5 text-sm"><FiShoppingCart /></button>
                <button onClick={() => toggle(p._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
