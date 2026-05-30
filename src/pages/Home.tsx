import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, CheckCircle2, MapPin, Plus, Search, 
  ShieldCheck, Truck, Zap, Clock, Warehouse, 
  Coins, Users, Leaf, Calendar, Award, Smile,
  ChevronLeft, ChevronRight, ShoppingBag
} from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { api, BackendProduct } from "@/lib/api";
import { categories, toUiProduct, UiProduct } from "@/lib/mappers";
import { useCart } from "@/store/cart";
import { Loader } from "@/components/ui/loader";

// Custom components
import { SectionHeading } from "@/components/home/SectionHeading";
import { ProcessStep } from "@/components/home/ProcessStep";
import { BenefitCard } from "@/components/home/BenefitCard";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { useProcessModal } from "@/store/processModal";
import { localGalleryImages } from "@/lib/localGallery";

// Hooks
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";

// Assets
import heroHarvest from "@/assets/farm_to_city_roadmap.jpg";
import logisticsImg from "@/assets/logistics.png";
import farmerSuccess from "@/assets/farmer_success.png";
import farmHero from "@/assets/farm-1.jpg";
import farmerPortrait from "@/assets/farmer-1.jpg";

const highlights = [
  { label: "Delivery Days", value: "Tue & Fri" },
  { label: "Farmer's Share", value: "70-80%" },
  { label: "Storage Used", value: "Zero" },
];

const processSteps = [
  {
    icon: ShoppingBag,
    title: "Fill Your Cart",
    description: "Add items to your cart anytime. Set up subscriptions for your daily essentials with Autopay enabled.",
    stepNumber: 1
  },
  {
    icon: Zap,
    title: "Auto-Order Cutoff",
    description: "At the scheduled cutoff, your cart is automatically ordered and scheduled for the next delivery day.",
    stepNumber: 2
  },
  {
    icon: Leaf,
    title: "Dawn Harvest",
    description: "On delivery days (Tue/Fri), farmers harvest your order at dawn specifically for you.",
    stepNumber: 3
  },
  {
    icon: Truck,
    title: "Afternoon Arrival",
    description: "Our optimized logistics network delivers from farm to your door by the afternoon.",
    stepNumber: 4
  }
];

const Home = () => {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"RELEVANCE" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC">("RELEVANCE");
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [rawProducts, setRawProducts] = useState<BackendProduct[]>([]);
  const [locationLabel, setLocationLabel] = useState("Hyderabad");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const add = useCart((s) => s.add);
  const [quickAddProduct, setQuickAddProduct] = useState<UiProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<number>(1.0);
  const openProcessModal = useProcessModal((s) => s.open);
  
  const [activeGalleryImageIndex, setActiveGalleryImageIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false, dragFree: true });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  // Scroll reveal refs for sections
  const aboutImageReveal = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const aboutContentReveal = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const processStepsStagger = useStaggerReveal<HTMLDivElement>({ staggerDelay: 180 });
  const benefitsStagger = useStaggerReveal<HTMLDivElement>({ staggerDelay: 250 });
  const marketReveal = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const ctaReveal = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const footerReveal = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const highlightsStagger = useStaggerReveal<HTMLDivElement>({ staggerDelay: 150 });

  useEffect(() => {
    setLoading(true);
    api
      .listProducts()
      .then((list) => {
        setRawProducts(list);
        setProducts(list.map(toUiProduct));
        setError(null);
      })
      .catch((err: Error) => {
        setRawProducts([]);
        setProducts([]);
        setError(err.message || "Unable to load products.");
      })
      .finally(() => setLoading(false));

    if (api.hasSession()) {
      api
        .getMe()
        .then((me) => {
          const firstPart = (me.address || "").split(",")[0]?.trim();
          if (firstPart) setLocationLabel(firstPart);
        })
        .catch(() => undefined);
    }

  }, []);

  useEffect(() => {
    if (localGalleryImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveGalleryImageIndex((prev) => (prev + 1) % localGalleryImages.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);


  const farmers = useMemo(() => {
    const unique = new Map<string, { id: string; name: string; location: string; summary: string }>();
    rawProducts.forEach((item) => {
      const supplies = item.farmerSupply?.length
        ? item.farmerSupply
        : [
            {
              farmerId: item.farmerId,
              farmerName: item.farmer.user.name || item.farmer.farmName || "Farm Partner",
              farmerPhone: item.farmer.user.phone,
              farmName: item.farmer.farmName,
              farmerLocation: item.farmer.villageOrAddress,
              availableQtyKg: 0,
              harvestQtyKg: 0,
              landAssignedAcres: 0,
            },
          ];
      supplies.forEach((supply) => {
        if (unique.has(supply.farmerId)) return;
        unique.set(supply.farmerId, {
          id: supply.farmerId,
          name: supply.farmerName || supply.farmName || "Farm Partner",
          location: supply.farmerLocation || "Farm location",
          summary: supply.farmName || "Partner farm",
        });
      });
    });
    return Array.from(unique.values());
  }, [rawProducts]);

  const formatSize = (kg: number) => (kg < 1 ? `${kg * 1000}g` : `${kg}kg`);

  const handleQuickAdd = (product: UiProduct) => {
    setQuickAddProduct(product);
    if (product.allowedPackSizes?.length) {
      const defaultSize = product.defaultPackSize && product.allowedPackSizes.includes(product.defaultPackSize)
        ? product.defaultPackSize
        : product.allowedPackSizes.includes(1.0) ? 1.0 : product.allowedPackSizes[0];
      setSelectedSize(defaultSize);
    } else {
      setSelectedSize(1.0);
    }
  };

  const confirmQuickAdd = () => {
    if (quickAddProduct) {
      add(quickAddProduct.id, selectedSize);
      setQuickAddProduct(null);
    }
  };

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const base = products.filter(
      (vegetable) =>
        (active === "All" || vegetable.category === active) &&
        (vegetable.name.toLowerCase().includes(term) || vegetable.farmerName.toLowerCase().includes(term)),
    );
    if (sortBy === "PRICE_ASC") return [...base].sort((a, b) => a.pricePerKg - b.pricePerKg);
    if (sortBy === "PRICE_DESC") return [...base].sort((a, b) => b.pricePerKg - a.pricePerKg);
    if (sortBy === "NAME_ASC") return [...base].sort((a, b) => a.name.localeCompare(b.name));
    return base;
  }, [active, query, products, sortBy]);

  return (
    <div className="flex flex-col gap-20 pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 lg:px-0 lg:pt-8">
        <Link to="/" className="font-display text-2xl font-bold tracking-normal">
          farm<span className="text-primary">es</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-muted-foreground md:flex">
          <a href="/about-us" className="hover:text-primary transition-colors">Our Story</a>
          <Link to="/gallery" className="hover:text-primary transition-colors">Our Gallery</Link>
          <Link to="/market" className="hover:text-primary transition-colors">Market</Link>
          <Link to="/farmers" className="hover:text-primary transition-colors">Farmers</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to={api.hasSession() ? "/profile" : "/login"} className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
            {api.hasSession() ? "Account" : "Get Started"}
          </Link>
        </div>
      </header>

      {/* Hero Section — uses built-in tailwind animate-in for above-fold speed */}
      <section className="px-5 lg:px-0 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary">
            <MapPin className="h-3.5 w-3.5" />
            farm to {locationLabel}
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Farm. <br />
            <span className="text-primary italic">To Home.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            Farmes is a technology-driven network connecting you directly to local farmers. No middlemen, no cold storage, just honest food harvested at dawn and delivered by dusk.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link 
              to="/gallery"
              className="h-14 inline-flex items-center justify-center rounded-2xl border-2 border-border bg-background px-8 text-base font-bold text-foreground transition-all hover:bg-muted hover:border-primary/20"
            >
              Our Gallery
            </Link>
            <Link 
              to="/farmers"
              className="h-14 inline-flex items-center justify-center rounded-2xl border-2 border-border bg-background px-8 text-base font-bold text-foreground transition-all hover:bg-muted hover:border-primary/20"
            >
              Meet Our Farmers
            </Link>
            <Link 
              to="/market" 
              className="h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-xl shadow-primary/25"
            >
              Shop Fresh Harvest
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          {/* Highlights with stagger */}
          <div ref={highlightsStagger} className="mt-12 grid grid-cols-3 gap-x-10 gap-y-8 md:gap-8 border-t border-border pt-8">
            {highlights.map((item) => (
              <div key={item.label} data-reveal>
                <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold text-foreground">{item.value}</dd>
              </div>
            ))}
          </div>
        </div>
        <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
          <Link to="/gallery" className="block">
            <div className="group relative w-full max-w-[680px] mx-auto lg:ml-auto aspect-square bg-black rounded-[2.5rem] overflow-hidden border border-border shadow-2xl cursor-pointer">
              {localGalleryImages.length > 0 ? (
                <img
                  src={localGalleryImages[activeGalleryImageIndex]?.url}
                  alt={localGalleryImages[activeGalleryImageIndex]?.title || "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm font-semibold">Add images in src/gallery</p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-xs font-semibold">Tap to open full gallery (images + videos)</p>
              </div>
            </div>
          </Link>
          {/* Decorative elements with glow drift */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl glow-drift" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl glow-drift" style={{ animationDelay: '3s' }} />
        </div>
      </section>

      {/* No Storage USP Section — scroll reveal with opposing slide directions */}
      <section id="about" className="px-5 lg:px-0 py-20 bg-primary/5 rounded-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        {/* Decorative floating orbs */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl glow-drift" />
        <div className="absolute bottom-16 right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl glow-drift" style={{ animationDelay: '4s' }} />
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div
            ref={aboutImageReveal.ref}
            className={`order-2 lg:order-1 reveal-rotate-left ${aboutImageReveal.isVisible ? 'visible' : ''}`}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square max-w-md mx-auto lg:mx-0">
               <img src={logisticsImg} alt="Logistics" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-primary/10" />
            </div>
          </div>
          <div
            ref={aboutContentReveal.ref}
            className={`order-1 lg:order-2 reveal-slide-right ${aboutContentReveal.isVisible ? 'visible' : ''}`}
          >
            <SectionHeading 
              badge="Zero Storage Policy"
              title="We Don't Store. We Deliver."
              description="Our Tuesday and Friday delivery schedule is designed for peak freshness. By grouping deliveries, we ensure that food is never stored. It stays in the field until the morning of your delivery."
            />
            <div className="mt-10 space-y-6">
              {[
                { icon: Warehouse, text: "Zero storage. No cold rooms or warehouses ever used." },
                { icon: Calendar, text: "Scheduled Tue/Fri deliveries enable dawn-to-door logistics." },
                { icon: ShieldCheck, text: "Minimal handling—from farm gate to you in hours." }
              ].map((item, i) => (
                <ScrollReveal key={i} animation="fade-up" delay={(i + 1) * 100 as 100 | 200 | 300}>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-soft group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-foreground">{item.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Impact / Community Section */}
      <section className="px-5 lg:px-0 py-20 bg-primary rounded-[3rem] text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mt-32 -mr-32 glow-drift" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mb-32 -ml-32 glow-drift" style={{ animationDelay: '5s' }} />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold mb-6">
            <Coins className="h-3.5 w-3.5 text-secondary" />
            Direct Economic Impact
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
            Supporting Farmers, <br/> <span className="text-secondary italic">One Order at a Time.</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            By eliminating middlemen and cold storage costs, we forward <span className="text-white font-bold underline decoration-secondary decoration-2 underline-offset-4">70-80% of every Rupee</span> you pay directly to the farmers' bank accounts.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-8 border-t border-white/10 pt-10">
            <div>
              <p className="text-4xl font-black text-secondary">70-80%</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-white/60">Farmer's Share</p>
            </div>
            <div>
              <p className="text-4xl font-black text-secondary">24 Hrs</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-white/60">Settlement Time</p>
            </div>
            <div>
              <p className="text-4xl font-black text-secondary">0%</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-white/60">Market Commission</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Benefits — staggered cards */}
      <section className="px-5 lg:px-0 space-y-12">
        <ScrollReveal animation="fade-up">
          <SectionHeading 
            badge="Mutual Growth"
            title="Empowering Everyone in the Chain"
            description="Our platform is designed to create a sustainable ecosystem that benefits both those who grow our food and those who eat it."
          />
        </ScrollReveal>
        <div ref={benefitsStagger} className="grid gap-8">
          <div data-reveal>
            <BenefitCard 
              type="farmer"
              title="For Our Farmers"
              image={farmerSuccess}
              items={[
                "Direct access to urban markets without middlemen.",
                "Consistent demand through data-driven forecasting.",
                "Transparent and fair pricing for every harvest.",
                "Faster settlements directly to bank accounts.",
                "Reduced wastage through order based harvest."
              ]}
            />
          </div>
          <div data-reveal>
            <BenefitCard 
              type="user"
              title="For Our Customers"
              image={farmHero}
              items={[
                "Weekly scheduled deliveries every Tuesday and Friday.",
                "Subscription model for automated recurring essentials.",
                "Autopay enabled—cart items auto-order at cutoff time.",
                "Real-time tracking from farm harvest to your doorstep.",
                "Transparent sourcing—no middlemen or Cold storages."
              ]}
            />
          </div>
        </div>
      </section>

      {/* Market Section — scale reveal */}
      <section id="market" className="px-5 lg:px-0 py-20 bg-secondary/5 rounded-[3rem]">
        <div
          ref={marketReveal.ref}
          className={`max-w-6xl mx-auto reveal-fade-up ${marketReveal.isVisible ? 'visible' : ''}`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <SectionHeading 
                badge="The Market"
                title="Fresh Today"
                description="Explore the best seasonal produce harvested just hours ago."
              />
              <p className="mt-4 text-xs font-semibold text-muted-foreground italic opacity-80">
                * These are estimated prices only. Original prices will be calculated after launch.
              </p>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={scrollPrev} className="h-12 w-12 flex items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-all shadow-soft">
                  <ChevronLeft className="w-6 h-6" />
               </button>
               <button onClick={scrollNext} className="h-12 w-12 flex items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-all shadow-soft">
                  <ChevronRight className="w-6 h-6" />
               </button>
               <Link to="/market" className="h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-6 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all">
                  View Full Market
                  <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </div>

          {loading ? <Loader text="Sourcing fresh products..." /> : null}
          {error ? <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive font-bold text-center">{error}</div> : null}

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {filtered.map((vegetable, idx) => (
                <article
                  key={vegetable.id}
                  className="flex-[0_0_280px] min-w-0 group overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft transition-all hover:shadow-elevated"
                  style={{
                    opacity: marketReveal.isVisible ? 1 : 0,
                    transform: marketReveal.isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 80}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 80}ms`
                  }}
                >
                  <Link to={`/product/${vegetable.id}`} className="block">
                    <div className="aspect-square overflow-hidden bg-muted relative">
                      <img src={vegetable.image} alt={vegetable.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="min-w-0">
                      <Link to={`/product/${vegetable.id}`} className="font-display text-lg font-bold leading-tight hover:text-primary transition-colors">
                        {vegetable.name} {vegetable.nameTe && <span className="text-xs font-medium text-muted-foreground block md:inline md:ml-1">({vegetable.nameTe})</span>}
                      </Link>
                      <p className="mt-1 truncate text-xs font-bold text-muted-foreground uppercase tracking-widest">by {vegetable.farmerName}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-display text-xl font-extrabold text-foreground">
                        ₹{vegetable.defaultPackSize ? (vegetable.quantityPrices?.[vegetable.defaultPackSize] ?? Math.round(vegetable.pricePerKg * vegetable.defaultPackSize)) : vegetable.pricePerKg}
                        <span className="text-xs font-bold text-muted-foreground"> / {vegetable.defaultPackSize ? formatSize(vegetable.defaultPackSize) : vegetable.unit}</span>
                      </p>
                      <div className="flex items-center gap-1 text-[10px] font-black bg-secondary/20 text-secondary px-2 py-0.5 rounded-full uppercase">
                         <Award className="w-3 h-3" />
                         Fresh
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickAdd(vegetable); }}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Basket
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — scale + blur reveal */}
      <section className="px-5 lg:px-0">
        <div
          ref={ctaReveal.ref}
          className={`relative rounded-[3rem] bg-primary p-12 md:p-20 text-center overflow-hidden reveal-scale ${ctaReveal.isVisible ? 'visible' : ''}`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mt-32 -mr-32 glow-drift" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mb-32 -ml-32 glow-drift" style={{ animationDelay: '5s' }} />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Ready to Taste the <br/> <span className="text-secondary italic">Farmes Difference?</span>
            </h2>
            <p className="mt-6 text-lg text-primary-soft leading-relaxed">
              Join thousands of households who have switched to a faster, fresher, and fairer way to buy groceries. No storage, no stale food, just pure farm-to-table goodness.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="h-14 inline-flex items-center justify-center rounded-2xl bg-white px-10 text-base font-bold text-primary transition-all hover:bg-secondary-soft hover:scale-105 active:scale-95 shadow-xl">
                Create Free Account
              </Link>
              <Link to="/farmers" className="h-14 inline-flex items-center justify-center rounded-2xl border-2 border-white/20 bg-transparent px-10 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/40">
                Meet Our Farmers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding — fade up reveal */}
      <footer className="hidden lg:block px-5 lg:px-0 py-12 border-t border-border">
        <div
          ref={footerReveal.ref}
          className={`reveal-fade-up ${footerReveal.isVisible ? 'visible' : ''}`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <Link to="/" className="font-display text-3xl font-extrabold tracking-normal">
                farm<span className="text-primary">es</span>
              </Link>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Empowering farmers, delighting consumers. A technology-driven fresh commerce network.
              </p>
            </div>
            <div className="flex items-center gap-8">
               <div className="flex flex-col items-center">
                  <Smile className="w-8 h-8 text-secondary mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Happy Farmers</span>
               </div>
               <div className="flex flex-col items-center">
                  <Leaf className="w-8 h-8 text-primary mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Always Fresh</span>
               </div>
               <div className="flex flex-col items-center">
                  <Truck className="w-8 h-8 text-primary-muted mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Direct Delivery</span>
               </div>
            </div>
          </div>
          <div className="mt-12 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
            © 2026 Farmes Agricultural Logistics Network. All Rights Reserved.
          </div>
        </div>
      </footer>
      
      {/* Quick Add Modal */}
      {quickAddProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setQuickAddProduct(null)}
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-card p-6 shadow-elevated border border-border animate-in zoom-in-95 duration-200">
            <h3 className="font-display text-xl font-bold">Select Quantity</h3>
            <p className="mt-1 text-sm text-muted-foreground">How much {quickAddProduct.name} would you like?</p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {(quickAddProduct.allowedPackSizes || [1.0]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-xl border px-4 py-3 text-sm font-bold transition-all active:scale-95 ${
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {formatSize(size)}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setQuickAddProduct(null)}
                className="flex-1 rounded-xl border border-border py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-muted"
              >
                Cancel
              </button>
              <button 
                onClick={confirmQuickAdd}
                className="flex-[2] rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                Add Rs {Math.round(quickAddProduct.pricePerKg * selectedSize)}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
