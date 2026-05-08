import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, CreditCard, FileText, HelpCircle, LogOut, MapPin, Pencil, Phone, Shield, User as UserIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Loader } from "@/components/ui/loader";

type ProfileState = {
  name: string;
  username: string;
  mobile: string;
  address: string;
};

const emptyProfile: ProfileState = { name: "", username: "", mobile: "", address: "" };

const Profile = () => {
  const [user, setUser] = useState<ProfileState>(emptyProfile);
  const [draft, setDraft] = useState({ name: "", address: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadProfile = () => {
    if (!api.hasSession()) {
      navigate("/login?next=/profile");
      return;
    }
    setLoading(true);
    setError(null);
    api
      .getMe()
      .then((me) => {
        const next = {
          name: me.name || "",
          username: me.name ? `@${me.name.replace(/\s+/g, ".").toLowerCase()}` : "",
          mobile: me.phone,
          address: me.address || "",
        };
        setUser(next);
        setDraft({ name: next.name, address: next.address });
      })
      .catch((err: Error) => setError(err.message || "Failed to load profile."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onSave = () => {
    const name = draft.name.trim();
    const address = draft.address.trim();
    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (address.length > 0 && address.length < 5) {
      setError("Address must be at least 5 characters.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    api
      .updateMe({ name, address: address || undefined })
      .then((me) => {
        const next = {
          name: me.name || "",
          username: me.name ? `@${me.name.replace(/\s+/g, ".").toLowerCase()}` : "",
          mobile: me.phone,
          address: me.address || "",
        };
        setUser(next);
        setDraft({ name: next.name, address: next.address });
        setEditing(false);
        setSuccess("Profile updated successfully.");
      })
      .catch((err: Error) => setError(err.message || "Could not update profile."))
      .finally(() => setSaving(false));
  };

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
              setDraft({ name: user.name, address: user.address });
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
              <Field label="Delivery address" value={draft.address} onChange={(value) => setDraft((current) => ({ ...current, address: value }))} multiline />
              <button disabled={saving} onClick={onSave} className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          ) : (
            <InfoRow icon={MapPin} label="Delivery address" value={user.address || "Not set"} multiline />
          )}
        </div>
      </section>

      <Section title="Support">
        <Row icon={HelpCircle} label="Help & Support" hint="Contact us: 9949021288" />
        <Row icon={Phone} label="Contact us" hint="Mon-Sat, 9 AM - 7 PM" />
      </Section>

      <Section title="General">
        <Row icon={CreditCard} label="Payment methods" />
        <Row icon={FileText} label="Terms & Conditions" />
        <Row icon={Shield} label="Privacy Policy" />
        <Row icon={UserIcon} label="About farmes" />
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

const Row = ({ icon: Icon, label, hint }: { icon: typeof Phone; label: string; hint?: string }) => (
  <button className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-muted/40">
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
