import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';
import { adminApi } from '@/services/admin.api';
import { formatDate } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  isActive: true,
  isApprovedInstructor: false,
};

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const load = () => {
    adminApi.users().then(({ data }) => setUsers(data.users || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (u: any) => {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      isActive: u.isActive,
      isApprovedInstructor: u.isApprovedInstructor || false,
    });
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        const payload: any = {
          name: form.name,
          email: form.email,
          role: form.role,
          isActive: form.isActive,
          isApprovedInstructor: form.role === 'instructor' ? form.isApprovedInstructor : false,
        };
        if (form.password) payload.password = form.password;
        await adminApi.updateUser(editing._id, payload);
        toast.success('User updated');
      } else {
        if (!form.password) {
          toast.error('Password is required for new users');
          setSaving(false);
          return;
        }
        await adminApi.createUser(form);
        toast.success('User created');
      }
      setModalOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    try {
      await adminApi.deleteUser(deleteTarget._id);
      toast.success('User deleted');
      setDeleteTarget(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={openCreate}><FiUserPlus /> Add User</Button>
      </div>

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
                    <button onClick={() => openEdit(u)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Edit"><FiEdit2 /></button>
                    <button onClick={() => setDeleteTarget(u)} className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="py-12 text-center text-slate-500">No users found.</p>}
      </div>

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Add User'}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!!editing} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Password {editing && <span className="text-xs font-normal text-slate-400">(leave blank to keep)</span>}
            </label>
            <input type="password" className="input" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Role</label>
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
          {form.role === 'instructor' && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isApprovedInstructor} onChange={(e) => setForm({ ...form, isApprovedInstructor: e.target.checked })} />
              Approved instructor
            </label>
          )}
          <Button onClick={save} loading={saving} className="w-full">{editing ? 'Save Changes' : 'Create User'}</Button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" maxWidth="max-w-sm">
        <p className="text-sm text-slate-500">
          Are you sure you want to delete <span className="font-semibold">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={doDelete} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
