import { Link, useNavigate } from "react-router-dom";
import { Bluetooth, Play, MapPin, Mountain, Trees, Activity, HeartPulse, Flame, Trophy, Mic, Stethoscope, Sparkles } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import AutonomyRing from "@/components/AutonomyRing";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const profile = (() => {
    try { return JSON.parse(localStorage.getItem("handifit:profile") || "{}"); } catch { return {}; }
  })();
  const name = "Elias";

  return (
    <AppShell>
      <PageHeader
        subtitle={`Bonjour, ${name}`}
        title="Prêt à vous dépasser ?"
        right={<AutonomyRing score={84} />}
      />

      {/* Bluetooth status */}
      <div className="px-5 mb-5 animate-fade-in">
        <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="relative">
            <Bluetooth className="size-5 text-primary" />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-success animate-pulse-glow" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">HANDIFIT Bike connecté</p>
            <p className="text-xs text-muted-foreground">Batterie 87 % · Signal excellent</p>
          </div>
          <Link to="/settings" className="text-xs text-primary font-semibold hover:underline focus-visible:underline">
            Gérer
          </Link>
        </div>
      </div>

      {/* Suggested workout */}
      <section className="px-5 mb-6 animate-slide-up">
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-immersive shadow-elevated">
          <div className="absolute -right-8 -bottom-8 size-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/80 mb-2">
              Séance du jour
            </p>
            <h2 className="text-2xl font-display font-bold text-primary-foreground mb-1">Endurance Forêt</h2>
            <p className="text-sm text-primary-foreground/85 mb-5">25 min · Cardio modéré · Niveau 3</p>
            <Button
              onClick={() => navigate("/training/live")}
              size="lg"
              className="rounded-full bg-background text-foreground hover:bg-background/90 font-semibold shadow-soft min-h-[52px]"
            >
              <Play className="size-5 mr-1 fill-current" />
              Démarrer rapidement
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Aujourd'hui</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={MapPin} value="4.2" unit="km" label="Distance" />
          <StatCard icon={Flame} value="312" unit="kcal" label="Calories" />
          <StatCard icon={HeartPulse} value="124" unit="bpm" label="Pouls" />
        </div>
      </section>

      {/* Immersive worlds */}
      <section className="px-5 mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Univers immersifs</h3>
          <Link to="/immersive" className="text-xs font-semibold text-primary hover:underline">Tout voir</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2 snap-x snap-mandatory">
          {[
            { icon: Trees, name: "Forêt nordique", level: "Doux", grad: "from-emerald-500/30 to-cyan-500/30" },
            { icon: Mountain, name: "Sommets alpins", level: "Intense", grad: "from-violet-500/30 to-cyan-500/30" },
            { icon: Activity, name: "Ville futuriste", level: "Modéré", grad: "from-cyan-500/30 to-fuchsia-500/30" },
          ].map(({ icon: Icon, name, level, grad }) => (
            <button
              key={name}
              onClick={() => navigate("/immersive")}
              className={`snap-start shrink-0 w-44 h-32 rounded-3xl glass p-4 flex flex-col justify-between text-left transition-transform hover:-translate-y-1 bg-gradient-to-br ${grad}`}
            >
              <Icon className="size-6 text-foreground" />
              <div>
                <p className="font-semibold leading-tight">{name}</p>
                <p className="text-xs text-muted-foreground">{level}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick access modules */}
      <section className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Modules</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: "/coach", icon: Mic, label: "Coach IA", color: "text-primary" },
            { to: "/rehab", icon: Stethoscope, label: "Rééducation", color: "text-accent" },
            { to: "/autonomy", icon: Sparkles, label: "Score Autonomie", color: "text-secondary" },
            { to: "/community", icon: Trophy, label: "Défis & Badges", color: "text-warning" },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link
              key={to}
              to={to}
              className="glass rounded-2xl p-4 flex items-center gap-3 min-h-[72px] transition-transform hover:-translate-y-0.5"
            >
              <div className="size-11 rounded-xl bg-muted/50 grid place-items-center shrink-0">
                <Icon className={`size-5 ${color}`} />
              </div>
              <span className="font-semibold text-sm leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

export default Dashboard;
