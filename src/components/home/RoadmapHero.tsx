import React from 'react';
import { 
  Truck, Leaf, Home, Store, MapPin, 
  Wifi, ShieldCheck, Zap, Package, 
  Smartphone, BarChart3, Cloud
} from 'lucide-react';

export const RoadmapHero = () => {
  return (
    <div className="relative w-full aspect-[4/3] md:aspect-video lg:aspect-[16/9] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2.5rem] overflow-hidden border border-border shadow-2xl group">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      
      {/* The Roadmap SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Animated Road Path */}
        <path 
          id="roadmap-path"
          d="M 100 450 Q 250 450 350 300 T 600 200 T 900 150" 
          className="stroke-border/40 stroke-[12] fill-none"
          strokeLinecap="round"
        />
        <path 
          d="M 100 450 Q 250 450 350 300 T 600 200 T 900 150" 
          className="stroke-primary/20 stroke-[4] fill-none stroke-dasharray-5"
          strokeLinecap="round"
        />
        
        {/* Connection Pulses */}
        <path 
          d="M 100 450 Q 250 450 350 300 T 600 200 T 900 150" 
          className="stroke-primary stroke-[2] fill-none animate-pulse-path"
          strokeLinecap="round"
          strokeDasharray="20, 1000"
        />
      </svg>

      {/* Farm Side (Left) */}
      <div className="absolute left-[8%] bottom-[20%] flex flex-col items-center">
        <div className="relative p-6 bg-card rounded-3xl border-2 border-primary/20 shadow-xl animate-float">
          <div className="absolute -top-3 -right-3 bg-primary text-white p-1.5 rounded-lg">
            <Leaf className="w-4 h-4" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg" />
            <div className="w-8 h-8 bg-green-200 rounded-lg" />
            <div className="w-8 h-8 bg-green-200 rounded-lg" />
            <div className="w-8 h-8 bg-green-100 rounded-lg" />
          </div>
          <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-primary">Farm Hub</p>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="p-2 bg-card rounded-xl border border-border shadow-sm">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="p-2 bg-card rounded-xl border border-border shadow-sm">
            <Cloud className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Urban Side (Right) */}
      <div className="absolute right-[8%] top-[15%] flex flex-col items-center">
        <div className="relative p-6 bg-card rounded-3xl border-2 border-secondary/20 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
          <div className="absolute -top-3 -left-3 bg-secondary text-primary p-1.5 rounded-lg">
            <Home className="w-4 h-4" />
          </div>
          <div className="flex gap-2 items-end">
            <div className="w-6 h-16 bg-muted rounded-t-lg" />
            <div className="w-8 h-20 bg-primary/10 rounded-t-lg" />
            <div className="w-6 h-12 bg-muted rounded-t-lg" />
          </div>
          <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-secondary">Urban Centers</p>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="p-2 bg-card rounded-xl border border-border shadow-sm">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="p-2 bg-card rounded-xl border border-border shadow-sm">
            <Store className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* The Animated Van */}
      <div 
        className="absolute w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl animate-move-on-path z-20"
        style={{ 
          offsetPath: "path('M 100 450 Q 250 450 350 300 T 600 200 T 900 150')",
          animation: 'moveAlongPath 12s infinite linear'
        }}
      >
        <Truck className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-primary animate-ping" />
      </div>

      {/* Tech Labels (Floating) */}
      <div className="absolute left-[30%] top-[40%] glass-card p-3 rounded-xl border border-white/20 animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center gap-2">
          <Wifi className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Traceable Tech</span>
        </div>
      </div>

      <div className="absolute right-[35%] bottom-[30%] glass-card p-3 rounded-xl border border-white/20 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-secondary" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Freshness Verified</span>
        </div>
      </div>

      <div className="absolute left-[50%] top-[20%] glass-card p-3 rounded-xl border border-white/20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="flex items-center gap-2">
          <Package className="w-3 h-3 text-primary-muted" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Direct Chain</span>
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-[80px]" />
    </div>
  );
};
