import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlayCircle, FiFileText, FiImage, FiDownload, FiHeart } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Badge from '@/components/ui/Badge';
import Rating from '@/components/ui/Rating';
import { formatCurrency } from '@/utils/format';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { commerceApi } from '@/services/commerce.api';

interface Product {
  _id: string;
  slug?: string;
  type: 'course' | 'video' | 'snapshot';
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  isFree?: boolean;
  rating: number;
  ratingCount: number;
  difficulty: string;
  downloads?: number;
  instructor?: { name: string };
  category?: { name: string };
}

const typeIcon = {
  course: FiPlayCircle,
  video: FiPlayCircle,
  snapshot: FiImage,
};

const ProductCard = ({ product }: { product: Product }) => {
  const Icon = typeIcon[product.type] || FiFileText;
  const add = useCartStore((s) => s.add);
  const user = useAuthStore((s) => s.user);

  const handleAdd = async () => {
    if (!user) return toast.error('Please login to add to cart');
    try {
      await add(product._id);
      toast.success('Added to cart');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleWishlist = async () => {
    if (!user) return toast.error('Please login first');
    try {
      const { data } = await commerceApi.toggleWishlist(product._id);
      toast.success(data.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card group flex flex-col overflow-hidden p-0"
    >
      <Link to={`/product/${product.slug || product._id}`} className="relative block">
        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-600/20 via-slate-900/10 to-accent-500/20">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <Icon className="h-16 w-16 text-brand-500/60" />
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge color="brand">{product.type}</Badge>
            {product.isFree && <Badge color="green">Free</Badge>}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlist();
            }}
            className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-slate-700 opacity-0 transition group-hover:opacity-100 dark:bg-slate-900/80 dark:text-slate-200"
            aria-label="Add to wishlist"
          >
            <FiHeart />
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Badge color="slate">{product.difficulty}</Badge>
          {product.category && <span>{product.category.name}</span>}
        </div>
        <Link to={`/product/${product.slug || product._id}`}>
          <h3 className="line-clamp-2 font-semibold leading-snug transition group-hover:text-brand-600">
            {product.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Rating value={product.rating} count={product.ratingCount} />
          {product.downloads !== undefined && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <FiDownload /> {product.downloads}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="text-lg font-bold gradient-text">
            {product.isFree ? 'Free' : formatCurrency(product.price)}
          </span>
          <button onClick={handleAdd} className="btn-primary px-4 py-2 text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
