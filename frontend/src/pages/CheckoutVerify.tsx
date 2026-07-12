import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { commerceApi } from '@/services/commerce.api';
import { useCartStore } from '@/store/cartStore';
import Spinner from '@/components/ui/Spinner';

const CheckoutVerify = () => {
  const [params] = useSearchParams();
  const reference = params.get('reference');
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const clearCart = useCartStore((s) => s.reset);

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      return;
    }
    commerceApi
      .verifyPayment(reference)
      .then(() => {
        setStatus('success');
        clearCart();
      })
      .catch(() => setStatus('failed'));
  }, [reference, clearCart]);

  if (status === 'verifying') return <Spinner full />;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      {status === 'success' ? (
        <>
          <FiCheckCircle className="mb-4 h-20 w-20 text-green-500" />
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="mt-2 text-slate-500">Your purchase is complete. Access your content anytime.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/dashboard/purchases" className="btn-primary">View Purchases</Link>
            <Link to="/courses" className="btn-ghost">Keep Browsing</Link>
          </div>
        </>
      ) : (
        <>
          <FiXCircle className="mb-4 h-20 w-20 text-red-500" />
          <h1 className="text-3xl font-bold">Payment Failed</h1>
          <p className="mt-2 text-slate-500">We couldn't verify your payment. Please try again.</p>
          <Link to="/cart" className="btn-primary mt-6">Back to Cart</Link>
        </>
      )}
    </div>
  );
};

export default CheckoutVerify;
