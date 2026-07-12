import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '@/services/auth.api';
import Button from '@/components/ui/Button';

interface FormValues {
  token: string;
  password: string;
}

const ResetPassword = () => {
  const [params] = useSearchParams();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { token: params.get('token') || '' },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ token, password }: FormValues) => {
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="card">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <input className="input" placeholder="Reset code" {...register('token', { required: true })} />
          <input type="password" className="input" placeholder="New password" {...register('password', { required: true, minLength: 8 })} />
          <Button type="submit" loading={loading} className="w-full">Reset password</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-brand-600">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
