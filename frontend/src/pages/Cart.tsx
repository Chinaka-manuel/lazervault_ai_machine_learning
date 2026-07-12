import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';

const Cart = () => {
  const { items, subtotal, discount, tax, total, fetch, remove, applyCoupon } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleCoupon = async () => {
    try {
      await applyCoupon(coupon);
      toast.success('Coupon applied');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <FiShoppingBag className="mb-4 h-16 w-16 text-slate-300" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Discover premium AI & ML courses and resources.</p>
        <Link to="/courses" className="btn-primary mt-6">Browse Courses</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.product._id} className="card flex items-center gap-4">
              <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-600/20 to-accent-500/20">
                {item.product.thumbnail ? (
                  <img src={item.product.thumbnail} alt={item.product.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-brand-500 capitalize">{item.product.type}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${item.product._id}`} className="line-clamp-1 font-semibold hover:text-brand-600">
                  {item.product.title}
                </Link>
                <p className="text-sm capitalize text-slate-500">{item.product.type}</p>
              </div>
              <p className="font-bold">{formatCurrency(item.price)}</p>
              <button onClick={() => remove(item.product._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Remove">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="card sticky top-24 space-y-4">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="flex gap-2">
              <input className="input" placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button onClick={handleCoupon} className="btn-ghost px-4">Apply</button>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              {discount > 0 && <Row label="Discount" value={`- ${formatCurrency(discount)}`} accent />}
              <Row label="Tax" value={formatCurrency(tax)} />
              <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-bold dark:border-slate-800">
                <span>Total</span>
                <span className="gradient-text">{formatCurrency(total)}</span>
              </div>
            </div>
            <Button onClick={() => navigate('/checkout')} className="w-full">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span className={accent ? 'text-green-600' : ''}>{value}</span>
  </div>
);

export default Cart;
