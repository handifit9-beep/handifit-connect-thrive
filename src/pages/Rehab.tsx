import { useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, FileText, User, Calendar, TrendingUp, Heart, Activity } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";

const programs = [
  { name: "Reprise post-opératoire", week: "Semaine 3/8", progress: 38, intensity: "Très doux" },
  { name: "Renforcement membres inférieurs", week: "Semaine 1/4", progress: 12, intensity: "Doux" },
  { name: "Cardio supervisé", week: "Semaine 5/6", progress: 80, intensity: "Modéré" },
];

const Rehab = () => {
  const navigate = useNavigate();
  return (
    <AppShell hideNav>
      <header className="px-5 pt-8 pb-4 flex items-center gap-3 animate-fade-in">
        <button onClick={() => navigate(-1)} className="size-10 rounded-full glass grid place-items-center" aria-label="Retour">
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Mode rééducation</p>
          <h1 className="text-xl font-display font-bold">Programme médical</h1>
        </div>
      </header>

      <section className="px-5 mb-5 animate-fade-in">
        <div className="glass-strong rounded-3xl p-5 bg-gradient-to-br from-accent/15 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-2xl bg-accent grid place-items-center">
              <Stethoscope className="size-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">Dr. Camille Lefèvre</p>
              <p className="text-xs text-muted-foreground">Kinésithérapeute · Suivi actif</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="glass rounded-xl p-2">
              <p className="text-lg font-display font-bold">12</p>
              <p className="text-[10px] text-muted-foreground">Séances</p>
            </div>
            <div className="glass rounded-xl p-2">
              <p className="text-lg font-display font-bold text-success">+18%</p>
              <p className="text-[10px] text-muted-foreground">Progression</p>
            </div>
            <div className="glass rounded-xl p-2">
              <p className="text-lg font-display font-bold">3</p>
              <p className="text-[10px] text-muted-foreground">Programmes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 mb-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Programmes prescrits</h3>
        <div className="grid gap-3">
          {programs.map((p) => (
            <div key={p.name} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.week} · {p.intensity}</p>
                </div>
                <span className="text-xs font-bold text-accent tabular-nums shrink-0">{p.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mb-5 grid grid-cols-2 gap-3">
        <button className="glass rounded-2xl p-4 text-left hover:-translate-y-0.5 transition-transform">
          <FileText className="size-5 text-accent mb-2" />
          <p className="font-semibold text-sm">Rapport médical</p>
          <p className="text-xs text-muted-foreground">PDF · Dernier 12 avr</p>
        </button>
        <button className="glass rounded-2xl p-4 text-left hover:-translate-y-0.5 transition-transform">
          <Calendar className="size-5 text-accent mb-2" />
          <p className="font-semibold text-sm">Prochain RDV</p>
          <p className="text-xs text-muted-foreground">Mar 23 · 14h00</p>
        </button>
        <button className="glass rounded-2xl p-4 text-left hover:-translate-y-0.5 transition-transform">
          <Heart className="size-5 text-destructive mb-2" />
          <p className="font-semibold text-sm">Constantes</p>
          <p className="text-xs text-muted-foreground">FC, tension, SpO₂</p>
        </button>
        <button className="glass rounded-2xl p-4 text-left hover:-translate-y-0.5 transition-transform">
          <User className="size-5 text-foreground mb-2" />
          <p className="font-semibold text-sm">Équipe soignante</p>
          <p className="text-xs text-muted-foreground">3 membres</p>
        </button>
      </section>

      <section className="px-5 pb-8">
        <Button size="lg" className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 min-h-[56px] font-semibold">
          <Activity className="size-5 mr-2" />
          Démarrer la séance prescrite
        </Button>
      </section>
    </AppShell>
  );
};

export default Rehab;
