import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Tractor } from "lucide-react";
import farmerPortrait from "@/assets/farmer-1.jpg";
import farmHero from "@/assets/farm-1.jpg";
import { api } from "@/lib/api";
import { toUiProduct } from "@/lib/mappers";
import { Loader } from "@/components/ui/loader";

type FarmerCard = {
  id: string;
  name: string;
  farmName: string;
  location: string;
  productCount: number;
  topProducts: string[];
};

const Farmers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [farmers, setFarmers] = useState<FarmerCard[]>([]);

  useEffect(() => {
    setLoading(true);
    api
      .listProducts()
      .then((list) => {
        const uiProducts = list.map(toUiProduct);
        const farmerMap = new Map<string, FarmerCard>();
        list.forEach((product, index) => {
          const mapped = uiProducts[index];
          const existing = farmerMap.get(product.farmerId);
          if (!existing) {
            farmerMap.set(product.farmerId, {
              id: product.farmerId,
              name: product.farmer.user.name || product.farmer.farmName || "Farm Partner",
              farmName: product.farmer.farmName || "Partner Farm",
              location: product.farmer.villageOrAddress,
              productCount: 1,
              topProducts: [mapped.name],
            });
            return;
          }
          existing.productCount += 1;
          if (existing.topProducts.length < 4 && !existing.topProducts.includes(mapped.name)) {
            existing.topProducts.push(mapped.name);
          }
        });
        setFarmers(Array.from(farmerMap.values()));
        setError(null);
      })
      .catch((err: Error) => {
        setFarmers([]);
        setError(err.message || "Unable to load farmers.");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalProducts = useMemo(() => farmers.reduce((sum, farmer) => sum + farmer.productCount, 0), [farmers]);

  return (
    <div className="pb-12">
      <section className="mt-8 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="relative h-52 w-full">
          <img src={farmHero} alt="Farmes partner farms" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Farm network</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-white">Our Farmers</h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-border p-4 md:grid-cols-3">
          <Stat label="Farmers" value={String(farmers.length)} />
          <Stat label="Products" value={String(totalProducts)} />
          <Stat label="Coverage" value="Live" />
        </div>
      </section>

      {loading ? <Loader text="Loading farmers..." /> : null}
      {error ? <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{error}</div> : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {farmers.map((farmer) => (
          <article key={farmer.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-soft transition-shadow hover:shadow-card">
            <div className="flex items-center gap-4 p-4">
              <img src={farmerPortrait} alt={farmer.name} className="h-16 w-16 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-bold">{farmer.name}</p>
                <p className="truncate text-xs font-semibold uppercase tracking-wider text-secondary">{farmer.farmName}</p>
                <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {farmer.location}
                </p>
              </div>
              <Tractor className="h-5 w-5 text-primary" />
            </div>
            <div className="border-t border-border px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground">{farmer.productCount} active products</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {farmer.topProducts.map((name) => (
                  <span key={name} className="rounded-md bg-primary-soft px-2 py-1 text-[11px] font-semibold text-primary">
                    {name}
                  </span>
                ))}
              </div>
              <Link to={`/farmer/${farmer.id}`} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                View farmer profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold text-foreground">{value}</p>
    </div>
  );
}

export default Farmers;
