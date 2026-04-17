import { NavLink } from "react-router-dom";
import { Home, Activity, HeartPulse, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Accueil", icon: Home, end: true },
  { to: "/training", label: "Entraînement", icon: Activity },
  { to: "/health", label: "Santé", icon: HeartPulse },
  { to: "/community", label: "Communauté", icon: Users },
  { to: "/profile", label: "Profil", icon: User },
];

const BottomNav = () => {
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-3 pb-3 pt-2"
    >
      <div className="glass-strong rounded-3xl px-2 py-2 shadow-elevated">
        <ul className="grid grid-cols-5 gap-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                aria-label={label}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl min-h-[56px] transition-all duration-300",
                    "focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )
                }
              >
                <Icon className="size-5" aria-hidden />
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;
