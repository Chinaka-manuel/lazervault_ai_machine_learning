import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '@/services/auth.api';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, bio: user?.bio, avatar: user?.avatar },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await authApi.updateProfile(values);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      <div className="card max-w-xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-2xl font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="text-xs capitalize text-brand-600">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input className="input" {...register('name')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Avatar URL</label>
            <input className="input" placeholder="https://..." {...register('avatar')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea className="input" rows={4} {...register('bio')} />
          </div>
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
