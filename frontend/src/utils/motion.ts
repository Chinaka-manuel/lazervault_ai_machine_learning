import type { Variants, Transition } from 'framer-motion';

export const easeOut: Transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: easeOut },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: easeOut },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: easeOut },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: easeOut },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: easeOut },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: easeOut },
};

/** Parent container that staggers its children's entrance. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Item used inside a staggerContainer. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: easeOut },
};

/** Standard page transition. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

export const hoverLift = {
  whileHover: { y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } },
} as const;

export const tapScale = {
  whileTap: { scale: 0.96 },
} as const;
