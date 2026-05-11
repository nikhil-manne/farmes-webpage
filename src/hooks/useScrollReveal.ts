import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook that observes an element and returns whether it's visible in the viewport.
 * Pairs with the CSS animation classes in index.css (scroll-reveal system).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(el);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

/**
 * Hook that observes multiple children of a container and staggers their reveal.
 * Apply `data-reveal` to each child element; they get `.revealed` class when in view.
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions & { staggerDelay?: number } = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px', triggerOnce = true, staggerDelay = 120 } = options;
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll('[data-reveal]');
    if (children.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, index) => {
            setTimeout(() => {
              (child as HTMLElement).classList.add('revealed');
            }, index * staggerDelay);
          });
          if (triggerOnce) observer.unobserve(container);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, staggerDelay]);

  return containerRef;
}
