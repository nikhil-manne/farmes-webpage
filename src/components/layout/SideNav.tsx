import { NavLink } from "react-router-dom";
import { Home, Store, ShoppingBag, Package, User, Leaf } from "lucide-react";
import { useCart } from "@/store/cart";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/market", label: "Market", icon: Store },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/profile", label: "Profile", icon: User },
];

export const SideNav = () => {
  const items = useCart((s) => s.items);
  const count = items.reduce((a, i) => a + i.qty, 0);

  return (
    <aside className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col border-r border-border/60 bg-background px-5 py-8">
      <div className="mb-10">
        <h1 className="font-display text-2xl font-bold leading-tight">
          farm<span className="text-primary">es</span>
        </h1>
        <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-secondary">
          <Leaf className="h-3 w-3" /> fresh today
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <span className="relative">
              <Icon className="h-[20px] w-[20px]" strokeWidth={2} />
              {to === "/cart" && count > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <p className="text-[11px] text-muted-foreground">Farmes. Farm to home.</p>
    </aside>
  );
};
