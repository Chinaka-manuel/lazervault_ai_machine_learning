import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '@/services/admin.api';
import { formatDate } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminApi.users().then(({ data }) => setUsers(data.users || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateUser = async (id: string, payload: any) => {
    try {
      await adminApi.updateUser(id, payload);
      toast.success('User updated');
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Joined</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="py-3 font-medium">{u.name}</td>
                <td className="py-3 text-slate-500">{u.email}</td>
                <td className="py-3"><Badge color={u.role === 'admin' ? 'brand' : u.role === 'instructor' ? 'cyan' : 'slate'}>{u.role}</Badge></td>
                <td className="py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                <td className="py-3">{u.isActive ? <Badge color="green">Active</Badge> : <Badge color="amber">Disabled</Badge>}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    {u.role === 'instructor' && !u.isApprovedInstructor && (
                      <button onClick={() => updateUser(u._id, { role: 'instructor', isActive: true, isApprovedInstructor: true })} className="btn-primary px-2 py-1 text-xs">Approve</button>
                    )}
                    <button onClick={() => updateUser(u._id, { role: u.role, isActive: !u.isActive })} className="btn-ghost px-2 py-1 text-xs">
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
