import React, { useState, useEffect } from 'react';
import { Calendar, Rocket, X, MousePointer2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useInterestStore } from '@/store/interestStore';

const LaunchBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const openInterest = useInterestStore(s => s.open);

  useEffect(() => {
    // Show after a short delay for a better entry effect
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] pointer-events-none px-4 pt-4">
      <div
        className={cn(
          "pointer-events-auto relative overflow-hidden w-full max-w-4xl mx-auto bg-primary text-white rounded-2xl shadow-lg border border-primary-muted/20",
          "animate-in fade-in slide-in-from-top-4 duration-700 ease-out cursor-pointer hover:scale-[1.01] transition-transform active:scale-95"
        )}
        onClick={openInterest}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

        <div className="relative flex items-center justify-between gap-4 p-3 md:p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-secondary text-primary rounded-xl flex items-center justify-center shadow-sm">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm md:text-base font-bold text-white leading-none">
                Launching <span className="text-secondary">May 30, 2026</span>
              </p>
              <p className="text-[10px] md:text-xs text-primary-soft font-medium mt-1">
                Fresh farm-to-table delivery begins Saturday morning.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/10 group-hover:bg-white/20 transition-colors">
                <MousePointer2 className="w-3.5 h-3.5 text-secondary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Click to show interest</span>
             </div>
             <div className="hidden md:flex lg:hidden items-center gap-2 px-3 py-1 bg-white/10 rounded-lg border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Save the date</span>
             </div>
             <button
              onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
              className="p-2 text-primary-muted hover:text-white transition-all hover:bg-white/10 rounded-lg relative z-10"
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
