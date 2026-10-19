import { useEffect, useRef, useState } from 'react';


// =====================================================
// USE IN VIEW
// =====================================================

export function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const threshold = options.threshold ?? 0.15;

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Once visible, no need to keep observing.
          observer.unobserve(el);
        }
      },
      {
        ...options,
        threshold,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return [ref, isVisible];
}


// =====================================================
// USE COUNT UP
// =====================================================

export function useCountUp(
  target,
  duration = 1800,
  isActive = false
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCount(0);
      return;
    }

    // Always convert target to a string first.
    const targetString = String(target ?? '');

    // Extract numeric portion.
    const numericMatch = targetString.match(/\d+/);

    const numeric = numericMatch
      ? parseInt(numericMatch[0], 10)
      : 0;

    // Extract suffix such as + or %.
    const suffix = targetString.replace(/\d/g, '');

    // Values such as "∞" have no number to animate.
    if (!numericMatch) {
      setCount(targetString);
      return;
    }

    let animationFrame;
    let start = null;

    const step = (timestamp) => {
      if (!start) {
        start = timestamp;
      }

      const progress = Math.min(
        (timestamp - start) / duration,
        1
      );

      // Ease-out cubic.
      const eased =
        1 - Math.pow(1 - progress, 3);

      const currentValue =
        Math.floor(eased * numeric);

      setCount(
        `${currentValue}${suffix}`
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(step);
      } else {
        // Ensure the final value is exact.
        setCount(targetString);
      }
    };

    animationFrame =
      requestAnimationFrame(step);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, target, duration]);

  return isActive ? count : '0';
}