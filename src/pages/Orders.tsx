import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Home as HomeIcon, Package as PackageIcon, Sprout, Truck } from "lucide-react";
import { api } from "@/lib/api";
import { toOrderUiStatus, normalizeProductName } from "@/lib/mappers";
import { Loader } from "@/components/ui/loader";

type Status = "ordered" | "harvesting" | "packed" | "delivery" | "delivered";
type UiOrder = { 
  id: string; 
  date: string; 
  total: number; 
  status: Status;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
};

const steps: { key: Status; label: string; icon: typeof Check }[] = [
  { key: "ordered", label: "Ordered", icon: Check },
  { key: "harvesting", label: "Harvesting", icon: Sprout },
  { key: "packed", label: "Packed", icon: PackageIcon },
  { key: "delivery", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: HomeIcon },
];

const Orders = () => {
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadOrders = () => {
    if (!api.hasSession()) {
      navigate("/login?next=/orders");
      return;
    }
    setLoading(true);
    setError(null);
    api
      .listOrders()
      .then((list) =>
        setOrders(
          list.map((order) => ({
            id: order.id.slice(0, 8).toUpperCase(),
            date: new Date(order.createdAt).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" }),
            total: Number(order.totalAmount),
            status: toOrderUiStatus(order.status),
            items: order.items.map((item) => {
              const normalized = normalizeProductName(item.product?.name || "Product");
              return {
                id: item.id,
                name: normalized.label,
                nameTe: normalized.labelTe,
                quantity: Number(item.quantity || 0),
                price: Number(item.price || item.product?.pricePerKg || 0),
              };
            }),
          })),
        ),
      )
      .catch((err: Error) => {
        setOrders([]);
        setError(err.message || "Unable to load orders.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <header className="px-5 pt-8 lg:px-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Track your harvest</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Orders</h1>
      </header>

      <div className="mt-6 space-y-4 px-5 lg:px-0">
        {loading ? <Loader text="Loading orders..." /> : null}
        {!loading && error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
            <p>{error}</p>
            <button onClick={loadOrders} className="mt-3 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">Retry</button>
          </div>
        ) : null}
        {!loading && !error && orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            No orders yet.
            <Link to="/cart" className="mt-2 block font-semibold text-primary">Go to cart</Link>
          </div>
        ) : null}

        {orders.map((order) => {
          const activeIdx = steps.findIndex((step) => step.key === order.status);
          return (
            <article key={order.id} className="rounded-lg border border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-sm font-bold">{order.id}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {order.date}
                  </p>
                </div>
                <p className="font-display text-base font-bold">Rs {order.total}</p>
              </div>

              <div className="mt-4 rounded bg-muted/50 p-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">Order Items</p>
                <ul className="space-y-1.5">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-xs">
                      <span>
                        {item.name} {item.nameTe && <span className="text-[10px] opacity-60 ml-0.5">({item.nameTe})</span>} x {item.quantity} kg
                      </span>
                      <span className="font-medium">Rs {item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex items-center justify-between">
                {steps.map((step, idx) => {
                  const done = idx < activeIdx;
                  const current = idx === activeIdx;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        <div className={`h-[2px] flex-1 ${idx === 0 ? "opacity-0" : done || current ? "bg-primary" : "bg-border"}`} />
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${done ? "bg-primary text-primary-foreground" : current ? "border-2 border-primary bg-secondary-soft text-primary" : "border border-border bg-background text-muted-foreground"}`}>
                          {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Icon className="h-3.5 w-3.5" />}
                        </div>
                        <div className={`h-[2px] flex-1 ${idx === steps.length - 1 ? "opacity-0" : done ? "bg-primary" : "bg-border"}`} />
                      </div>
                      <p className={`mt-1.5 text-center text-[9px] leading-tight ${current ? "font-bold text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
