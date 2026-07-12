import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '@/services/auth.api';
import Button from '@/components/ui/Button';

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm<{ email: string }>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success('If the email exists, a reset code was sent.');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="card">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="mt-1 text-sm text-slate-500">Enter your email to receive a reset code.</p>
        {sent ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
              Check your inbox for the reset code, then continue below.
            </p>
            <Link to="/reset-password" className="btn-primary w-full">Enter reset code</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <input type="email" className="input" placeholder="you@email.com" {...register('email', { required: true })} />
            <Button type="submit" loading={loading} className="w-full">Send reset code</Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-brand-600">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
