import React from 'react';
import { LucideIcon, CheckCircle2 } from 'lucide-react';

interface BenefitCardProps {
  title: string;
  items: string[];
  image: string;
  type: 'farmer' | 'user';
}

export const BenefitCard: React.FC<BenefitCardProps> = ({ title, items, image, type }) => {
  const isFarmer = type === 'farmer';
  
  return (
    <div className={`overflow-hidden rounded-3xl border border-border bg-card shadow-card group transition-all duration-500 hover:shadow-elevated ${isFarmer ? 'hover:border-secondary/30' : 'hover:border-primary/30'}`}>
      <div className="grid md:grid-cols-2">
        <div className={`p-8 md:p-12 flex flex-col justify-center ${isFarmer ? 'order-1 md:order-2' : 'order-1'}`}>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold mb-6">
            {title}
          </h3>
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 ${isFarmer ? 'text-secondary' : 'text-primary'}`} />
                <span className="text-muted-foreground leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`aspect-video md:aspect-auto overflow-hidden ${isFarmer ? 'order-2 md:order-1' : 'order-2'}`}>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        </div>
      </div>
    </div>
  );
};
