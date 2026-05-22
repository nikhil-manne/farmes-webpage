import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { ChevronRight, FileText, HelpCircle, LogOut, MapPin, Pencil, Phone, Shield, User as UserIcon } from "lucide-react";
import { api, BackendUserAddress } from "@/lib/api";
import { Loader } from "@/components/ui/loader";

type ProfileState = {
  name: string;
  username: string;
  mobile: string;
};

const emptyProfile: ProfileState = { name: "", username: "", mobile: "" };

const Profile = () => {
  const [user, setUser] = useState<ProfileState>(emptyProfile);
  const [draft, setDraft] = useState({ name: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState<BackendUserAddress[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [addressText, setAddressText] = useState("");
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 17.385, lng: 78.4867 });
  const [locating, setLocating] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoaded: mapLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const loadProfile = () => {
    if (!api.hasSession()) {
      navigate("/login?next=/profile");
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([api.getMe(), api.listUserAddresses()])
      .then(([me, savedAddresses]) => {
        const next = {
          name: me.name || "",
          username: me.name ? `@${me.name.replace(/\s+/g, ".").toLowerCase()}` : "",
          mobile: me.phone,
        };
        setUser(next);
        setDraft({ name: next.name });
        setAddresses(savedAddresses);
      })
      .catch((err: Error) => setError(err.message || "Failed to load profile."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onSave = () => {
    const name = draft.name.trim();
    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    api
      .updateMe({ name })
      .then((me) => {
        const next = {
          name: me.name || "",
          username: me.name ? `@${me.name.replace(/\s+/g, ".").toLowerCase()}` : "",
          mobile: me.phone,
        };
        setUser(next);
        setDraft({ name: next.name });
        setEditing(false);
        setSuccess("Profile updated successfully.");
      })
      .catch((err: Error) => setError(err.message || "Could not update profile."))
      .finally(() => setSaving(false));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setPin(coords);
        setMapCenter(coords);
        setLocating(false);
      },
      (err) => {
        setError(err.message || "Unable to fetch current location.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const saveNewAddress = async () => {
    if (!addressText.trim()) {
      setError("Please enter a complete delivery address.");
      return;
    }
    if (!pin) {
      setError("Please drop a pin on the map.");
      return;
    }
    setSavingAddress(true);
    setError(null);
    try {
      await api.createUserAddress({
        label: addressLabel.trim() || undefined,
        address: addressText.trim(),
        latitude: pin.lat,
        longitude: pin.lng,
        isDefault: addresses.length === 0,
      });
      const refreshed = await api.listUserAddresses();
      setAddresses(refreshed);
      setAddressLabel("");
      setAddressText("");
      setPin(null);
      setShowAddAddress(false);
      setSuccess("Address saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save address.");
    } finally {
      setSavingAddress(false);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      await api.setDefaultUserAddress(addressId);
      setAddresses(await api.listUserAddresses());
      setSuccess("Default address updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not set default address.");
    }
  };

  const deleteAddress = async (addressId: string) => {
    const confirmed = window.confirm("Delete this delivery address?");
    if (!confirmed) return;
    try {
      await api.deleteUserAddress(addressId);
      setAddresses(await api.listUserAddresses());
      setSuccess("Address deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete address.");
    }
  };
  const defaultAddress = addresses.find((entry) => entry.isDefault) ?? addresses[0] ?? null;

  return (
    <div>
      <header className="px-5 pt-8 lg:px-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Account</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Profile</h1>
      </header>

      <section className="mx-5 mt-5 rounded-lg border border-border bg-card p-5 shadow-soft lg:mx-0">
        {loading ? <Loader text="Loading profile..." /> : null}
        {error ? <p className="mb-4 rounded-md bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
        {success ? <p className="mb-4 rounded-md bg-primary-soft p-3 text-sm font-semibold text-primary">{success}</p> : null}

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary-soft font-display text-2xl font-bold text-primary">
            {user.name[0] || "F"}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-bold leading-tight">{user.name || "Not set"}</h2>
            <p className="text-xs text-muted-foreground">{user.username || "Username not set"}</p>
          </div>
          <button
            onClick={() => {
              setEditing((value) => !value);
              setDraft({ name: user.name });
              setError(null);
              setSuccess(null);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Edit profile"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4 border-t border-border pt-4">
          <InfoRow icon={Phone} label="Mobile number" value={user.mobile || "Not set"} />
          {editing ? (
            <div className="space-y-3">
              <Field label="Name" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
              <button disabled={saving} onClick={onSave} className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          ) : (
            <InfoRow icon={MapPin} label="Delivery address" value={defaultAddress?.address || "Not set"} multiline />
          )}
        </div>
      </section>

      <section className="mx-5 mt-5 rounded-lg border border-border bg-card p-5 shadow-soft lg:mx-0">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-bold">Delivery Address</h3>
          <button onClick={() => setShowAddAddress((v) => !v)} className="text-xs font-semibold text-primary">
            {showAddAddress ? "Close" : "+ Add location"}
          </button>
        </div>
        <div className="space-y-2">
          {addresses.map((entry) => (
            <div key={entry.id} className="rounded-md border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">{entry.label || "Saved Address"}</p>
                <div className="flex items-center gap-3">
                  {entry.isDefault ? (
                    <span className="text-[10px] font-bold text-primary">DEFAULT</span>
                  ) : (
                    <button onClick={() => void setDefaultAddress(entry.id)} className="text-[10px] font-semibold text-primary">
                      Set default
                    </button>
                  )}
                  <button onClick={() => void deleteAddress(entry.id)} className="text-[10px] font-semibold text-destructive">
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{entry.address}</p>
              <p className="text-[10px] text-muted-foreground">{entry.latitude}, {entry.longitude}</p>
            </div>
          ))}
          {!addresses.length ? <p className="text-xs text-muted-foreground">No saved locations yet.</p> : null}
        </div>

        {showAddAddress ? (
          <div className="mt-3 space-y-2 rounded-md border border-border p-3">
            <input
              value={addressLabel}
              onChange={(e) => setAddressLabel(e.target.value)}
              placeholder="Label (Home, Office)"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
            <textarea
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              placeholder="Full delivery address"
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button onClick={useCurrentLocation} disabled={locating} className="rounded-md border border-border px-3 py-2 text-xs font-semibold">
              {locating ? "Locating..." : "Use current location"}
            </button>
            {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
              mapLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "200px", borderRadius: "8px" }}
                  center={pin ?? mapCenter}
                  zoom={15}
                  onClick={(e) => {
                    if (!e.latLng) return;
                    setPin({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  }}
                  options={{ streetViewControl: false, mapTypeControl: false }}
                >
                  {pin ? <MarkerF position={pin} /> : null}
                </GoogleMap>
              ) : (
                <p className="text-xs text-muted-foreground">Loading map...</p>
              )
            ) : (
              <p className="text-xs text-muted-foreground">Set `VITE_GOOGLE_MAPS_API_KEY` to enable map pin.</p>
            )}
            {pin ? <p className="text-[11px] text-muted-foreground">{pin.lat.toFixed(7)}, {pin.lng.toFixed(7)}</p> : null}
            <button onClick={() => void saveNewAddress()} disabled={savingAddress} className="w-full rounded-md bg-primary py-2 text-xs font-bold text-primary-foreground disabled:opacity-60">
              {savingAddress ? "Saving..." : "Save location"}
            </button>
          </div>
        ) : null}
      </section>

      <Section title="Support">
        <Row icon={HelpCircle} label="Help & Support" hint="Contact us: 9949021288" />
        <Row icon={Phone} label="Contact us" hint="Mon-Sat, 9 AM - 7 PM" />
      </Section>

      <Section title="General">
        <Row icon={FileText} label="Terms & Conditions" onClick={() => navigate("/terms")} />
        <Row icon={Shield} label="Privacy Policy" onClick={() => navigate("/privacy")} />
        <Row icon={UserIcon} label="About farmes" onClick={() => navigate("/about")} />
      </Section>

      <div className="mx-5 mt-5 lg:mx-0">
        <button
          onClick={() => {
            api.resetSession();
            navigate("/login");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-3.5 font-display text-sm font-bold text-destructive shadow-soft transition-colors hover:bg-destructive/5"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">farmes - v1.0.0</p>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, multiline }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) => (
  <label className="block">
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    {multiline ? (
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    ) : (
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    )}
  </label>
);

const InfoRow = ({ icon: Icon, label, value, multiline }: { icon: typeof Phone; label: string; value: string; multiline?: boolean }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold text-foreground ${multiline ? "leading-snug" : "truncate"}`}>{value}</p>
    </div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-6 px-5 lg:px-0">
    <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">{children}</div>
  </section>
);

const Row = ({ icon: Icon, label, hint, onClick }: { icon: typeof Phone; label: string; hint?: string; onClick?: () => void }) => (
  <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-muted/40">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1">
      <p className="font-display text-sm font-semibold">{label}</p>
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </button>
);

export default Profile;
