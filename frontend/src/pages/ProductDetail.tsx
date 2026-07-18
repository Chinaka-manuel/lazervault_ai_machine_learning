import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FiPlayCircle, FiDownload, FiClock, FiGlobe, FiBarChart2, FiUser, FiHeart, FiShoppingCart, FiMonitor,
} from 'react-icons/fi';
import { productApi } from '@/services/product.api';
import { commerceApi } from '@/services/commerce.api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Badge from '@/components/ui/Badge';
import Rating from '@/components/ui/Rating';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ProductCard from '@/components/product/ProductCard';
import { formatCurrency, formatDate, formatDuration } from '@/utils/format';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const add = useCartStore((s) => s.add);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productApi
      .detail(id)
      .then(({ data }) => {
        setProduct(data.product);
        setRelated(data.related || []);
        return productApi.reviews(data.product._id);
      })
      .then((res) => setReviews(res?.data.reviews || []))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    commerceApi
      .checkAccess(id)
      .then(({ data }) => setOwned(Boolean(data.owned)))
      .catch(() => setOwned(false));
  }, [id, user]);

  const handleAdd = async () => {
    if (!user) return toast.error('Please login to purchase');
    try {
      await add(product._id);
      toast.success('Added to cart');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('Login to review');
    try {
      await productApi.addReview(product._id, { rating, comment });
      toast.success('Review submitted');
      const { data } = await productApi.reviews(product._id);
      setReviews(data.reviews || []);
      setComment('');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (loading) return <Spinner full />;
  if (!product) return <div className="py-20 text-center">Product not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div
            className={`relative flex h-72 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600/20 to-accent-500/20 sm:h-96 ${owned ? 'cursor-pointer transition hover:opacity-90' : ''}`}
            onClick={owned ? () => navigate(`/dashboard/library/${product._id}`) : undefined}
            role={owned ? 'button' : undefined}
            aria-label={owned ? 'Open your product' : undefined}
          >
            {product.thumbnail ? (
              <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <FiPlayCircle className="h-24 w-24 text-brand-500/60" />
            )}
            {owned && (
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <FiMonitor className="mr-1 inline" /> Open
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge color="brand">{product.type}</Badge>
            <Badge color="slate">{product.difficulty}</Badge>
            {product.category && <Badge color="cyan">{product.category.name}</Badge>}
          </div>

          <h1 className="mt-4 text-3xl font-bold">{product.title}</h1>
          <div className="mt-3 flex items-center gap-4">
            <Rating value={product.rating} count={product.ratingCount} />
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <FiUser /> {product.instructor?.name}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat icon={FiClock} label="Duration" value={formatDuration(product.duration)} />
            <Stat icon={FiGlobe} label="Language" value={product.language} />
            <Stat icon={FiBarChart2} label="Level" value={product.difficulty} />
            <Stat icon={FiDownload} label="Downloads" value={String(product.downloads || 0)} />
          </div>

          <div className="prose mt-8 max-w-none dark:prose-invert">
            <h2 className="text-xl font-bold">About this {product.type}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{product.description}</p>
            {product.longDescription && <p className="mt-3 text-slate-600 dark:text-slate-300">{product.longDescription}</p>}
          </div>

          {product.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((t: string) => (
                <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">#{t}</span>
              ))}
            </div>
          )}

          {/* Reviews */}
          <div className="mt-12">
            <h2 className="text-xl font-bold">Reviews ({reviews.length})</h2>
            {user && (
              <form onSubmit={submitReview} className="card mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Your rating:</span>
                  <select className="input w-auto" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
                  </select>
                </div>
                <textarea className="input" rows={3} placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button type="submit">Submit Review</Button>
              </form>
            )}
            <div className="mt-6 space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                        {r.user?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{r.user?.name}</p>
                        {r.verifiedPurchase && <Badge color="green">Verified Purchase</Badge>}
                      </div>
                    </div>
                    <Rating value={r.rating} />
                  </div>
                  {r.comment && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>}
                  {r.instructorReply && (
                    <p className="mt-3 rounded-xl bg-brand-50 p-3 text-sm dark:bg-brand-900/20">
                      <strong>Instructor:</strong> {r.instructorReply}
                    </p>
                  )}
                </div>
              ))}
              {reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet. Be the first!</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card sticky top-24">
            <p className="text-3xl font-bold gradient-text">
              {product.isFree ? 'Free' : formatCurrency(product.price)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Published {formatDate(product.publishedAt || product.createdAt)}</p>

            <div className="mt-5 space-y-3">
              {owned ? (
                <Button onClick={() => navigate(`/dashboard/library/${product._id}`)} className="w-full">
                  <FiMonitor /> {product.type === 'video' ? 'Watch now' : 'Open / Download'}
                </Button>
              ) : (
                <>
                  <Button onClick={handleAdd} className="w-full">
                    <FiShoppingCart /> Add to Cart
                  </Button>
                  <Link to="/cart" className="btn-ghost w-full">Go to Cart</Link>
                </>
              )}
            </div>

            <ul className="mt-6 space-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-2"><FiPlayCircle className="text-brand-500" /> Lifetime access</li>
              <li className="flex items-center gap-2"><FiDownload className="text-brand-500" /> Downloadable resources</li>
              <li className="flex items-center gap-2"><FiHeart className="text-brand-500" /> 30-day satisfaction</li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Related products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="card flex items-center gap-3 p-4">
    <Icon className="text-xl text-brand-500" />
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold capitalize">{value}</p>
    </div>
  </div>
);

export default ProductDetail;
