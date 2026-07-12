import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { commerceApi } from '@/services/commerce.api';
import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';

const Checkout = () => {
  const { items, subtotal, discount, tax, total, fetch } = useCartStore();
  const [provider, setProvider] = useState<'paystack' | 'stripe'>('paystack');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { data } = await commerceApi.createOrder({ provider });
      if (data.authorizationUrl) {
        // In production this redirects to Paystack/Stripe. With mock provider we go to verify.
        if (data.authorizationUrl.includes('/checkout/mock')) {
          navigate(`/checkout/verify?reference=${data.order.reference}`);
        } else {
          window.location.href = data.authorizationUrl;
        }
      } else {
        navigate(`/checkout/verify?reference=${data.order.reference}`);
      }
    } catch (e: any) {
      toast.error(e.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Nothing to checkout</h1>
        <Button className="mt-6" onClick={() => navigate('/courses')}>Browse Courses</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card space-y-5">
          <h2 className="text-lg font-bold">Payment Method</h2>
          {(['paystack', 'stripe'] as const).map((p) => (
            <label key={p} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${provider === p ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800'}`}>
              <input type="radio" name="provider" checked={provider === p} onChange={() => setProvider(p)} />
              <FiCreditCard className="text-brand-500" />
              <span className="font-medium capitalize">{p}</span>
            </label>
          ))}
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <FiLock /> Payments are secured with webhook verification. Configure provider keys in the server .env.
          </p>
        </div>

        <div className="card space-y-3">
          <h2 className="text-lg font-bold">Order Summary</h2>
          {items.map((item) => (
            <div key={item.product._id} className="flex justify-between text-sm">
              <span className="line-clamp-1 text-slate-600 dark:text-slate-300">{item.product.title}</span>
              <span>{formatCurrency(item.price)}</span>
            </div>
          ))}
          <div className="space-y-2 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>- {formatCurrency(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Tax</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-bold dark:border-slate-800">
              <span>Total</span><span className="gradient-text">{formatCurrency(total)}</span>
            </div>
          </div>
          <Button onClick={placeOrder} loading={loading} className="w-full">Pay {formatCurrency(total)}</Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
