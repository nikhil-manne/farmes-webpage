import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MapPin, Plus, Search, ShieldCheck, Truck } from "lucide-react";
import farmHero from "@/assets/farm-1.jpg";
import farmerPortrait from "@/assets/farmer-1.jpg";
import { api } from "@/lib/api";
import { categories, toUiProduct, UiProduct } from "@/lib/mappers";
import { useCart } from "@/store/cart";
import { Loader } from "@/components/ui/loader";

const highlights = [
  { label: "Partner farms", value: "Live" },
  { label: "Weekly harvests", value: "2x" },
  { label: "Avg. delivery", value: "18h" },
];

const promises = [
  { icon: Truck, title: "Scheduled delivery", text: "Tuesday and Friday routes with clear cutoff windows." },
  { icon: ShieldCheck, title: "Verified produce", text: "Sourced from known farms with simple, transparent quality checks." },
  { icon: CheckCircle2, title: "No filler catalog", text: "A focused seasonal selection instead of anonymous marketplace clutter." },
];

const Home = () => {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"RELEVANCE" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC">("RELEVANCE");
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [locationLabel, setLocationLabel] = useState("Hyderabad");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const add = useCart((s) => s.add);

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

  const farmers = useMemo(() => {
    const unique = new Map<string, { id: string; name: string; location: string; summary: string }>();
    products.forEach((item) => {
      if (unique.has(item.farmerId)) return;
      unique.set(item.farmerId, {
        id: item.farmerId,
        name: item.farmerName,
        location: item.farmerLocation,
        summary: "Partner farm",
      });
    });
    return Array.from(unique.values());
  }, [products]);

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
    <div className="pb-12">
      <header className="flex items-center justify-between px-5 pt-6 lg:px-0 lg:pt-8">
        <Link to="/" className="font-display text-2xl font-bold tracking-normal">
          farm<span className="text-primary">es</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
          <a href="#market" className="hover:text-foreground">Market</a>
          <Link to="/farmers" className="hover:text-foreground">Farmers</Link>
          <Link to="/orders" className="hover:text-foreground">Orders</Link>
        </nav>
        <Link to={api.hasSession() ? "/profile" : "/login"} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
          {api.hasSession() ? "Account" : "Login"}
        </Link>
      </header>

      <section className="grid gap-8 px-5 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-0 lg:pt-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Delivering in {locationLabel}
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Fresh produce from real farms.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Browse live harvests, view farmer profiles, add products to your cart, and place one-time orders from the web.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#market" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
              Shop the harvest
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/orders" className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors hover:bg-muted">
              Track orders
            </Link>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-3 border-y border-border py-5">
            {highlights.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-semibold text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={farmHero} alt="Fresh produce farm" className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center gap-4 p-4">
            <img src={farmerPortrait} alt="Farm partner" className="h-14 w-14 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold">{farmers[0]?.name || "Farm Partner"}</p>
              <p className="text-xs text-muted-foreground">{farmers[0]?.location || "Known local farms. Fresh seasonal produce."}</p>
            </div>
            {farmers[0] ? (
              <Link to={`/farmer/${farmers[0].id}`} className="shrink-0 text-sm font-bold text-primary hover:underline">
                View farm
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-3 px-5 pt-10 md:grid-cols-3 lg:px-0">
        {promises.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-lg border border-border bg-card p-5 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-base font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>

      <section id="market" className="px-5 pt-10 lg:px-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">This week's market</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">Fresh today</h2>
          </div>
          <div className="flex h-11 w-full items-center gap-2 rounded-md border border-border bg-card px-3 shadow-soft md:w-[320px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search vegetables or farmers" className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none" />
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button key={category} onClick={() => setActive(category)} className={`h-10 shrink-0 rounded-md border px-4 text-xs font-bold transition-colors ${active === category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"}`}>
              {category}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { key: "RELEVANCE", label: "Sort: Default" },
            { key: "PRICE_ASC", label: "Price: Low to High" },
            { key: "PRICE_DESC", label: "Price: High to Low" },
            { key: "NAME_ASC", label: "Name: A-Z" },
          ].map((option) => (
            <button key={option.key} onClick={() => setSortBy(option.key as typeof sortBy)} className={`h-9 shrink-0 rounded-md border px-3 text-xs font-bold transition-colors ${sortBy === option.key ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>
              {option.label}
            </button>
          ))}
        </div>

        {loading ? <Loader text="Loading fresh products..." /> : null}
        {error ? <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{error}</div> : null}

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((vegetable) => (
            <article key={vegetable.id} className="group overflow-hidden rounded-lg border border-border bg-card shadow-soft transition-shadow hover:shadow-card">
              <Link to={`/product/${vegetable.id}`} className="block">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={vegetable.image} alt={vegetable.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/product/${vegetable.id}`} className="font-display text-sm font-bold leading-tight hover:text-primary">
                      {vegetable.name}
                    </Link>
                    <p className="mt-1 truncate text-xs text-muted-foreground">by {vegetable.farmerName}</p>
                  </div>
                  <button onClick={() => add(vegetable.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform active:scale-95" aria-label={`Add ${vegetable.name}`}>
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
                <p className="mt-3 font-display text-lg font-extrabold">
                  Rs {vegetable.pricePerKg}
                  <span className="text-xs font-semibold text-muted-foreground"> / {vegetable.unit}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="farmers" className="px-5 pt-10 lg:px-0">
        <h2 className="font-display text-2xl font-extrabold">Our farmers</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {farmers.map((farmer) => (
            <Link key={farmer.id} to={`/farmer/${farmer.id}`} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-card">
              <img src={farmerPortrait} alt="" className="h-14 w-14 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold">{farmer.name}</p>
                <p className="truncate text-xs text-muted-foreground">{farmer.location}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
