import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X } from 'lucide-react';
import { api } from '@/lib/api';

export const FarmerInterestPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasResponded = localStorage.getItem('farmer_interest_responded');
    if (!hasResponded) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); // Show after 5 seconds to not overwhelm immediately
      return () => clearTimeout(timer);
    }
  }, []);

  const handleResponse = async (interested: boolean) => {
    try {
      await api.recordInterest(interested);
      localStorage.setItem('farmer_interest_responded', 'true');
      setIsVisible(false);
    } catch (error) {
      console.error('Error recording interest:', error);
      // Still hide it to avoid annoying the user
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
      <Card className="relative w-full max-w-md p-8 overflow-hidden bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 rounded-3xl">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
        
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-2 transform rotate-3">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Help us grow!</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Please let us know if you are interested - this could help us for sourcing with farmers
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => handleResponse(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-7 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-200 dark:shadow-none text-lg"
            >
              Yes, I'm interested
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleResponse(false)}
              className="flex-1 border-slate-200 dark:border-slate-800 py-7 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-lg font-medium"
            >
              No, thanks
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
