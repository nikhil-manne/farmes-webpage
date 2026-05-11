import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type RevealAnimation = 
  | 'fade-up' 
  | 'fade-down' 
  | 'slide-left' 
  | 'slide-right' 
  | 'scale' 
  | 'blur' 
  | 'rotate' 
  | 'rotate-left';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  threshold?: number;
}

/**
 * Wrapper component that reveals its children with an animation when scrolled into view.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  threshold = 0.15,
}) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold });

  const animClass = `reveal-${animation}`;
  const delayClass = delay ? `reveal-delay-${delay}` : '';

  return (
    // @ts-ignore — dynamic tag
    <Tag
      ref={ref}
      className={`${animClass} ${delayClass} ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};
