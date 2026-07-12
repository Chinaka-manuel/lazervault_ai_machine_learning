import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { adminApi } from '@/services/admin.api';
import { formatDate } from '@/utils/format';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const { register, handleSubmit, reset } = useForm();

  const load = () => adminApi.coupons().then(({ data }) => setCoupons(data.coupons || []));
  useEffect(() => { load(); }, []);

  const onSubmit = async (values: any) => {
    try {
      await adminApi.createCoupon({
        ...values,
        discountValue: Number(values.discountValue),
        minOrderAmount: Number(values.minOrderAmount || 0),
        maxUses: values.maxUses ? Number(values.maxUses) : null,
      });
      toast.success('Coupon created');
      reset();
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Coupons & Discounts</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <input className="input uppercase" placeholder="CODE" {...register('code', { required: true })} />
        <select className="input" {...register('discountType')}>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed amount</option>
        </select>
        <input type="number" className="input" placeholder="Discount value" {...register('discountValue', { required: true })} />
        <input type="number" className="input" placeholder="Min order amount" {...register('minOrderAmount')} />
        <input type="number" className="input" placeholder="Max uses (optional)" {...register('maxUses')} />
        <Button type="submit">Create Coupon</Button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-3">Code</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Value</th>
              <th className="pb-3">Used</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {coupons.map((c) => (
              <tr key={c._id}>
                <td className="py-3 font-mono font-semibold">{c.code}</td>
                <td className="py-3 capitalize">{c.discountType}</td>
                <td className="py-3">{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                <td className="py-3">{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''}</td>
                <td className="py-3">{c.isActive ? <Badge color="green">Active</Badge> : <Badge color="slate">Inactive</Badge>}</td>
                <td className="py-3 text-slate-500">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="py-12 text-center text-slate-500">No coupons yet.</p>}
      </div>
    </div>
  );
};

export default AdminCoupons;
