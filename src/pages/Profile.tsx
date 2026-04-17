import { Link } from "react-router-dom";
import { Settings, Bluetooth, Globe, Moon, Bell, ChevronRight, Mic, Captions, Vibrate, Eye, Sparkles, LogOut } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import AutonomyRing from "@/components/AutonomyRing";

const Profile = () => {
  return (
    <AppShell>
      <PageHeader subtitle="Profil" title="Votre espace" />

      <section className="px-5 mb-6 animate-fade-in">
        <div className="glass-strong rounded-3xl p-5 flex items-center gap-4">
          <div className="size-20 rounded-2xl bg-gradient-immersive grid place-items-center text-3xl font-display font-bold text-primary-foreground shadow-glow">
            E
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-display font-bold leading-tight">Elias Martin</p>
            <p className="text-xs text-muted-foreground">Niveau adaptatif · Intermédiaire</p>
            <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mt-1">Inscrit depuis mars</p>
          </div>
          <AutonomyRing score={84} size={64} />
        </div>
      </section>

      <section className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Objectifs sportifs</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Séances/sem.", value: "5" },
            { label: "Distance/sem.", value: "30 km" },
            { label: "Calories/jour", value: "350" },
          ].map((g) => (
            <div key={g.label} className="glass rounded-2xl p-4 text-center">
              <p className="text-xl font-display font-bold text-gradient">{g.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{g.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Accessibilité</h3>
        <div className="glass rounded-2xl divide-y divide-border/60">
          {[
            { to: "/settings", icon: Mic, label: "Guidage vocal", value: "Activé" },
            { to: "/settings", icon: Captions, label: "Sous-titres", value: "Grand contraste" },
            { to: "/settings", icon: Vibrate, label: "Vibrations", value: "Modérées" },
            { to: "/settings", icon: Eye, label: "Profil sensoriel", value: "Visuel + Auditif" },
          ].map(({ to, icon: Icon, label, value }) => (
            <Link key={label} to={to} className="flex items-center gap-3 p-4 min-h-[60px] hover:bg-muted/30 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
              <Icon className="size-5 text-primary shrink-0" />
              <span className="flex-1 font-medium text-sm">{label}</span>
              <span className="text-xs text-muted-foreground">{value}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Préférences</h3>
        <div className="glass rounded-2xl divide-y divide-border/60">
          {[
            { icon: Bluetooth, label: "Appareil HANDIFIT", value: "Connecté" },
            { icon: Globe, label: "Langue", value: "Français" },
            { icon: Bell, label: "Notifications", value: "Tous" },
            { icon: Moon, label: "Apparence", value: "Sombre" },
          ].map(({ icon: Icon, label, value }) => (
            <Link key={label} to="/settings" className="flex items-center gap-3 p-4 min-h-[60px] hover:bg-muted/30 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
              <Icon className="size-5 text-foreground shrink-0" />
              <span className="flex-1 font-medium text-sm">{label}</span>
              <span className="text-xs text-muted-foreground">{value}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 mb-6 grid gap-3">
        <Link to="/coach" className="glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
          <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center"><Mic className="size-5 text-primary-foreground" /></div>
          <span className="flex-1 font-semibold text-sm">Coach IA</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
        <Link to="/autonomy" className="glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
          <div className="size-10 rounded-xl bg-secondary/20 grid place-items-center"><Sparkles className="size-5 text-secondary" /></div>
          <span className="flex-1 font-semibold text-sm">Score d'autonomie</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </section>

      <section className="px-5 mb-6">
        <button className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 text-destructive font-semibold min-h-[52px]">
          <LogOut className="size-4" /> Se déconnecter
        </button>
      </section>
    </AppShell>
  );
};

export default Profile;
