import { Trees, Mountain, Building2, Waves, Trophy, Star } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

const worlds = [
  { name: "Forêt nordique", desc: "Sons de la nature, oiseaux, ruisseau", icon: Trees, level: 1, grad: "from-emerald-500/40 via-cyan-500/20 to-transparent" },
  { name: "Sommets alpins", desc: "Cols mythiques, vent et altitude", icon: Mountain, level: 2, grad: "from-violet-500/40 via-cyan-500/20 to-transparent" },
  { name: "Ville futuriste", desc: "Néons, énergie urbaine, beat électro", icon: Building2, level: 3, grad: "from-fuchsia-500/40 via-primary/20 to-transparent" },
  { name: "Côte sauvage", desc: "Vagues, embruns, vol des mouettes", icon: Waves, level: 2, grad: "from-cyan-500/40 via-blue-500/20 to-transparent" },
];

const Immersive = () => {
  return (
    <AppShell>
      <PageHeader subtitle="Mode immersif" title="Évadez-vous en pédalant" />

      <section className="px-5 mb-6 animate-fade-in">
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Trophy className="size-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Défi de la semaine</p>
            <p className="text-xs text-muted-foreground">Parcourez 30 km en mode immersif · 18/30 km</p>
          </div>
          <div className="flex items-center gap-1 text-warning">
            <Star className="size-4 fill-current" />
            <span className="text-sm font-bold tabular-nums">+150</span>
          </div>
        </div>
        <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-700" style={{ width: "60%" }} />
        </div>
      </section>

      <section className="px-5 grid gap-4 animate-slide-up">
        {worlds.map((w) => (
          <button
            key={w.name}
            className={`relative overflow-hidden rounded-3xl p-6 text-left min-h-[140px] glass-strong transition-transform hover:-translate-y-1 bg-gradient-to-br ${w.grad}`}
          >
            <div className="absolute inset-0 bg-gradient-glow opacity-50" aria-hidden />
            <div className="relative flex flex-col h-full justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="size-14 rounded-2xl glass grid place-items-center">
                  <w.icon className="size-7 text-foreground" />
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star key={i} className={`size-3.5 ${i < w.level ? "fill-warning text-warning" : "text-muted"}`} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold">{w.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{w.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </section>
    </AppShell>
  );
};

export default Immersive;
