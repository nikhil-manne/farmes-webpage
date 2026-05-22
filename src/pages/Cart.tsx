import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { Clock, MapPin, Minus, Plus, Trash2, Truck } from "lucide-react";
import { api, BackendUserAddress } from "@/lib/api";
import { toUiProduct, UiProduct } from "@/lib/mappers";
import { useCart } from "@/store/cart";
import { Loader } from "@/components/ui/loader";

const DEFAULT_CENTER = { lat: 17.385, lng: 78.4867 };

const Cart = () => {
  const { items, setQty, clear } = useCart();
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [addresses, setAddresses] = useState<BackendUserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [mapPin, setMapPin] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [savingAddress, setSavingAddress] = useState(false);
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState("Tuesday, before 9 PM");
  const [orderCutoffTime, setOrderCutoffTime] = useState("today at 9:00 PM");
  const [deliveryPrice, setDeliveryPrice] = useState(29);
  const [packagingFee, setPackagingFee] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const { isLoaded: mapLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const loadAddresses = async () => {
    if (!api.hasSession()) return;
    const saved = await api.listUserAddresses();
    setAddresses(saved);
    const preferred = saved.find((a) => a.isDefault) ?? saved[0] ?? null;
    setSelectedAddressId(preferred?.id ?? null);
  };

  useEffect(() => {
    Promise.allSettled([api.listProducts(), api.getSettings(), loadAddresses()])
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

  const subtotal = detailed.reduce((sum, item) => sum + (item.quantityPrices?.[item.qty] ?? item.pricePerKg * item.qty), 0);
  const delivery = subtotal > 0 ? deliveryPrice : 0;
  const packaging = subtotal > 0 ? packagingFee : 0;
  const platform = subtotal > 0 ? platformFee : 0;
  const taxableAmount = subtotal + packaging + platform;
  const gstAmount = subtotal > 0 ? (taxableAmount * gstPercentage) / 100 : 0;
  const total = subtotal + delivery + packaging + platform + gstAmount;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCheckoutError("Geolocation is not supported in this browser.");
      return;
    }
    setCheckoutError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setMapPin(coords);
        setMapCenter(coords);
        setLocating(false);
      },
      (error) => {
        setCheckoutError(error.message || "Unable to fetch current location.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const saveAddress = async () => {
    if (!api.hasSession()) {
      navigate("/login?next=/cart");
      return;
    }
    if (!addressLine.trim()) {
      setCheckoutError("Please enter your complete delivery address.");
      return;
    }
    if (!mapPin) {
      setCheckoutError("Please drop a pin on the map or use current location.");
      return;
    }
    setCheckoutError(null);
    setSavingAddress(true);
    try {
      const created = await api.createUserAddress({
        label: addressLabel.trim() || undefined,
        address: addressLine.trim(),
        latitude: mapPin.lat,
        longitude: mapPin.lng,
        isDefault: addresses.length === 0,
      });
      const next = await api.listUserAddresses();
      setAddresses(next);
      setSelectedAddressId(created.id);
      setAddressLabel("");
      setAddressLine("");
      setMapPin(null);
      setShowAddAddress(false);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to save address.");
    } finally {
      setSavingAddress(false);
    }
  };

  const makeDefault = async (addressId: string) => {
    try {
      await api.setDefaultUserAddress(addressId);
      const next = await api.listUserAddresses();
      setAddresses(next);
      setSelectedAddressId(addressId);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to set default address.");
    }
  };

  const placeOrder = async () => {
    if (!api.hasSession()) {
      navigate("/login?next=/cart");
      return;
    }
    const orderItems = items.filter((item) => item.qty > 0).map((item) => ({ productId: item.id, quantity: item.qty }));
    if (!orderItems.length) return;
    if (!selectedAddressId) {
      setCheckoutError("Please select a delivery address before placing your order.");
      return;
    }

    setCheckoutError(null);
    setPlacingOrder(true);
    try {
      const order = await api.createOrder({ items: orderItems, addressId: selectedAddressId });
      const paymentInfo = await api.createPayment(order.id);
      const user = await api.getMe();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_SneI0gY3n6RMSk",
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
          } catch {
            setCheckoutError("Payment verification failed. Please contact support.");
          } finally {
            setPlacingOrder(false);
          }
        },
        prefill: {
          name: user.name || "",
          contact: user.phone || "",
        },
        theme: { color: "#2D5A27" },
        modal: { ondismiss: () => setPlacingOrder(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
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
              <h4 className="truncate font-display text-sm font-semibold">{item.name} {item.nameTe && <span className="ml-1 text-[10px] font-normal text-muted-foreground">({item.nameTe})</span>}</h4>
              <p className="truncate text-[11px] text-muted-foreground">by {item.farmerName}</p>
              <p className="mt-1 font-display text-sm font-bold">
                Rs {Math.round(item.quantityPrices?.[item.qty] ?? item.pricePerKg * item.qty)}
                <span className="ml-1 text-[10px] font-medium text-muted-foreground">(Rs {item.pricePerKg}/kg)</span>
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-background px-1 py-1">
              <button onClick={() => setQty(item.id, Math.max(0, item.qty - (item.qty <= 1 && item.qty > 0 ? item.qty : 1)))} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted" aria-label="Decrease">
                {item.qty <= 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              </button>
              <span className="min-w-[40px] px-1 text-center font-display text-[12px] font-bold">{formatSize(item.qty)}</span>
              <button onClick={() => setQty(item.id, item.qty + 1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground" aria-label="Increase">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {detailed.length > 0 ? (
        <>
          <div className="mx-5 mt-5 space-y-3 rounded-lg border border-border bg-card p-4 shadow-soft lg:mx-0">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold text-foreground">Delivery Address</p>
              <button type="button" onClick={() => setShowAddAddress((s) => !s)} className="text-xs font-semibold text-primary">
                {showAddAddress ? "Close" : "+ Add New"}
              </button>
            </div>

            {addresses.length ? (
              <div className="space-y-2">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`w-full rounded-md border px-3 py-2 text-left ${selectedAddressId === address.id ? "border-primary bg-primary-soft/30" : "border-border bg-background"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground">{address.label || "Saved Address"}</p>
                      <div className="flex items-center gap-2">
                        {address.isDefault ? <span className="text-[10px] font-bold text-primary">DEFAULT</span> : null}
                        {!address.isDefault ? (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              void makeDefault(address.id);
                            }}
                            className="text-[10px] font-semibold text-primary"
                          >
                            Set default
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{address.address}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {address.latitude}, {address.longitude}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No saved addresses yet. Add one to continue.</p>
            )}

            {showAddAddress ? (
              <div className="space-y-2 rounded-md border border-border p-3">
                <input
                  value={addressLabel}
                  onChange={(e) => setAddressLabel(e.target.value)}
                  placeholder="Label (Home, Office)"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <textarea
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Complete delivery address"
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <button type="button" onClick={useCurrentLocation} disabled={locating} className="rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground">
                  {locating ? "Fetching current location..." : "Use current location"}
                </button>
                {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                  mapLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "220px", borderRadius: "8px" }}
                      center={mapPin ?? mapCenter}
                      zoom={15}
                      onClick={(e) => {
                        if (!e.latLng) return;
                        setMapPin({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                      }}
                      options={{ streetViewControl: false, mapTypeControl: false }}
                    >
                      {mapPin ? <MarkerF position={mapPin} /> : null}
                    </GoogleMap>
                  ) : (
                    <p className="text-xs text-muted-foreground">Loading map...</p>
                  )
                ) : (
                  <p className="text-xs text-muted-foreground">Set `VITE_GOOGLE_MAPS_API_KEY` to enable pin-drop map selection.</p>
                )}
                {mapPin ? (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {mapPin.lat.toFixed(7)}, {mapPin.lng.toFixed(7)}
                  </p>
                ) : null}
                <button type="button" onClick={() => void saveAddress()} disabled={savingAddress} className="w-full rounded-md bg-primary py-2 text-xs font-bold text-primary-foreground disabled:opacity-60">
                  {savingAddress ? "Saving address..." : "Save Address"}
                </button>
              </div>
            ) : null}

            {selectedAddress ? (
              <div className="rounded-md border border-primary/20 bg-primary-soft/20 p-3">
                <p className="text-xs font-semibold text-foreground">Selected for delivery</p>
                <p className="mt-1 text-xs text-muted-foreground">{selectedAddress.address}</p>
              </div>
            ) : null}
          </div>

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
