import { Link } from "react-router-dom";
import { 
  Heart, Target, Globe, Users, ShieldCheck, 
  ArrowRight, Leaf, Zap, BarChart3, Star, 
  Clock, MapPin, Award, ChevronDown, Rocket,
  Quote, Smartphone, Package, Truck, Info
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Assets
import visionImage from "@/assets/about-us-vision.png";
import farmerImage from "@/assets/farmer-success.png";
import sustainabilityImage from "@/assets/sustainability.png";

const AboutUs = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);



  const values = [
    {
      icon: Target,
      title: "Direct Sourcing",
      description: "We eliminate the 3-4 layers of middlemen that usually sit between the farm and your kitchen."
    },
    {
      icon: Heart,
      title: "Farmer First",
      description: "Our platform ensures farmers get up to 40% more revenue by selling directly to you."
    },
    {
      icon: Leaf,
      title: "Demand-Based",
      description: "We only harvest what you order. This reduces food wastage to less than 2%."
    },
    {
      icon: ShieldCheck,
      title: "Quality First",
      description: "Every product is checked at the farm gate to ensure it meets our 'Dawn-to-Dusk' fresh standards."
    }
  ];

  const faqs = [
    {
      q: "Why is Farmes different from other grocery apps?",
      a: "Most apps use dark stores and warehouses. Farmes is a logistics-first platform with zero storage. We connect you directly to the farmer, and the produce is harvested only after you order it."
    },
    {
      q: "How do you decide the pricing?",
      a: "Our pricing is transparent. Because we remove middlemen, we can give farmers a better price while keeping the cost to consumers competitive for premium quality."
    },
    {
      q: "What is your long-term goal?",
      a: "Our goal is to build a sustainable, tech-driven agricultural network that empowers local communities and reduces the carbon footprint of food logistics."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative px-5 pt-16 pb-24 lg:px-0 bg-gradient-to-b from-primary-soft/30 to-background overflow-hidden">
        <div className="max-w-6xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-8">
            <Globe className="h-3.5 w-3.5" />
            Building a Fairer Food System
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight max-w-4xl mx-auto">
            Connecting <span className="text-primary">Farms</span> Directly <br />
            to Your <span className="text-secondary italic">Table.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Farmes is a technology-driven network designed to transform the agricultural supply chain. We remove the middlemen, eliminate the warehouse, and empower local farmers.
          </p>
          
          <div className="mt-16 relative">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl animate-float max-w-4xl mx-auto">
              <img src={visionImage} alt="Farmes Vision" className="w-full h-auto" />
            </div>
            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 hidden lg:flex bg-white p-4 rounded-2xl shadow-xl items-center gap-3 border border-border animate-in zoom-in duration-700 delay-500">
               <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Star className="h-5 w-5 fill-current" />
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trust Rating</p>
                  <p className="font-display font-bold">4.9/5 Stars</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-5 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                To build a resilient, efficient, and transparent agricultural infrastructure that rewards the people who grow our food and provides the freshest produce to those who eat it.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {values.map((value, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-border hover:border-primary/20 hover:bg-primary-soft/20 transition-all">
                    <value.icon className="h-6 w-6 text-primary mb-3" />
                    <h4 className="font-bold text-sm mb-2">{value.title}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <Quote className="h-12 w-12 text-secondary/30 mb-6" />
                <h3 className="font-display text-2xl font-bold mb-6 italic">"The shortest distance between a farm and a home shouldn't be through a giant warehouse. It should be through a smart network."</h3>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="h-12 w-12 rounded-full bg-secondary-soft/20 border border-white/20 flex items-center justify-center text-secondary font-bold">FV</div>
                  <div>
                    <p className="font-bold">Founder's Vision</p>
                    <p className="text-xs text-primary-soft">Empowering the roots of our food system</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-secondary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Success Section */}
      <section className="px-5 py-24 bg-secondary-soft/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square lg:aspect-auto lg:h-[600px]">
            <img src={farmerImage} alt="Happy Farmer" className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
               <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Verified Partner</span>
               </div>
               <p className="mt-2 font-display text-lg font-bold">Farmer Rameshwar</p>
               <p className="text-xs text-muted-foreground">Earning 42% higher revenue via Farmes</p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6">Empowering the <br/><span className="text-primary italic">Backbone</span> of Agriculture.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Traditional supply chains treat farmers as anonymous suppliers. Farmes treats them as tech-enabled entrepreneurs. We provide them with the tools to manage their own digital commerce and logistics.
            </p>
            <div className="space-y-6">
              {[
                { title: "Direct Market Access", desc: "Farmers set their availability and receive orders directly." },
                { title: "No Cold Storage", desc: "Harvest happens only after an order is confirmed." },
                { title: "Faster Settlements", desc: "Digital payments are processed within 24 hours of delivery." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary text-white flex items-center justify-center font-bold">{i+1}</div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Sustainability Section */}
      <section className="px-5 py-24 bg-primary text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Designed for a <br/><span className="text-secondary">Greener Future.</span></h2>
            <p className="text-lg text-primary-soft leading-relaxed mb-10">
              Agriculture is one of the largest contributors to carbon emissions, largely due to inefficient logistics and massive food wastage. Farmes solves both.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-secondary">
                     <Leaf className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold">Zero Wastage</h4>
                  <p className="text-xs text-primary-soft">Harvesting based on actual demand means we don't throw food away.</p>
               </div>
               <div className="space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-secondary">
                     <Truck className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold">Low Food Miles</h4>
                  <p className="text-xs text-primary-soft">Direct farm-to-community routes reduce transport emissions significantly.</p>
               </div>
            </div>
          </div>
          <div className="relative">
             <div className="relative rounded-[2.5rem] bg-white/5 backdrop-blur-sm p-8 border border-white/10 shadow-2xl animate-float">
                <img src={sustainabilityImage} alt="Sustainability Visual" className="w-full h-auto" />
             </div>
          </div>
        </div>
      </section>


      {/* FAQ & Final CTA */}
      <section className="px-5 py-24 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-12 text-center">About Farmes FAQ</h2>
          <div className="space-y-4 mb-20">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-2xl overflow-hidden transition-all duration-300">
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

          <div className="bg-secondary/10 rounded-[2.5rem] p-10 text-center border border-secondary/20 shadow-xl shadow-secondary/5">
             <h3 className="font-display text-3xl font-bold mb-4">Be Part of the Revolution.</h3>
             <p className="text-muted-foreground mb-8">Whether you're a customer, a farmer, or a logistics partner, there's a place for you in the Farmes ecosystem.</p>
             <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup" className="h-12 inline-flex items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg hover:scale-105 transition-all">
                  Get Started
                </Link>
                <Link to="/how-it-works" className="h-12 inline-flex items-center justify-center rounded-xl border border-primary/20 bg-transparent px-8 text-sm font-bold text-primary hover:bg-primary/5 transition-all">
                  How it Works
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
