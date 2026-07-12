import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { authApi } from '@/services/auth.api';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import { scaleIn } from '@/utils/motion';

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
}

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { role: 'student' },
  });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { data } = await authApi.register(values);
      setAuth(data.user, data.accessToken);
      toast.success('Account created! Check your email to verify.');
      navigate(values.role === 'instructor' ? '/instructor' : '/dashboard');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <motion.div className="card" variants={scaleIn} initial="hidden" animate="visible">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Join LazerVault and start mastering AI.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-10" placeholder="Jane Doe" {...register('name', { required: 'Name is required' })} />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" className="input pl-10" placeholder="you@email.com" {...register('email', { required: 'Email is required' })} />
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
                placeholder="At least 8 characters"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">I want to</label>
            <select className="input" {...register('role')}>
              <option value="student">Learn (Student)</option>
              <option value="instructor">Teach (Instructor)</option>
            </select>
          </div>

          <Button type="submit" loading={loading} className="w-full">Create Account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-brand-600">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
