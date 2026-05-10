import React, { useState, useEffect } from 'react';
import { Calendar, Rocket, X } from 'lucide-react';
import { cn } from "@/lib/utils";

const LaunchBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay for a better entry effect
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex justify-center p-4 pointer-events-none">
      <div 
        className={cn(
          "pointer-events-auto relative overflow-hidden w-full max-w-2xl bg-primary text-white rounded-2xl shadow-[0_20px_50px_rgba(45,90,39,0.3)] border border-primary-muted/20 p-6 md:p-8",
          "animate-in fade-in slide-in-from-top-12 duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
        )}
      >
        {/* Decorative Animated Elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Shining effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 bg-secondary text-primary rounded-2xl flex items-center justify-center animate-bounce-slow shadow-[0_8px_20px_rgba(212,175,55,0.4)]">
            <Rocket className="w-8 h-8" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-display font-bold text-secondary mb-1 flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-6 h-6" />
              Official Launch Date
            </h3>
            <p className="text-primary-soft text-lg md:text-xl font-medium leading-tight">
              Our services will be launched on <span className="text-white font-extrabold underline decoration-secondary decoration-4 underline-offset-4">May 30, 2026</span>.
            </p>
            <p className="text-primary-muted mt-2 text-sm md:text-base font-medium">
              Orders will be accepted from May 30, 2026. Stay tuned for fresh farm arrivals!
            </p>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 md:top-0 md:right-0 p-3 text-primary-muted hover:text-white transition-all hover:scale-110 active:scale-95"
            aria-label="Close notification"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default LaunchBanner;
