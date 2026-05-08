import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, MapPin, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";
import { toUiProduct, UiProduct } from "@/lib/mappers";
import { useCart } from "@/store/cart";
import { Loader } from "@/components/ui/loader";

const Product = () => {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<UiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const add = useCart((s) => s.add);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getProduct(id)
      .then((data) => {
        setProduct(toUiProduct(data));
        setError(null);
      })
      .catch((err: Error) => {
        setProduct(null);
        setError(err.message || "Product not found.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Loading product..." />;
  if (!product) return <div className="p-6 text-sm text-muted-foreground">{error || "Product not found."}</div>;

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden bg-muted lg:mt-8 lg:aspect-[16/9] lg:rounded-lg">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        <button onClick={() => navigate(-1)} className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/85 shadow-soft backdrop-blur-md" aria-label="Back">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pt-5 lg:px-0">
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-primary-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight">{product.name}</h1>
        <div className="mt-1 flex items-end gap-2">
          <p className="font-display text-2xl font-bold text-primary">Rs {product.pricePerKg}</p>
          <p className="pb-1 text-sm text-muted-foreground">per {product.unit}</p>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        <Link to={`/farmer/${product.farmerId}`} className="mt-5 flex max-w-xl items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-soft transition-shadow hover:shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-soft font-display font-bold text-primary">
            {product.farmerName[0]}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Grown by</p>
            <p className="font-display text-sm font-bold">{product.farmerName}</p>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" /> {product.farmerLocation}
            </p>
          </div>
          <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
        </Link>

        <div className="mt-5 grid max-w-xl grid-cols-3 gap-3 rounded-lg border border-border bg-card p-4">
          {[
            { label: "Harvest", value: "Fresh" },
            { label: "Delivery", value: "Next slot" },
            { label: "Unit", value: product.unit },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-display text-sm font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[720px] -translate-x-1/2 border-t border-border bg-background/95 px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur-xl lg:left-auto lg:right-8 lg:max-w-[360px] lg:translate-x-0 lg:rounded-t-lg lg:border">
        <button
          onClick={() => {
            add(product.id);
            navigate("/cart");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-display text-sm font-bold text-primary-foreground shadow-card transition-transform active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to cart - Rs {product.pricePerKg}
        </button>
      </div>
      <div className="h-24" />
    </div>
  );
};

export default Product;
