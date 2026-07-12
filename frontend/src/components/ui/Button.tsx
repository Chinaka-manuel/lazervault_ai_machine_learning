import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, className, children, disabled, ...props }, ref) => {
    const base =
      variant === 'ghost'
        ? 'btn-ghost'
        : variant === 'danger'
          ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700'
          : 'btn-primary';
    return (
      <motion.button
        ref={ref}
        className={clsx(base, className)}
        disabled={disabled || loading}
        whileHover={disabled || loading ? undefined : { scale: 1.03 }}
        whileTap={disabled || loading ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
