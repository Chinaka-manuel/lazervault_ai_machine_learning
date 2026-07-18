import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { adminApi } from '@/services/admin.api';
import { productApi } from '@/services/product.api';
import { formatCurrency, formatDate } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

const emptyForm = {
  type: 'course',
  title: '',
  description: '',
  price: 0,
  category: '',
  instructor: '',
  difficulty: 'beginner',
  language: 'English',
  tags: '',
  thumbnail: '',
  resourceUrl: '',
  isFree: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const load = () => {
    adminApi.products().then(({ data }) => setProducts(data.products || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    productApi.categories().then(({ data }) => setCategories(data.categories || [])).catch(() => {});
    adminApi.users({ role: 'instructor' }).then(({ data }) => setInstructors(data.users || [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      type: p.type,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category?._id || p.category || '',
      instructor: p.instructor?._id || p.instructor || '',
      difficulty: p.difficulty,
      language: p.language || 'English',
      tags: (p.tags || []).join(', '),
      thumbnail: p.thumbnail || '',
      resourceUrl: p.resourceUrl || '',
      isFree: p.isFree || false,
    });
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        instructor: form.instructor,
        difficulty: form.difficulty,
        language: form.language,
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()) : [],
        thumbnail: form.thumbnail,
        resourceUrl: form.resourceUrl,
        isFree: Number(form.price) === 0,
      };
      if (editing) {
        await productApi.update(editing._id, payload);
        toast.success('Product updated');
      } else {
        await productApi.create(payload);
        toast.success('Product created');
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
      await productApi.remove(deleteTarget._id);
      toast.success('Product deleted');
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
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={openCreate}><FiPlus /> Add Product</Button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-3">Title</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Instructor</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Views</th>
              <th className="pb-3">Published</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="py-3 font-medium">{p.title}</td>
                <td className="py-3"><Badge>{p.type}</Badge></td>
                <td className="py-3 text-slate-500">{p.instructor?.name || '—'}</td>
                <td className="py-3">{formatCurrency(p.price)}</td>
                <td className="py-3">{p.views}</td>
                <td className="py-3 text-slate-500">{formatDate(p.createdAt)}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Edit"><FiEdit2 /></button>
                    <button onClick={() => setDeleteTarget(p)} className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="py-12 text-center text-slate-500">No products yet.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} maxWidth="max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="course">Course</option>
              <option value="video">Video</option>
              <option value="snapshot">Snapshot</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Instructor</label>
            <select className="input" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })}>
              <option value="">Select instructor</option>
              {instructors.map((i) => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Price ($)</label>
            <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Difficulty</label>
            <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Thumbnail URL</label>
            <input className="input" placeholder="https://..." value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Resource URL</label>
            <input className="input" placeholder="https://..." value={form.resourceUrl} onChange={(e) => setForm({ ...form, resourceUrl: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
            <input className="input" placeholder="python, ml, tensorflow" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
        </div>
        <Button onClick={save} loading={saving} className="mt-5 w-full">{editing ? 'Save Changes' : 'Create Product'}</Button>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product" maxWidth="max-w-sm">
        <p className="text-sm text-slate-500">
          Are you sure you want to delete <span className="font-semibold">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={doDelete} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProducts;
