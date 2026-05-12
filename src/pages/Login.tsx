import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";

const Login = ({ signup = false }: { signup?: boolean }) => {
  const [phone, setPhone] = useState("+91");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrivileged, setIsPrivileged] = useState(false);
  
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = useMemo(() => params.get("next") || "/", [params]);

  useEffect(() => {
    // Check if user is potentially privileged to decide whether to show the widget
    // This is just a UI hint, the backend does the real enforcement.
    const trimmedPhone = phone.trim();
    if (trimmedPhone.length >= 10) {
      // We don't know for sure until we try sendOtp, but we can check if it's a known admin number
      // Actually, it's better to just try sendOtp first.
    }
  }, [phone]);

  const handleMsg91Success = async (data: any) => {
    setLoading(true);
    try {
      await api.verifyOtp(phone.trim(), undefined, signup ? name.trim() : undefined, undefined, data);
      navigate(next, { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize MSG91 configuration globally
    (window as any).configuration = {
      widgetId: "36656c684371303739313732",
      tokenAuth: "{token}",
      identifier: phone.trim(),
      exposeMethods: true,
      success: (data: string) => {
        handleMsg91Success(data);
      },
      failure: (error: any) => {
        console.error('MSG91 Error:', error);
        setError("OTP verification failed.");
      },
    };

    // Load MSG91 Script
    if (!document.getElementById('msg91-script')) {
      const script = document.createElement('script');
      script.id = 'msg91-script';
      script.src = "https://verify.msg91.com/otp-provider.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).initSendOTP) {
          (window as any).initSendOTP((window as any).configuration);
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  // Update identifier when phone changes
  useEffect(() => {
    if ((window as any).configuration) {
      (window as any).configuration.identifier = phone.trim();
    }
  }, [phone]);

  const sendOtp = async () => {
    setError(null);
    const trimmedPhone = phone.trim();
    if (!trimmedPhone.startsWith("+") || trimmedPhone.length < 10) {
      setError("Enter a valid mobile number with country code (e.g. +91XXXXXXXXXX).");
      return;
    }
    if (signup && name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setLoading(true);

    try {
      const res = await api.sendOtp(trimmedPhone);
      
      if ((res as any).otp) {
        // MOCK MODE (Admin/Farmer)
        setIsPrivileged(true);
        setOtpSent(true);
        setOtp((res as any).otp);
      } else {
        // REAL MODE (Regular User) - Trigger MSG91 Widget
        if ((window as any).showOTPWidget) {
          (window as any).showOTPWidget();
        } else {
          setError("OTP Service is initializing. Please try again in a moment.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Could not process request.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError(null);
    if (otp.trim().length < 4) {
      setError("Enter a valid OTP.");
      return;
    }
    setLoading(true);
    
    try {
      await api.verifyOtp(phone.trim(), otp.trim(), signup ? name.trim() : undefined);
      navigate(next, { replace: true });
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-card">
        <p className="text-center font-display text-3xl font-extrabold text-primary">farmes</p>
        <h1 className="mt-4 text-center font-display text-2xl font-bold">{signup ? "Create account" : "Login"}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Enter your mobile number to continue.</p>

        <div className="mt-6 space-y-4">
          {signup ? (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </label>
          ) : null}
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile number</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+919876543210" className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </label>
          {otpSent ? (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">OTP</span>
              <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Enter OTP" className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </label>
          ) : null}
          {error ? <p className="rounded-md bg-destructive/5 p-3 text-sm font-semibold text-destructive">{error}</p> : null}
          <button onClick={otpSent ? verifyOtp : sendOtp} disabled={loading} className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">
            {loading ? "Please wait..." : otpSent ? "Verify & continue" : "Send OTP"}
          </button>
        </div>

        <Link to={signup ? `/login?next=${encodeURIComponent(next)}` : `/signup?next=${encodeURIComponent(next)}`} className="mt-4 block text-center text-sm font-bold text-primary">
          {signup ? "Already have an account? Login" : "New user? Sign up"}
        </Link>
      </div>
    </div>
  );
};

export default Login;
