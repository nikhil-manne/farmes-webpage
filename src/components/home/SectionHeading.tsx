import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  badge, 
  title, 
  description, 
  align = 'left',
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-3 ${align === 'center' ? 'items-center text-center' : ''} ${className}`}>
      {badge && (
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 rounded-full w-fit">
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
