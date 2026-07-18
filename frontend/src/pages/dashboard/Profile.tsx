import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '@/services/auth.api';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import PasswordField from '@/components/ui/PasswordField';

interface ProfileForm {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { register, handleSubmit, reset, watch } = useForm<ProfileForm>({
    defaultValues: { name: user?.name, email: user?.email, bio: user?.bio, avatar: user?.avatar },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    if (values.newPassword && values.newPassword !== values.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        bio: values.bio,
        avatar: values.avatar,
        currentPassword: values.currentPassword || undefined,
        newPassword: values.newPassword || undefined,
      };
      const { data } = await authApi.updateProfile(payload);
      updateUser(data.user);
      toast.success('Profile updated');
      reset({ ...values, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const newPassword = watch('newPassword');

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
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input className="input" type="email" {...register('email')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Avatar URL</label>
            <input className="input" placeholder="https://..." {...register('avatar')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea className="input" rows={4} {...register('bio')} />
          </div>

          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            <h2 className="mb-3 text-sm font-bold">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Current Password</label>
                <PasswordField register={register} name="currentPassword" label="" icon={false} autoComplete="current-password" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">New Password</label>
                <PasswordField register={register} name="newPassword" label="" icon={false} autoComplete="new-password" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
                <PasswordField register={register} name="confirmPassword" label="" icon={false} autoComplete="new-password" />
              </div>
              {newPassword && watch('confirmPassword') && newPassword !== watch('confirmPassword') && (
                <p className="text-xs text-red-500">New passwords do not match</p>
              )}
            </div>
          </div>

          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
