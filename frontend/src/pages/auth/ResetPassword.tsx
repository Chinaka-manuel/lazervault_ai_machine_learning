import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '@/services/auth.api';
import Button from '@/components/ui/Button';
import PasswordField from '@/components/ui/PasswordField';

interface FormValues {
  token: string;
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [params] = useSearchParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { token: params.get('token') || '' },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = async ({ token, password, confirmPassword }: FormValues) => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
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
          <PasswordField
            register={register}
            label="New password"
            placeholder="New password"
            autoComplete="new-password"
            error={errors.password?.message}
            validation={{ required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } }}
          />
          <PasswordField
            register={register}
            name="confirmPassword"
            label="Confirm new password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            validation={{
              required: 'Please confirm your password',
              validate: (value: string) => value === password || 'Passwords do not match',
            }}
          />
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
