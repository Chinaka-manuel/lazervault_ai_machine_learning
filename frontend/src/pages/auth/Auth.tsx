import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiMail, FiUser, FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { authApi } from '@/services/auth.api';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import PasswordField from '@/components/ui/PasswordField';
import { scaleIn } from '@/utils/motion';

type Mode = 'login' | 'register';

interface LoginValues {
  email: string;
  password: string;
}

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'instructor';
}

const Auth = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    const m = searchParams.get('mode');
    if (m === 'register') setMode('register');
  }, [searchParams]);

  const loginForm = useForm<LoginValues>();
  const registerForm = useForm<RegisterValues>({ defaultValues: { role: 'student' } });
  const [loading, setLoading] = useState(false);

  const onLogin = async (values: LoginValues) => {
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

  const onRegister = async (values: RegisterValues) => {
    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.register(values);
      setAuth(data.user, data.accessToken);
      toast.success('Account created! Check your email to verify.');
      navigate(values.role === 'instructor' ? '/instructor' : '/dashboard', { replace: true });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    navigate(next === 'register' ? '/login?mode=register' : '/login', { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <motion.div className="card" variants={scaleIn} initial="hidden" animate="visible">
        {mode === 'login' ? (
          <>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Login to access your LazerVault account.</p>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    className="input pl-10"
                    placeholder="you@email.com"
                    {...loginForm.register('email', { required: 'Email is required' })}
                  />
                </div>
                {loginForm.formState.errors.email && <p className="mt-1 text-xs text-red-500">{loginForm.formState.errors.email.message}</p>}
              </div>

              <PasswordField
                register={loginForm.register}
                error={loginForm.formState.errors.password?.message}
                validation={{ required: 'Password is required' }}
              />

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
              Don't have an account?{' '}
              <button onClick={() => switchMode('register')} className="font-semibold text-brand-600">Sign up</button>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Join LazerVault and start mastering AI.</p>
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input className="input pl-10" placeholder="Jane Doe" {...registerForm.register('name', { required: 'Name is required' })} />
                </div>
                {registerForm.formState.errors.name && <p className="mt-1 text-xs text-red-500">{registerForm.formState.errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" className="input pl-10" placeholder="you@email.com" {...registerForm.register('email', { required: 'Email is required' })} />
                </div>
                {registerForm.formState.errors.email && <p className="mt-1 text-xs text-red-500">{registerForm.formState.errors.email.message}</p>}
              </div>

              <PasswordField
                register={registerForm.register}
                label="Password"
                placeholder="At least 8 characters"
                error={registerForm.formState.errors.password?.message}
                validation={{ required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } }}
              />

              <PasswordField
                register={registerForm.register}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter password"
                autoComplete="new-password"
                error={registerForm.formState.errors.confirmPassword?.message}
                validation={{
                  required: 'Please confirm your password',
                  validate: (value: string) => value === registerForm.watch('password') || 'Passwords do not match',
                }}
              />

              <div>
                <label className="mb-1 block text-sm font-medium">I want to</label>
                <select className="input" {...registerForm.register('role')}>
                  <option value="student">Learn (Student)</option>
                  <option value="instructor">Teach (Instructor)</option>
                </select>
              </div>

              <Button type="submit" loading={loading} className="w-full">Create Account</Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button onClick={() => switchMode('login')} className="font-semibold text-brand-600">Login</button>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
