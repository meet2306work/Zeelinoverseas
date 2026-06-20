import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { motionDurations, motionEasings } from '../../config/motion';

export default function AnimatedNumber({ value, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const shouldReduceMotion = useReducedMotion();
  const numericValue = Number(value) || 0;
  const count = useMotionValue(shouldReduceMotion ? numericValue : 0);
  const display = useTransform(count, (latest) => `${prefix}${Math.round(latest).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (!isInView) return undefined;
    if (shouldReduceMotion) {
      count.set(numericValue);
      return undefined;
    }

    const controls = animate(count, numericValue, {
      duration: motionDurations.slow + 0.45,
      ease: motionEasings.enter,
    });
    return controls.stop;
  }, [count, isInView, numericValue, shouldReduceMotion]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
