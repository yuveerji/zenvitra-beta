'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, useSpring, useMotionValue, motion } from 'framer-motion';

interface AnimatedCounterProps {
  target: number | string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });
  const [displayValue, setDisplayValue] = useState('0');

  // Parse numeric target
  const numericTarget = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.]/g, '')) : target;
  const isNumeric = !isNaN(numericTarget);
  const hasPercent = typeof target === 'string' && target.includes('%');

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (isInView && isNumeric) {
      motionValue.set(numericTarget);
    }
  }, [isInView, isNumeric, numericTarget, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (!isNumeric) return;
      const rounded = numericTarget % 1 === 0 ? Math.round(latest) : parseFloat(latest.toFixed(1));
      setDisplayValue(String(rounded));
    });
    return unsubscribe;
  }, [springValue, isNumeric, numericTarget]);

  if (!isNumeric) {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {prefix}{String(target)}{suffix}
      </motion.span>
    );
  }

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {prefix}{displayValue}{hasPercent ? '%' : ''}{suffix}
    </motion.span>
  );
}
