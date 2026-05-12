import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

const Login = ({ signup = false }: { signup?: boolean }) => {
  const [phone, setPhone] = useState("+91");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = useMemo(() => params.get("next") || "/", [params]);

  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  }, []);

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
      // First, check if the backend wants us to use mock mode (for Admins/Farmers)
      // This is a bit of a bypass: if the backend returns an 'otp' field, we use mock.
      const res = await api.sendOtp(trimmedPhone);
      
      if ((res as any).otp) {
        // MOCK MODE (Admin/Farmer)
        setOtpSent(true);
        setOtp((res as any).otp); // Auto-fill for convenience if desired, or let them type 123456
      } else {
        // REAL MODE (Regular User) - Use Firebase
        const verifier = (window as any).recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, trimmedPhone, verifier);
        setConfirmationResult(result);
        setOtpSent(true);
      }
    } catch (err: any) {
      setError(err.message || "Could not send OTP.");
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
      if (confirmationResult) {
        // Verify with Firebase
        const result = await confirmationResult.confirm(otp.trim());
        const idToken = await result.user.getIdToken();
        
        // Send idToken to backend
        await api.verifyOtp(phone.trim(), undefined, signup ? name.trim() : undefined, idToken);
      } else {
        // Mock Mode verification
        await api.verifyOtp(phone.trim(), otp.trim(), signup ? name.trim() : undefined);
      }
      navigate(next, { replace: true });
    } catch (err: any) {
      setError(err.message || "Verification failed. Please check the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-5 py-10">
      <div id="recaptcha-container"></div>
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
