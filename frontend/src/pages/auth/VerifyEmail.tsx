import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '@/services/auth.api';
import Button from '@/components/ui/Button';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const { register, handleSubmit } = useForm<{ token: string }>({
    defaultValues: { token: params.get('token') || '' },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ token }: { token: string }) => {
    setLoading(true);
    try {
      await authApi.verifyEmail(token);
      toast.success('Email verified!');
      navigate('/dashboard');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="card">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="mt-1 text-sm text-slate-500">Enter the 6-digit code sent to your email.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <input className="input text-center text-lg tracking-widest" placeholder="123456" {...register('token', { required: true })} />
          <Button type="submit" loading={loading} className="w-full">Verify</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/dashboard" className="font-semibold text-brand-600">Skip for now</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
