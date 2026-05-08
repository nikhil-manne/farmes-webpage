import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Package, User } from "lucide-react";
import { useCart } from "@/store/cart";

const tabs = [
  { to: "/", label: "Shop", icon: Home, end: true },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/profile", label: "Profile", icon: User },
];

export const BottomNav = () => {
  const items = useCart((s) => s.items);
  const count = items.reduce((a, i) => a + i.qty, 0);

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border/60 bg-background/90 backdrop-blur-xl md:max-w-[720px] lg:hidden">
      <ul className="grid grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <span className="relative">
                <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
                {to === "/cart" && count > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {count}
                  </span>
                )}
              </span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
