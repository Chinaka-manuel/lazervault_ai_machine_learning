import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'brand' | 'green' | 'amber' | 'slate' | 'cyan';
  className?: string;
}

const colors: Record<string, string> = {
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
};

const Badge = ({ children, color = 'brand', className }: BadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
      colors[color],
      className,
    )}
  >
    {children}
  </span>
);

export default Badge;
