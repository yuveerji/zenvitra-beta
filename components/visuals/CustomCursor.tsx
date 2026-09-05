'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Exact raw coordinates (0 latency)
  const cursorX = useMotionValue<number>(-200);
  const cursorY = useMotionValue<number>(-200);

  // Kinetic spring dynamics for smooth lock-on expansion
  const springConfig = { damping: 25, stiffness: 350, mass: 0.3 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable completely on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = () => {
      const interactives = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], .spotlight-card, .cursor-pointer'
      );
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    handleElementHover();

    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
      {isHovered ? (
        /* HOVER LOCK-ON STATE (Expanded HUD Reticle from cursor-hover.png) */
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{
            scale: isClicked ? 0.85 : 1.1,
            opacity: 1,
          }}
          exit={{ scale: 0.75, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 350 }}
          className="fixed w-16 h-16 pointer-events-none select-none flex items-center justify-center"
        >
          <img
            src="/images/cursor-hover.png"
            alt="Targeting Reticle"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.45)] pointer-events-none"
            draggable={false}
          />
        </motion.div>
      ) : (
        /* DEFAULT STATE (Custom Z Stealth Arrow from cursor-default.png) */
        <motion.div
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-12%', // Calibrated to keep the sharp arrow vertex on the click point
          }}
          animate={{
            scale: isClicked ? 0.82 : 1,
          }}
          transition={{ type: 'spring', damping: 15, stiffness: 450 }}
          className="fixed w-8 h-11 pointer-events-none select-none"
        >
          <img
            src="/images/cursor-default.png"
            alt="Zenvitra Pointer"
            className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] pointer-events-none"
            draggable={false}
          />
        </motion.div>
      )}
    </div>
  );
}

export default CustomCursor;