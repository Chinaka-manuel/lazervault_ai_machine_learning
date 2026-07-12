import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeInUp } from '@/utils/motion';

interface RevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
  as?: 'div' | 'section' | 'li' | 'span';
}

/**
 * Scroll-triggered reveal wrapper. Animates children into view once they
 * enter the viewport using Framer Motion's whileInView.
 */
const Reveal = ({
  children,
  variants = fadeInUp,
  className,
  delay = 0,
  once = true,
  amount = 0.2,
  as = 'div',
}: RevealProps) => {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
