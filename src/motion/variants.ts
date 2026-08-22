// src/motion/variants.ts
// Centralized motion presets. Reuse these instead of inlining
// initial/animate/transition objects in every component — keeps the
// animation "feel" consistent and makes tuning a one-place change.

export const springTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
} as const

export const springTransitionSoft = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
} as const

export const easeTransition = {
  duration: 0.6,
  ease: 'easeOut',
} as const

// Scroll-reveal for whole sections (fade + slide up)
export const fadeUpSection = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: easeTransition,
}

// Parent wrapper: staggers its direct motion children when it enters view
export function staggerContainer(staggerChildren = 0.08, delayChildren = 0) {
  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-100px' },
    variants: {
      hidden: {},
      visible: {
        transition: { staggerChildren, delayChildren },
      },
    },
  }
}

// Child item used inside a staggerContainer — no its own viewport trigger,
// it inherits "visible" from the parent's variants.
export const staggerItem = {
  variants: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: easeTransition },
  },
}

// Hover/tap micro-interaction for cards, replacing ad-hoc CSS
// `transition-transform hover:scale-*` utility classes.
export const hoverLift = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.98 },
  transition: springTransitionSoft,
}

export const hoverLiftSubtle = {
  whileHover: { scale: 1.02 },
  transition: springTransitionSoft,
}

// Lift (translateY) instead of scale — use this on cards that already have
// their own internal hover effect (e.g. an image zooming via group-hover),
// so the whole card doesn't scale *and* the image inside it at the same time.
export const hoverLiftY = {
  whileHover: { y: -6 },
  transition: springTransitionSoft,
}