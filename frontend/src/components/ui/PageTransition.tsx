import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { pageTransition } from '@/utils/motion';

/** Wraps a page/route content to give it a smooth entrance transition. */
const PageTransition = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div className={className} variants={pageTransition} initial="hidden" animate="visible">
    {children}
  </motion.div>
);

export default PageTransition;
