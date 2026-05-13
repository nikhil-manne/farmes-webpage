import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Award, Filter, ChevronRight, Zap, Calendar } from "lucide-react";
import { api, BackendProduct } from "@/lib/api";
import { categories, toUiProduct, UiProduct } from "@/lib/mappers";
import { useCart } from "@/store/cart";
import { Loader } from "@/components/ui/loader";
import { SectionHeading } from "@/components/home/SectionHeading";

const Market = () => {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"RELEVANCE" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC">("RELEVANCE");
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const add = useCart((s) => s.add);
  const [quickAddProduct, setQuickAddProduct] = useState<UiProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<number>(1.0);

  const formatSize = (kg: number) => (kg < 1 ? `${kg * 1000}g` : `${kg}kg`);

  const handleQuickAdd = (product: UiProduct) => {
    setQuickAddProduct(product);
    if (product.allowedPackSizes?.length) {
      const defaultSize = product.allowedPackSizes.includes(1.0) ? 1.0 : product.allowedPackSizes[0];
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

  useEffect(() => {
    setLoading(true);
    api
      .listProducts()
      .then((list) => {
        setProducts(list.map(toUiProduct));
        setError(null);
      })
      .catch((err: Error) => {
        setProducts([]);
        setError(err.message || "Unable to load products.");
      })
      .finally(() => setLoading(false));
  }, []);

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
    <div className="flex flex-col gap-10 pb-20">
      <header className="flex flex-col gap-6 pt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-bold text-foreground">Market</span>
        </div>
        <SectionHeading 
          badge="Full Catalog"
          title="The Fresh Market"
          description="Browse our complete collection of farm-fresh produce, harvested specifically for your order."
        />

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Next Delivery Days: Tuesday & Friday</p>
              <p className="text-xs text-muted-foreground font-medium">Orders placed now will be delivered on the next consecutive delivery day.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg shadow-sm border border-border">
             <Zap className="w-4 h-4 text-secondary" />
             <span className="text-xs font-bold uppercase tracking-tight">Auto-order at cutoff</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Sidebar - Categories */}
        <aside className="lg:w-64 shrink-0 space-y-8">
          <div className="hidden lg:block">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Categories
            </h3>
            <div className="flex flex-col gap-1">
              {categories.map((category) => (
                <button 
                  key={category} 
                  onClick={() => setActive(category)} 
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${active === category ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-primary/5 text-muted-foreground hover:text-primary"}`}
                >
                  {category}
                  {active === category && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Category Scroll */}
          <div className="lg:hidden">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {categories.map((category) => (
                <button 
                  key={category} 
                  onClick={() => setActive(category)} 
                  className={`h-11 shrink-0 rounded-xl border px-6 text-sm font-bold transition-all ${active === category ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border bg-card text-foreground hover:border-primary/40"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-lg font-display font-bold mb-4">Sort By</h3>
             <div className="flex flex-wrap lg:flex-col gap-2">
                {[
                  { key: "RELEVANCE", label: "Default" },
                  { key: "PRICE_ASC", label: "Price: Low to High" },
                  { key: "PRICE_DESC", label: "Price: High to Low" },
                  { key: "NAME_ASC", label: "Name: A-Z" },
                ].map((option) => (
                  <button 
                    key={option.key} 
                    onClick={() => setSortBy(option.key as typeof sortBy)} 
                    className={`h-10 px-4 rounded-xl text-xs font-bold transition-all border ${sortBy === option.key ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                  >
                    {option.label}
                  </button>
                ))}
             </div>
          </div>
        </aside>

        {/* Main Content - Product Grid */}
        <div className="flex-1 space-y-8">
          <div className="flex h-14 w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-soft focus-within:border-primary transition-colors">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input 
              value={query} 
              onChange={(event) => setQuery(event.target.value)} 
              placeholder="Search for vegetables, fruits or farmers..." 
              className="w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground focus:outline-none" 
            />
          </div>

          {loading ? <Loader text="Refreshing market catalog..." /> : null}
          {error ? <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive font-bold text-center">{error}</div> : null}

          {!loading && !error && filtered.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                 <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
              <button onClick={() => { setActive("All"); setQuery(""); }} className="text-primary font-bold hover:underline">Clear all filters</button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((vegetable) => (
              <article key={vegetable.id} className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft transition-all hover:shadow-elevated hover:-translate-y-1">
                <Link to={`/product/${vegetable.id}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden bg-muted relative">
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
                    <p className="font-display text-2xl font-extrabold text-foreground">
                      ₹{vegetable.pricePerKg}
                      <span className="text-xs font-bold text-muted-foreground"> / {vegetable.unit}</span>
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-black bg-secondary/20 text-secondary px-2 py-0.5 rounded-full uppercase">
                       <Award className="w-3 h-3" />
                       Fresh
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickAdd(vegetable); }}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
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

export default Market;
