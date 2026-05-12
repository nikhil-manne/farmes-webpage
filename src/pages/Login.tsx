import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";

const Login = ({ signup = false }: { signup?: boolean }) => {
  const [view, setView] = useState<"auth" | "forgot" | "reset">("auth");
  const [phone, setPhone] = useState("+91");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = useMemo(() => params.get("next") || "/", [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const trimmedPhone = phone.trim();
    if (!trimmedPhone.startsWith("+") || trimmedPhone.length < 10) {
      setError("Enter a valid mobile number with country code (e.g. +91XXXXXXXXXX).");
      return;
    }

    setLoading(true);

    try {
      if (view === "auth") {
        if (signup) {
          if (name.trim().length < 2) throw new Error("Name must be at least 2 characters.");
          if (password.length < 6) throw new Error("Password must be at least 6 characters.");
          await api.register(trimmedPhone, name.trim(), password);
        } else {
          await api.login(trimmedPhone, password);
        }
        navigate(next, { replace: true });
      } else if (view === "forgot") {
        await api.sendForgotPasswordOtp(trimmedPhone);
        setMessage("OTP sent to your mobile number.");
        setView("reset");
      } else if (view === "reset") {
        if (newPassword.length < 6) throw new Error("New password must be at least 6 characters.");
        await api.resetPassword({ phone: trimmedPhone, otp, newPassword });
        setMessage("Password reset successfully. Please login.");
        setView("auth");
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-card">
        <p className="text-center font-display text-3xl font-extrabold text-primary">farmes</p>
        
        <h1 className="mt-4 text-center font-display text-2xl font-bold">
          {view === "forgot" ? "Reset Password" : view === "reset" ? "Verify OTP" : signup ? "Create account" : "Login"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {view === "forgot" ? "Enter your mobile number to receive an OTP." : 
           view === "reset" ? "Enter the OTP and your new password." :
           signup ? "Sign up to start shopping fresh." : "Welcome back! Login to your account."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {(view === "auth" && signup) && (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </label>
          )}
          
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile number</span>
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+919876543210" disabled={view === "reset"} className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
          </label>

          {view === "auth" && (
            <label className="block">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</span>
                {!signup && (
                  <button type="button" onClick={() => setView("forgot")} className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                )}
              </div>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </label>
          )}

          {view === "reset" && (
            <>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">OTP</span>
                <input required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</span>
                <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </label>
            </>
          )}

          {error && <p className="rounded-md bg-destructive/5 p-3 text-sm font-semibold text-destructive">{error}</p>}
          {message && <p className="rounded-md bg-primary/5 p-3 text-sm font-semibold text-primary">{message}</p>}

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">
            {loading ? "Please wait..." : view === "forgot" ? "Send OTP" : view === "reset" ? "Reset Password" : signup ? "Sign Up" : "Login"}
          </button>

          {view !== "auth" && (
            <button type="button" onClick={() => { setView("auth"); setError(null); setMessage(null); }} className="w-full text-center text-sm font-bold text-muted-foreground hover:text-primary">Back to Login</button>
          )}
        </form>

        {view === "auth" && (
          <Link to={signup ? `/login?next=${encodeURIComponent(next)}` : `/signup?next=${encodeURIComponent(next)}`} className="mt-4 block text-center text-sm font-bold text-primary">
            {signup ? "Already have an account? Login" : "New user? Create an account"}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Login;
