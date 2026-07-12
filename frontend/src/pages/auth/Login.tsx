import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { authApi } from '@/services/auth.api';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import { scaleIn } from '@/utils/motion';

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(values);
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome back, ${data.user.name}!`);
      const dest = data.user.role === 'admin' ? '/admin' : data.user.role === 'instructor' ? '/instructor' : from;
      navigate(dest, { replace: true });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <motion.div className="card" variants={scaleIn} initial="hidden" animate="visible">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Login to access your LazerVault account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                className="input pl-10"
                placeholder="you@email.com"
                {...register('email', { required: 'Email is required' })}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                className="input pl-10"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-brand-600">Forgot password?</Link>
          </div>

          <Button type="submit" loading={loading} className="w-full">Login</Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" /> OR <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => toast('Configure OAuth keys to enable Google login')} className="btn-ghost py-2.5">
            <FcGoogle className="text-lg" /> Google
          </button>
          <button onClick={() => toast('Configure OAuth keys to enable GitHub login')} className="btn-ghost py-2.5">
            <FiGithub className="text-lg" /> GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="font-semibold text-brand-600">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
