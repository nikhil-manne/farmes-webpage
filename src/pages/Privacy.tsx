import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Lock, Eye, Database, Smartphone, Users } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  const points = [
    {
      icon: Smartphone,
      title: "Information We Collect",
      content: "We collect minimal information required to serve you: your name, mobile number for OTP authentication, and your delivery address. We do not store your credit card details; they are handled directly by Razorpay."
    },
    {
      icon: Database,
      title: "How We Use Data",
      content: "Your data is primarily used for order fulfillment and logistics optimization. We analyze aggregated, anonymous data to improve our delivery routes and forecasting for our farmers."
    },
    {
      icon: ShieldCheck,
      title: "Data Security",
      content: "We implement industry-standard security measures to protect your personal information. Your mobile number is used only for authentication and critical order updates."
    },
    {
      icon: Eye,
      title: "Third-Party Sharing",
      content: "We never sell your data. We only share necessary information with partners who help us operate: Razorpay (payments) and our logistics network (for finding your address)."
    },
    {
      icon: Users,
      title: "Your Rights",
      content: "You have the right to access, update, or request the deletion of your personal data at any time through your profile settings or by contacting our support team."
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      <header className="px-5 pt-8 lg:px-0 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border shadow-soft"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">Security</p>
          <h1 className="font-display text-2xl font-bold">Privacy Policy</h1>
        </div>
      </header>

      <div className="mx-5 mt-8 space-y-8 lg:mx-0 max-w-3xl">
        <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10">
          <div className="flex items-center gap-3 text-secondary mb-3">
            <Lock className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Your Privacy is Priority</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            At Farmes, we believe transparency is the foundation of trust. This policy explains how we handle your information with care and respect.
          </p>
        </div>

        {points.map((point, i) => (
          <section key={i} className="space-y-3">
            <div className="flex items-center gap-3 text-foreground">
              <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-secondary shadow-sm">
                <point.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-bold">{point.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {point.content}
            </p>
          </section>
        ))}

        <div className="pt-10 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Concerned about your data? Reach out to our privacy officer at <span className="font-bold text-secondary">privacy@farmes.in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
