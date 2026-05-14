import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, Heart, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from "@/lib/utils";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, Heart, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useInterestStore } from '@/store/interestStore';

export const FarmerInterestPopup = () => {
  const { isOpen, close } = useInterestStore();
  const [showThankYou, setShowThankYou] = useState(false);

  const handleResponse = async (interested: boolean) => {
    try {
      await api.recordInterest(interested);
      localStorage.setItem('farmer_interest_responded', 'true');
      setShowThankYou(true);
      // Wait 3 seconds then close
      setTimeout(() => {
        close();
        // Reset thank you state after closing so it's fresh for next time (if it ever opens again)
        setTimeout(() => setShowThankYou(false), 500);
      }, 3000);
    } catch (error) {
      console.error('Error recording interest:', error);
      close();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="relative w-full max-w-md p-8 overflow-hidden bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 rounded-3xl">
        {!showThankYou && (
          <button 
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
        
        <div className="space-y-8">
          {!showThankYou ? (
            <>
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-2 transform rotate-3">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Interested in Sourcing?</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your interest helps us connect with the right farmers to meet community demand.
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
            </>
          ) : (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-2">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Thank You!</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Your feedback is invaluable. We're working hard to source the freshest produce for you.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

