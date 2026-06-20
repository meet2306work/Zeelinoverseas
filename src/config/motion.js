export const motionDurations = Object.freeze({
  instant: 0,
  fast: 0.16,
  base: 0.24,
  expressive: 0.4,
  slow: 0.55,
});

export const motionEasings = Object.freeze({
  standard: [0.4, 0, 0.2, 1],
  enter: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
});

export const motionSprings = Object.freeze({
  responsive: { type: 'spring', stiffness: 420, damping: 32, mass: 0.8 },
  gentle: { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 },
});

export const motionTransitions = Object.freeze({
  admin: { duration: motionDurations.fast, ease: motionEasings.enter },
  interface: { duration: motionDurations.base, ease: motionEasings.enter },
  storefront: { duration: motionDurations.expressive, ease: motionEasings.enter },
  exit: { duration: motionDurations.fast, ease: motionEasings.exit },
});

export function createFadeVariants(reducedMotion = false) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: reducedMotion ? { duration: 0 } : motionTransitions.interface,
    },
    exit: {
      opacity: 0,
      transition: reducedMotion ? { duration: 0 } : motionTransitions.exit,
    },
  };
}

export function createFadeUpVariants(reducedMotion = false, distance = 16) {
  return {
    hidden: { opacity: 0, y: reducedMotion ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: reducedMotion ? { duration: 0 } : motionTransitions.storefront,
    },
    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : -Math.min(distance, 10),
      transition: reducedMotion ? { duration: 0 } : motionTransitions.exit,
    },
  };
}

export function createScaleVariants(reducedMotion = false) {
  return {
    hidden: { opacity: 0, scale: reducedMotion ? 1 : 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: reducedMotion ? { duration: 0 } : motionTransitions.interface,
    },
    exit: {
      opacity: 0,
      scale: reducedMotion ? 1 : 0.98,
      transition: reducedMotion ? { duration: 0 } : motionTransitions.exit,
    },
  };
}

export function createStaggerContainer(reducedMotion = false, stagger = 0.07) {
  return {
    hidden: {},
    visible: {
      transition: reducedMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: stagger, delayChildren: 0.04 },
    },
  };
}
