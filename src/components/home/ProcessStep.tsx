import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProcessStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stepNumber: number;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({ icon: Icon, title, description, stepNumber }) => {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div className="mb-6 relative">
        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3 shadow-soft group-hover:shadow-elevated">
          <Icon className="w-8 h-8" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-secondary text-primary font-bold text-sm rounded-full flex items-center justify-center border-2 border-background shadow-sm">
          {stepNumber}
        </div>
      </div>
      <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
        {description}
      </p>
    </div>
  );
};
