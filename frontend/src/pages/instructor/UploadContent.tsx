import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { instructorApi } from '@/services/admin.api';
import Button from '@/components/ui/Button';

const UploadContent = () => {
  const { register, handleSubmit, reset } = useForm();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    instructorApi.categories().then(({ data }) => setCategories(data.categories || [])).catch(() => {});
  }, []);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await instructorApi.createProduct({
        ...values,
        price: Number(values.price),
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
        isFree: Number(values.price) === 0,
      });
      toast.success('Content published!');
      reset();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Upload Content</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Type</label>
            <select className="input" {...register('type', { required: true })}>
              <option value="course">Course</option>
              <option value="video">Video</option>
              <option value="snapshot">Snapshot</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select className="input" {...register('category', { required: true })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input className="input" {...register('title', { required: true })} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea className="input" rows={4} {...register('description', { required: true })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Price ($)</label>
            <input type="number" step="0.01" className="input" defaultValue={0} {...register('price', { required: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Difficulty</label>
            <select className="input" {...register('difficulty')}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Language</label>
            <input className="input" defaultValue="English" {...register('language')} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Thumbnail URL</label>
            <input className="input" placeholder="https://..." {...register('thumbnail')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Resource / Video URL</label>
            <input className="input" placeholder="https://..." {...register('resourceUrl')} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
          <input className="input" placeholder="python, ml, tensorflow" {...register('tags')} />
        </div>

        <Button type="submit" loading={loading}>Publish Content</Button>
      </form>
    </div>
  );
};

export default UploadContent;
