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
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState("Tuesday, before 9 PM");
  const [orderCutoffTime, setOrderCutoffTime] = useState("today at 9:00 PM");
  const [deliveryPrice, setDeliveryPrice] = useState(29);
  const [packagingFee, setPackagingFee] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.allSettled([api.listProducts(), api.getSettings()])
      .then(([productsResult, settingsResult]) => {
        if (productsResult.status === "fulfilled") {
          setProducts(productsResult.value.map(toUiProduct));
        } else {
          setProducts([]);
        }

        if (settingsResult.status === "fulfilled") {
          const settings = settingsResult.value;
          setDeliveryPrice(Number(settings.deliveryPrice));
          setPackagingFee(Number(settings.packagingFee));
          setPlatformFee(Number(settings.platformFee));
          setGstPercentage(Number(settings.gstPercentage));
          setScheduledDeliveryTime(settings.scheduledDeliveryTime || "Tuesday, before 9 PM");
          setOrderCutoffTime(settings.orderCutoffTime || "today at 9:00 PM");
        }
      })
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
  const delivery = subtotal > 0 ? deliveryPrice : 0;
  const packaging = subtotal > 0 ? packagingFee : 0;
  const platform = subtotal > 0 ? platformFee : 0;
  const taxableAmount = subtotal + packaging + platform;
  const gstAmount = subtotal > 0 ? (taxableAmount * gstPercentage) / 100 : 0;
  const total = subtotal + delivery + packaging + platform + gstAmount;

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
      // 1. Create the order
      const order = await api.createOrder({ items: orderItems });
      
      // 2. Create the payment record and get Razorpay Order ID
      const paymentInfo = await api.createPayment(order.id);
      
      // 3. Get user info for prefill
      const user = await api.getMe();

      // 4. Initialize Razorpay Checkout
      const options = {
        key: "rzp_live_SneI0gY3n6RMSk", // Razorpay Key ID
        amount: paymentInfo.amount,
        currency: "INR",
        name: "farmes",
        description: `Order #${order.id.slice(0, 8)}`,
        order_id: paymentInfo.razorpayOrderId,
        handler: async (response: any) => {
          try {
            setPlacingOrder(true);
            await api.verifyPayment({
              paymentId: paymentInfo.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clear();
            navigate("/orders");
          } catch (verifyErr) {
            setCheckoutError("Payment verification failed. Please contact support.");
          } finally {
            setPlacingOrder(false);
          }
        },
        prefill: {
          name: user.name || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#2D5A27", // Primary green
        },
        modal: {
          ondismiss: () => {
            setPlacingOrder(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setCheckoutError(response.error.description || "Payment failed.");
        setPlacingOrder(false);
      });
      rzp.open();

    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to initiate checkout.";
      if (message.toLowerCase().includes("session expired") || message.toLowerCase().includes("log in again")) {
        navigate("/login?next=/cart");
        return;
      }
      setCheckoutError(message);
      setPlacingOrder(false);
    }
  };

  const formatSize = (kg: number) => (kg < 1 ? `${kg * 1000}g` : `${kg}kg`);

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
          <p className="font-display text-sm font-bold text-primary">Next delivery - {scheduledDeliveryTime}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-primary/80">
            <Clock className="h-3 w-3" />
            Order cutoff: {orderCutoffTime}
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
                Rs {Math.round(item.pricePerKg * item.qty)}
                <span className="ml-1 text-[10px] font-medium text-muted-foreground">(Rs {item.pricePerKg}/kg)</span>
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-background px-1 py-1">
              <button 
                onClick={() => setQty(item.id, Math.max(0, item.qty - (item.qty <= 1 && item.qty > 0 ? item.qty : 1)))} 
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted" 
                aria-label="Decrease"
              >
                {item.qty <= 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              </button>
              <span className="min-w-[40px] px-1 text-center font-display text-[12px] font-bold">{formatSize(item.qty)}</span>
              <button 
                onClick={() => setQty(item.id, item.qty + 1)} 
                className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground" 
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {detailed.length > 0 ? (
        <>
          <div className="mx-5 mt-5 space-y-2.5 rounded-lg border border-border bg-card p-4 shadow-soft lg:mx-0">
            <Row label="Subtotal" value={`Rs ${subtotal.toFixed(2)}`} />
            {delivery > 0 ? <Row label="Delivery" value={`Rs ${delivery.toFixed(2)}`} /> : null}
            {packaging > 0 ? <Row label="Packaging Fee" value={`Rs ${packaging.toFixed(2)}`} /> : null}
            {platform > 0 ? <Row label="Platform Fee" value={`Rs ${platform.toFixed(2)}`} /> : null}
            {gstAmount > 0 ? <Row label={`GST (${gstPercentage}%)`} value={`Rs ${gstAmount.toFixed(2)}`} /> : null}
            <div className="border-t border-border pt-2.5">
              <Row label="Total" value={`Rs ${total.toFixed(2)}`} bold />
            </div>
          </div>

          <div className="mt-5 space-y-2.5 px-5 lg:px-0">
            <button disabled={placingOrder} onClick={() => void placeOrder()} className="w-full rounded-lg bg-primary py-4 font-display text-sm font-bold text-primary-foreground shadow-card transition-transform active:scale-[0.98] disabled:opacity-60">
              {placingOrder ? "Placing order..." : `One-time order - Rs ${total.toFixed(2)}`}
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
