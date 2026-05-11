import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, ShieldAlert, Scale, Clock, CreditCard, Truck } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Scale,
      title: "1. Acceptance of Terms",
      content: "By accessing and using the Farmes platform, you agree to be bound by these Terms and Conditions. Our platform is a logistics-driven agricultural network connecting consumers directly to farmers. If you do not agree with any part of these terms, please do not use the service."
    },
    {
      icon: Clock,
      title: "2. Ordering & Cutoff Times",
      content: "Farmes operates on a scheduled delivery model (currently Tuesdays and Fridays). Your cart will be automatically converted into an order at the scheduled cutoff time if you have enabled Auto-checkout. Orders once placed are final as they trigger the dawn harvest process specifically for you."
    },
    {
      icon: CreditCard,
      title: "3. Payments & Pricing",
      content: "All payments are processed securely through Razorpay. Prices are inclusive of GST where applicable. Since agricultural produce weights can vary slightly, we aim for the closest possible weight to your selection. Refunds for missing or damaged items will be processed to the original payment method."
    },
    {
      icon: Truck,
      title: "4. Delivery Policy",
      content: "We deliver directly from the farm to your doorstep. It is the customer's responsibility to be available at the delivery address during the delivery window. Due to the perishable nature of the produce, we cannot be held responsible for items left unattended after a successful delivery."
    },
    {
      icon: ShieldAlert,
      title: "5. Freshness Guarantee",
      content: "We guarantee that produce is harvested within 12 hours of delivery. If you receive items that do not meet freshness standards, please report it within 4 hours of delivery with photos for a full refund or replacement."
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">Legal</p>
          <h1 className="font-display text-2xl font-bold">Terms & Conditions</h1>
        </div>
      </header>

      <div className="mx-5 mt-8 space-y-8 lg:mx-0 max-w-3xl">
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-3 text-primary mb-3">
            <FileText className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Last Updated: May 2026</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Please read these terms carefully. They contain important information about your legal rights, remedies, and obligations.
          </p>
        </div>

        {sections.map((section, i) => (
          <section key={i} className="space-y-3">
            <div className="flex items-center gap-3 text-foreground">
              <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                <section.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-bold">{section.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-13">
              {section.content}
            </p>
          </section>
        ))}

        <div className="pt-10 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Questions about our terms? Contact us at <span className="font-bold text-primary">support@farmes.in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
