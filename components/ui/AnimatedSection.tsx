'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useMotionValueEvent } from 'framer-motion';

/**
 * Hook to detect whether the user is actively scrolling DOWN or UP.
 */
export function useScrollDirection() {
  const { scrollY } = useScroll();
  const [scrollDir, setScrollDir] = useState<'down' | 'up'>('down');

  useMotionValueEvent(scrollY, 'change', (current) => {
    const prev = scrollY.getPrevious() ?? 0;
    const diff = current - prev;
    if (Math.abs(diff) > 3) {
      setScrollDir(diff > 0 ? 'down' : 'up');
    }
  });

  return scrollDir;
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'auto';
  duration?: number;
  once?: boolean;
  bidirectional?: boolean;
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'auto',
  duration = 0.7,
  once = false,
  bidirectional = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px 0px' });
  const scrollDir = useScrollDirection();

  // Bidirectional scroll calculation:
  // When scrolling DOWN -> enters from below to above (y: 35 -> 0)
  // When scrolling UP   -> enters from above to down (y: -35 -> 0)
  const getYHidden = () => {
    if (direction === 'down') return -40;
    if (direction === 'up') return 40;
    if (direction === 'auto' || bidirectional) {
      return scrollDir === 'up' ? -35 : 35;
    }
    return 35;
  };

  const variants = (() => {
    if (direction === 'scale') {
      return { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } };
    }
    if (direction === 'left') {
      return { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
    }
    if (direction === 'right') {
      return { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };
    }
    return {
      hidden: { opacity: 0, y: getYHidden() },
      visible: { opacity: 1, y: 0 },
    };
  })();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Staggered children wrapper with bidirectional scroll capability */
export function StaggerChildren({
  children,
  className = '',
  staggerDelay = 0.1,
  once = false,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-40px 0px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollDir = useScrollDirection();
  const yHidden = scrollDir === 'up' ? -30 : 30;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yHidden },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
