import { FiStar } from 'react-icons/fi';
import clsx from 'clsx';

interface RatingProps {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}

const Rating = ({ value, count, size = 14, className }: RatingProps) => (
  <div className={clsx('flex items-center gap-1', className)}>
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          size={size}
          className={i < Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
        />
      ))}
    </div>
    <span className="text-xs text-slate-500">
      {value ? value.toFixed(1) : 'New'}
      {count !== undefined ? ` (${count})` : ''}
    </span>
  </div>
);

export default Rating;
