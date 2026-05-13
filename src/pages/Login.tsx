import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Phone, ArrowLeft, MessageSquare } from "lucide-react";

const Login = ({ signup = false }: { signup?: boolean }) => {
  const [view, setView] = useState<"auth" | "forgot">("auth");
  const [phone, setPhone] = useState("+91");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = useMemo(() => params.get("next") || "/", [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPhone = phone.trim();
    if (!trimmedPhone.startsWith("+") || trimmedPhone.length < 10) {
      setError("Enter a valid mobile number with country code (e.g. +91XXXXXXXXXX).");
      return;
    }

    setLoading(true);

    try {
      if (signup) {
        if (name.trim().length < 2) throw new Error("Name must be at least 2 characters.");
        if (address.trim().length < 5) throw new Error("Please enter a valid delivery address.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        await api.register(trimmedPhone, name.trim(), password, address.trim());
      } else {
        await api.login(trimmedPhone, password);
      }
      navigate(next, { replace: true });
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-5 py-10 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all hover:shadow-2xl">
        {/* Header Decor */}
        <div className="h-2 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />
        
        <div className="p-8">
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <span className="text-3xl font-display font-black text-primary italic">f</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              {view === "forgot" ? "Need help?" : signup ? "Join farmes" : "Welcome back"}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground max-w-[280px]">
              {view === "forgot" ? "Our support team will help you regain access to your account." : 
               signup ? "Sign up to start shopping fresh farm-to-home produce." : "Login to access your orders and fresh harvest."}
            </p>
          </div>

          {view === "auth" ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {signup && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">Full Name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="flex h-12 w-full rounded-xl border border-border bg-background/50 px-4 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">Delivery Address</label>
                  <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no, Street, Area" className="flex h-12 w-full rounded-xl border border-border bg-background/50 px-4 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none" />
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">Mobile Number</label>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 00000 00000" className="flex h-12 w-full rounded-xl border border-border bg-background/50 px-4 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Password</label>
                  {!signup && (
                    <button type="button" onClick={() => setView("forgot")} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Forgot password?</button>
                  )}
                </div>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="flex h-12 w-full rounded-xl border border-border bg-background/50 px-4 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none" />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/5 p-4 text-sm font-medium text-destructive border border-destructive/10 animate-in fade-in slide-in-from-top-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="group relative w-full overflow-hidden rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-70">
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Processing..." : signup ? "Create Account" : "Sign In"}
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-primary/5 p-8 border border-primary/10 text-center">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
                <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
                
                <div className="relative z-10">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Phone className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Contact support for manual reset</p>
                  <p className="text-3xl font-black text-primary tracking-tight">9949021288</p>
                  
                  <div className="mt-6 flex flex-col gap-3">
                    <a href="tel:9949021288" className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90">
                      <Phone className="h-4 w-4" />
                      Call Support
                    </a>
                    <a href={`https://wa.me/919949021288?text=I need help resetting my farmes password for ${phone}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full rounded-xl border border-primary/20 bg-white py-3 text-sm font-bold text-primary transition-all hover:bg-primary/5">
                      <MessageSquare className="h-4 w-4" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setView("auth")} 
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-border py-3.5 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </button>
            </div>
          )}

          {view === "auth" && (
            <div className="mt-8 text-center border-t border-border/50 pt-6">
              <p className="text-sm text-muted-foreground font-medium">
                {signup ? "Already part of the community?" : "New to farmes?"}
              </p>
              <Link 
                to={signup ? `/login?next=${encodeURIComponent(next)}` : `/signup?next=${encodeURIComponent(next)}`} 
                className="mt-1.5 inline-block text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4"
              >
                {signup ? "Sign in to your account" : "Create a free account"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
