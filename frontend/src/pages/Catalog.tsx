import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';
import { productApi } from '@/services/product.api';
import ProductCard from '@/components/product/ProductCard';
import { GridSkeleton } from '@/components/ui/Skeleton';
import { SORT_OPTIONS, DIFFICULTIES } from '@/utils/constants';
import { staggerContainer, staggerItem } from '@/utils/motion';

interface Props {
  type?: 'course' | 'video' | 'snapshot';
  title: string;
  subtitle: string;
}

const Catalog = ({ type, title, subtitle }: Props) => {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const search = params.get('search') || '';
  const sort = params.get('sort') || 'newest';
  const category = params.get('category') || '';
  const difficulty = params.get('difficulty') || '';
  const free = params.get('free') || '';

  useEffect(() => {
    productApi.categories().then(({ data }) => setCategories(data.categories || [])).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productApi.list({
        type,
        search: search || undefined,
        sort,
        category: category || undefined,
        difficulty: difficulty || undefined,
        free: free || undefined,
        page,
        limit: 12,
      });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [type, search, sort, category, difficulty, free, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
    setPage(1);
  };

  const clearFilters = () => {
    setParams({});
    setPage(1);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-slate-500">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-64 lg:shrink-0`}>
          <div className="card sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-brand-600">Clear all</button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <select className="input" value={category} onChange={(e) => updateParam('category', e.target.value)}>
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Difficulty</label>
              <div className="space-y-2">
                {DIFFICULTIES.map((d) => (
                  <label key={d} className="flex items-center gap-2 text-sm capitalize">
                    <input
                      type="radio"
                      name="difficulty"
                      checked={difficulty === d}
                      onChange={() => updateParam('difficulty', d)}
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={free === 'true'} onChange={(e) => updateParam('free', e.target.checked ? 'true' : '')} />
                Free only
              </label>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">{total} results</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters((s) => !s)} className="btn-ghost px-3 py-2 text-sm lg:hidden">
                {showFilters ? <FiX /> : <FiFilter />} Filters
              </button>
              <select className="input w-auto" value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <GridSkeleton count={9} />
          ) : products.length === 0 ? (
            <div className="card py-20 text-center text-slate-500">No products found. Try adjusting filters.</div>
          ) : (
            <motion.div
              key={`${search}-${sort}-${category}-${difficulty}-${free}-${page}`}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
            >
              {products.map((p) => (
                <motion.div key={p._id} variants={staggerItem}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-10 w-10 rounded-lg text-sm font-medium ${
                    page === i + 1 ? 'bg-brand-600 text-white' : 'border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
