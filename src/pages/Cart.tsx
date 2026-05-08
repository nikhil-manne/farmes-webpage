import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Minus, Plus, Trash2, Truck } from "lucide-react";
import { api } from "@/lib/api";
import { toUiProduct, UiProduct } from "@/lib/mappers";
import { useCart } from "@/store/cart";
import { Loader } from "@/components/ui/loader";

const Cart = () => {
  const { items, setQty, clear } = useCart();
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .listProducts()
      .then((list) => setProducts(list.map(toUiProduct)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const productById = useMemo(() => new Map(products.map((entry) => [entry.id, entry])), [products]);
  const detailed = items
    .map((item) => {
      const product = productById.get(item.id);
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean) as (UiProduct & { qty: number })[];

  const subtotal = detailed.reduce((sum, item) => sum + item.pricePerKg * item.qty, 0);
  const delivery = subtotal > 0 ? 29 : 0;
  const total = subtotal + delivery;

  const placeOrder = async () => {
    if (!api.hasSession()) {
      navigate("/login?next=/cart");
      return;
    }
    const orderItems = items.filter((item) => item.qty > 0).map((item) => ({ productId: item.id, quantity: item.qty }));
    if (!orderItems.length) return;
    setCheckoutError(null);
    setPlacingOrder(true);
    try {
      await api.createOrder({ items: orderItems });
      clear();
      navigate("/orders");
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Unable to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div>
      <header className="px-5 pt-8 lg:px-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Your basket</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Cart</h1>
      </header>

      <div className="mx-5 mt-5 flex items-start gap-3 rounded-lg border border-primary-muted bg-primary-soft p-4 lg:mx-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Truck className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="font-display text-sm font-bold text-primary">Next delivery - Tuesday, before 9 PM</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-primary/80">
            <Clock className="h-3 w-3" />
            Order cutoff: today at 9:00 PM
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3 px-5 lg:px-0">
        {loading ? <Loader text="Loading cart details..." /> : null}
        {detailed.length === 0 && !loading ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            Your basket is empty.
            <Link to="/" className="mt-2 block font-semibold text-primary">Browse vegetables</Link>
          </div>
        ) : null}

        {detailed.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-soft">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-display text-sm font-semibold">{item.name}</h4>
              <p className="truncate text-[11px] text-muted-foreground">by {item.farmerName}</p>
              <p className="mt-1 font-display text-sm font-bold">
                Rs {item.pricePerKg * item.qty}
                <span className="ml-1 text-[10px] font-medium text-muted-foreground">(Rs {item.pricePerKg}/{item.unit})</span>
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-background px-1 py-1">
              <button onClick={() => setQty(item.id, item.qty - 1)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted" aria-label="Decrease">
                {item.qty === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              </button>
              <span className="w-5 text-center font-display text-sm font-bold">{item.qty}</span>
              <button onClick={() => setQty(item.id, item.qty + 1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground" aria-label="Increase">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {detailed.length > 0 ? (
        <>
          <div className="mx-5 mt-5 space-y-2.5 rounded-lg border border-border bg-card p-4 shadow-soft lg:mx-0">
            <Row label="Subtotal" value={`Rs ${subtotal}`} />
            <Row label="Delivery" value={`Rs ${delivery}`} />
            <div className="border-t border-border pt-2.5">
              <Row label="Total" value={`Rs ${total}`} bold />
            </div>
          </div>

          <div className="mt-5 space-y-2.5 px-5 lg:px-0">
            <button disabled={placingOrder} onClick={() => void placeOrder()} className="w-full rounded-lg bg-primary py-4 font-display text-sm font-bold text-primary-foreground shadow-card transition-transform active:scale-[0.98] disabled:opacity-60">
              {placingOrder ? "Placing order..." : `One-time order - Rs ${total}`}
            </button>
            {checkoutError ? <p className="text-center text-xs font-semibold text-destructive">{checkoutError}</p> : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={`text-sm ${bold ? "font-display font-bold text-foreground" : "text-muted-foreground"}`}>{label}</span>
    <span className={`font-display ${bold ? "text-lg font-bold" : "text-sm font-semibold"} text-foreground`}>{value}</span>
  </div>
);

export default Cart;
