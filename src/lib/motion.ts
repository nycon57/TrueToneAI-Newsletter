/**
 * TrueTone AI Motion System
 *
 * Centralized motion configurations for consistent, tasteful animations
 * Based on Motion library best practices and refined spring physics
 */

import type { Transition, Variants, TargetAndTransition } from 'motion/react';

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================

/**
 * Spring presets for different use cases
 * Tuned for a refined, professional feel
 */
export const springs = {
  // Snappy interactions - buttons, toggles
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },
  // Smooth content transitions
  smooth: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  // Gentle entrance animations
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
  // Bouncy for playful elements
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 15,
    mass: 0.8,
  },
  // Modal/dialog transitions
  modal: {
    type: 'spring' as const,
    stiffness: 350,
    damping: 28,
  },
  // Card hover/scale
  card: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
  },
} as const;

// =============================================================================
// EASING CURVES
// =============================================================================

export const easings = {
  // Smooth entrance with slight overshoot
  entrance: [0.22, 1.0, 0.36, 1.0],
  // Quick exit with ease-in
  exit: [0.65, 0, 0.35, 1],
  // Emphasized ease for important elements
  emphasized: [0.17, 0.67, 0.51, 1],
  // Subtle ease for background elements
  subtle: [0.4, 0, 0.2, 1],
} as const;

// =============================================================================
// TRANSITION PRESETS
// =============================================================================

export const transitions = {
  // Fast micro-interactions (hover, tap)
  micro: {
    duration: 0.15,
    ease: easings.subtle,
  } as Transition,

  // Standard component transitions
  standard: {
    duration: 0.3,
    ease: easings.entrance,
  } as Transition,

  // Page/section transitions
  page: {
    duration: 0.4,
    ease: easings.emphasized,
  } as Transition,

  // Slow, dramatic transitions
  dramatic: {
    duration: 0.6,
    ease: easings.entrance,
  } as Transition,
} as const;

// =============================================================================
// STAGGER CONFIGURATIONS
// =============================================================================

export const stagger = {
  // Fast stagger for lists
  fast: 0.03,
  // Standard stagger
  standard: 0.05,
  // Slow stagger for hero content
  slow: 0.08,
  // Dramatic stagger for feature lists
  dramatic: 0.12,
} as const;

/**
 * Create stagger transition for container
 */
export const staggerContainer = (
  staggerChildren = stagger.standard,
  delayChildren = 0
): Transition => ({
  staggerChildren,
  delayChildren,
});

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

/**
 * Fade in from below - Hero content, sections
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

/**
 * Fade in from above
 */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

/**
 * Fade in from left
 */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.smooth,
  },
};

/**
 * Fade in from right
 */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.smooth,
  },
};

/**
 * Scale in with fade
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.smooth,
  },
};

/**
 * Staggered container for lists
 */
export const staggeredContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.standard,
      delayChildren: 0.1,
    },
  },
};

/**
 * Staggered list item
 */
export const staggeredItem: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

/**
 * Card variants with hover states
 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
  hover: {
    y: -4,
    transition: springs.card,
  },
};

// =============================================================================
// MICRO-INTERACTION PROPS
// =============================================================================

/**
 * Button hover/tap states
 */
export const buttonInteraction = {
  whileHover: { scale: 1.02 } as TargetAndTransition,
  whileTap: { scale: 0.98 } as TargetAndTransition,
  transition: springs.snappy,
};

/**
 * Subtle button interaction for secondary buttons
 */
export const subtleButtonInteraction = {
  whileHover: { scale: 1.01 } as TargetAndTransition,
  whileTap: { scale: 0.99 } as TargetAndTransition,
  transition: springs.snappy,
};

/**
 * Card hover effect
 */
export const cardInteraction = {
  whileHover: {
    y: -4,
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
  } as TargetAndTransition,
  transition: springs.card,
};

/**
 * Icon hover rotation
 */
export const iconRotation = {
  whileHover: { rotate: 15 } as TargetAndTransition,
  transition: springs.bouncy,
};

/**
 * Expandable content animation
 */
export const expandableContent: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.15 },
    },
  },
  expanded: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.25, delay: 0.1 },
    },
  },
};

// =============================================================================
// MODAL ANIMATIONS
// =============================================================================

export const modalOverlay: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(8px)',
    transition: { duration: 0.25, ease: easings.entrance },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.2, ease: easings.exit },
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.modal,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 20,
    transition: { duration: 0.2, ease: easings.exit },
  },
};

// =============================================================================
// PAGE TRANSITIONS
// =============================================================================

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.entrance,
      staggerChildren: stagger.standard,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease: easings.exit,
    },
  },
};

/**
 * Tab content transitions
 */
export const tabContent = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: springs.smooth,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -20 : 20,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
};

// =============================================================================
// LOADING STATES
// =============================================================================

export const skeleton: Variants = {
  initial: {
    opacity: 0.5,
  },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const spinnerRotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate stagger delay based on index
 */
export function getStaggerDelay(index: number, baseDelay = stagger.standard): number {
  return index * baseDelay;
}

/**
 * Create staggered animation props for a list item
 */
export function createStaggeredItemProps(index: number, maxDelay = 0.5) {
  const delay = Math.min(index * stagger.standard, maxDelay);
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      ...springs.gentle,
      delay,
    },
  };
}

/**
 * Create viewport-triggered animation props
 */
export function createViewportAnimationProps(once = true) {
  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once, margin: '-50px' },
  };
}
