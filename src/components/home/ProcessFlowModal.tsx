import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronRight, ChevronLeft, ShoppingBag, Bell, Leaf, Package, Truck, Home as HomeIcon, Store } from "lucide-react";
import uncleOrdering from "@/assets/uncle ordering.png";
import farmerReceiving from "@/assets/farmer recieving.png";
import harvesting from "@/assets/harvesting.png";
import packing from "@/assets/packing.png";
import loadingImg from "@/assets/loading.png";
import deliveryImg from "@/assets/delievery.png";

const steps = [
  {
    title: "Uncle Ordering",
    description: "Our customers, like 'Uncle', browse the freshest seasonal produce and place orders directly through the Farmes app.",
    image: uncleOrdering,
    icon: ShoppingBag,
    color: "bg-blue-500",
  },
  {
    title: "Farmer Received Order",
    description: "The moment an order is confirmed, the farmer receives an instant notification with all details on their specialized dashboard.",
    image: farmerReceiving,
    icon: Bell,
    color: "bg-orange-500",
  },
  {
    title: "Farmer Harvest",
    description: "To ensure peak freshness, farmers harvest your produce at dawn on the day of delivery. No cold storage, just nature's best.",
    image: harvesting,
    icon: Leaf,
    color: "bg-green-500",
  },
  {
    title: "Farmer Packing",
    description: "The harvest is carefully graded and packed into our signature Farmes bags right at the farm gate.",
    image: packing,
    icon: Package,
    color: "bg-amber-600",
  },
  {
    title: "Loading & Logistics",
    description: "Packed goods are loaded into our optimized logistics network, ensuring minimal handling and maximum speed.",
    image: loadingImg,
    icon: Truck,
    color: "bg-primary",
  },
  {
    title: "Doorstep Delivery",
    description: "From farm to your table in less than 12 hours. Experience the true taste of fresh, honest food.",
    image: deliveryImg,
    icon: HomeIcon,
    color: "bg-secondary",
  },
];

interface ProcessFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProcessFlowModal = ({ isOpen, onClose }: ProcessFlowModalProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentStep(0);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-[90vh] md:h-auto md:aspect-[16/9] bg-card rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 fade-in duration-500 flex flex-col md:flex-row">
        
        {/* Progress Bar (Top) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-border z-30">
          <div 
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-background/50 backdrop-blur-md border border-border hover:bg-background transition-all shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress Sidebar (Desktop) */}
        <div className="hidden md:flex w-24 flex-col items-center justify-center gap-6 border-r border-border bg-muted/30 relative z-10">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                currentStep === idx ? "h-12 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" : "bg-border hover:bg-primary/50"
              }`}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
          
          {/* Image Section */}
          <div className="h-[35vh] md:h-full md:flex-1 relative overflow-hidden group shrink-0">
            {steps.map((s, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) transform ${
                  currentStep === idx 
                    ? "opacity-100 scale-100 translate-x-0" 
                    : idx < currentStep 
                      ? "opacity-0 scale-125 -translate-x-full" 
                      : "opacity-0 scale-125 translate-x-full"
                }`}
              >
                <img 
                  src={s.image} 
                  alt={s.title} 
                  className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
              </div>
            ))}
            
            {/* Step Number Overlay */}
            <div className="absolute bottom-6 left-6 md:top-10 md:left-10 md:bottom-auto flex items-center gap-4 z-20">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${step.color} flex items-center justify-center text-white shadow-2xl animate-float`}>
                <step.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="glass-card px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl border border-white/30 text-white font-bold text-xs md:text-sm backdrop-blur-md shadow-xl">
                Step {currentStep + 1} of 6
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="flex-1 overflow-y-auto p-6 md:p-16 flex flex-col bg-card relative z-10 custom-scrollbar">
            <div key={currentStep} className="animate-in slide-in-from-right-12 fade-in duration-700 ease-out flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <span className={`w-2 h-2 rounded-full animate-ping ${step.color}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.color.replace('bg-', 'text-')}`}>
                  The Journey
                </span>
              </div>
              
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 md:mb-8 tracking-tight">
                {step.title}
              </h2>
              
              <p className="text-base md:text-xl text-muted-foreground leading-relaxed mb-8 md:mb-12 font-medium">
                {step.description}
              </p>

              {/* Navigation Controls */}
              <div className="flex items-center gap-4 md:gap-6 mt-auto pt-6 border-t border-border/50">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`h-12 w-12 md:h-16 md:w-16 flex items-center justify-center rounded-xl md:rounded-2xl border-2 border-border transition-all ${
                    currentStep === 0 ? "opacity-20 cursor-not-allowed" : "hover:bg-muted hover:border-primary/20 active:scale-95 shadow-sm"
                  }`}
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
                
                {currentStep === steps.length - 1 ? (
                  <button 
                    onClick={() => { onClose(); navigate("/market"); }}
                    className="flex-1 h-12 md:h-16 flex items-center justify-center gap-2 rounded-xl md:rounded-2xl bg-primary px-6 md:px-8 text-sm md:text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 hover:brightness-110"
                  >
                    Go to Market
                    <Store className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={nextStep}
                    className="flex-1 h-12 md:h-16 flex items-center justify-center gap-2 rounded-xl md:rounded-2xl bg-primary px-6 md:px-8 text-sm md:text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 hover:brightness-110"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Step Indicators (Mobile) */}
            <div className="flex md:hidden gap-2 mt-8 justify-center">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep === idx ? "w-8 bg-primary" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
