import { Link } from "react-router-dom";
import { 
  CheckCircle2, Truck, Clock, Leaf, ShieldCheck, 
  ArrowRight, Users, Smartphone, BarChart3, Map, 
  Package, Zap, Calendar, Heart, Globe, MessageSquare, 
  HelpCircle, ChevronDown, Award, PlayCircle
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useProcessModal } from "@/store/processModal";

// Assets
import heroImage from "@/assets/how-it-works-hero.png";
import dashboardImage from "@/assets/farmer-dashboard.png";
import harvestImage from "@/assets/harvest-and-pack.png";

const HowItWorks = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const steps = [
    {
      day: "Mon & Thu",
      time: "9:00 PM",
      title: "Notified to farmers",
      description: "Customer orders from across the network are aggregated and instantly shared with our partnered farmers through the Farmes Smart Dashboard.",
      icon: Smartphone,
      color: "bg-blue-500"
    },
    {
      day: "Tue & Fri",
      time: "4:00 AM",
      title: "Fresh Harvest",
      description: "Farmers receive exact demand data. They harvest only what's needed, ensuring zero wastage and maximum freshness at the source.",
      icon: Leaf,
      color: "bg-green-500"
    },
    {
      day: "Tue & Fri",
      time: "8:00 AM",
      title: "Direct Packing",
      description: "Produce is quality-checked and packed in Farmes eco-friendly packaging right at the farm. No central warehouse, no cold storage delays.",
      icon: Package,
      color: "bg-orange-500"
    },
    {
      day: "Tue & Fri",
      time: "2:00 PM",
      title: "Last-Mile Delivery",
      description: "Our logistics partners dispatch orders through an optimized community network. Fresh produce reaches your doorstep within 12 hours of harvest.",
      icon: Truck,
      color: "bg-primary"
    }
  ];

  const stats = [
    { label: "Middlemen Removed", value: "100%", description: "Direct farm-to-home connection" },
    { label: "Harvest Window", value: "12 Hours", description: "From farm soil to your kitchen" },
    { label: "Farmer Earnings", value: "+40%", description: "Higher prices for local farmers" },
    { label: "Food Wastage", value: "< 2%", description: "Demand-based harvesting model" }
  ];

  const faqs = [
    {
      q: "When do I need to place my order?",
      a: "You can place orders anytime! However, orders are locked and sent to farmers every Monday and Thursday at 9:00 PM for the next delivery cycle."
    },
    {
      q: "When will my order be delivered?",
      a: "Orders placed before Monday 9 PM are delivered on Tuesday afternoon. Orders placed before Thursday 9 PM are delivered on Friday afternoon."
    },
    {
      q: "How do you ensure the produce is fresh?",
      a: "We have a zero-storage model. This means we don't have warehouses. Farmers harvest only after an order is placed, and it's sent directly to you within 12 hours."
    },
    {
      q: "Can I subscribe for regular deliveries?",
      a: "Yes! You can set up a 'Set & Forget' subscription. Just add items to your recurring basket and they will be automatically ordered every cycle."
    },
    {
      q: "How does Farmes help farmers?",
      a: "We provide farmers with a digital platform to reach customers directly, eliminating 3-4 layers of middlemen. This ensures they get better prices and reduces wastage through demand-based harvesting."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative px-5 pt-12 pb-20 lg:px-0 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary mb-6">
              <Zap className="h-3.5 w-3.5" />
              Revolutionizing Fresh Commerce
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              The <span className="text-primary">12-Hour</span> <br />
              Freshness Window.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              Farmes isn't just a grocery app. It's a technology-driven logistics network that eliminates the warehouse entirely. From the farm soil to your door in half a day.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/market" className="h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-xl shadow-primary/25">
                Start Ordering
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button 
                onClick={useProcessModal.getState().open}
                className="h-14 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-background px-8 text-base font-bold text-foreground transition-all hover:bg-muted"
              >
                <PlayCircle className="h-5 w-5" />
                Watch Process
              </button>
            </div>
          </div>
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl animate-float">
              <img src={heroImage} alt="Farm to Home Illustration" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="px-5 py-12 bg-secondary-soft/50 border-y border-border/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-black text-primary">{stat.value}</p>
              <p className="mt-1 text-sm font-bold text-foreground">{stat.label}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Cycle Timeline */}
      <section className="px-5 py-24 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold">How the Magic Happens</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our unique demand-based logistics model ensures you get produce that was growing in the soil just hours before it reached your kitchen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-border -z-0" />
            
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6", step.color)}>
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-[10px] font-black uppercase tracking-widest mb-3">
                  <Calendar className="h-3 w-3" />
                  {step.day} | {step.time}
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farmer Empowerment Section */}
      <section className="px-5 py-24 bg-primary text-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white/5">
                <img src={dashboardImage} alt="Farmer Dashboard" className="w-full h-auto" />
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Empowering Farmers with <br />
              <span className="text-secondary italic">Smart Logistics.</span>
            </h2>
            <p className="mt-6 text-lg text-primary-soft leading-relaxed">
              We provide local farmers with a comprehensive digital commerce and logistics platform. No more selling to middlemen for pennies. No more seeing 30% of harvest go to waste in cold storage.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Direct-to-consumer digital marketplace",
                "Demand-based harvesting data",
                "Real-time payment settlements",
                "Consolidated logistics coordination"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
               <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-primary hover:bg-secondary/90 transition-all">
                  Join as Partner Farmer
                  <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Sustainability */}
      <section className="px-5 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
               <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Ultra-Fresh. Ultra-Transparent.</h2>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Map className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="font-bold">Transparent Tracking</h4>
                        <p className="text-sm text-muted-foreground mt-1">Know exactly which farm your tomatoes came from and when they were harvested.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Award className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="font-bold">Quality Guaranteed</h4>
                        <p className="text-sm text-muted-foreground mt-1">Every item is quality-checked at the farm gate before being dispatched.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Globe className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="font-bold">Sustainable Chain</h4>
                        <p className="text-sm text-muted-foreground mt-1">Reduced food miles and zero-waste packaging for a healthier planet.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video">
                <img src={harvestImage} alt="Fresh Harvest" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                   <div className="text-white">
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary">Live Update</p>
                      <h4 className="text-xl font-bold mt-1">Farmer Raghu just harvested 40kg of Tomatoes for tomorrow's delivery.</h4>
                   </div>
                </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-display text-3xl font-bold mb-12 text-center">Common Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-bold text-left text-sm">{faq.q}</span>
                    <ChevronDown className={cn("h-5 w-5 transition-transform", activeFaq === i ? "rotate-180" : "")} />
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 py-4 bg-muted/30 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed text-left">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20 bg-secondary/10 rounded-[3rem] mx-5 lg:mx-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-extrabold mb-6">Ready for a Fresher Future?</h2>
          <p className="text-lg text-muted-foreground mb-10">Join the thousands of families already enjoying the best produce local farms have to offer.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="h-14 inline-flex items-center justify-center rounded-2xl bg-primary px-10 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Create Customer Account
            </Link>
            <Link to="/farmers" className="h-14 inline-flex items-center justify-center rounded-2xl border-2 border-primary/20 bg-transparent px-10 text-base font-bold text-primary hover:bg-primary/5 transition-all">
              Are you a Farmer?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
