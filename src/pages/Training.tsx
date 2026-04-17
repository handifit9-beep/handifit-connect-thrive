import { useNavigate } from "react-router-dom";
import { Play, Clock, Flame, Activity, Mic, Captions, Vibrate, Stethoscope, Mountain } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const sessions = [
  { id: 1, name: "Réveil énergique", duration: 12, kcal: 110, level: "Doux", icon: Activity },
  { id: 2, name: "Endurance Forêt", duration: 25, kcal: 280, level: "Modéré", icon: Mountain },
  { id: 3, name: "Intervalles éclair", duration: 18, kcal: 240, level: "Intense", icon: Flame },
  { id: 4, name: "Récupération active", duration: 15, kcal: 90, level: "Doux", icon: Activity },
];

const Training = () => {
  const navigate = useNavigate();
  return (
    <AppShell>
      <PageHeader subtitle="Entraînement" title="Choisissez votre séance" />

      <section className="px-5 mb-5">
        <div className="glass rounded-2xl p-4 flex items-center justify-around text-center">
          <div className="flex flex-col items-center gap-1" title="Guidage vocal actif">
            <Mic className="size-4 text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground">Vocal</span>
          </div>
          <div className="flex flex-col items-center gap-1" title="Sous-titres actifs">
            <Captions className="size-4 text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground">Sous-titres</span>
          </div>
          <div className="flex flex-col items-center gap-1" title="Haptiques actifs">
            <Vibrate className="size-4 text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground">Haptique</span>
          </div>
        </div>
      </section>

      <section className="px-5 grid gap-3 animate-fade-in">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate("/training/live")}
            className="glass rounded-2xl p-4 flex items-center gap-4 text-left min-h-[88px] transition-all hover:-translate-y-0.5 hover:ring-1 hover:ring-primary/40"
          >
            <div className="size-14 rounded-2xl bg-gradient-primary grid place-items-center shrink-0 shadow-glow">
              <s.icon className="size-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base">{s.name}</div>
              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="size-3" />{s.duration} min</span>
                <span className="inline-flex items-center gap-1"><Flame className="size-3" />{s.kcal} kcal</span>
                <span>{s.level}</span>
              </div>
            </div>
            <Play className="size-5 text-primary shrink-0" />
          </button>
        ))}

        <button
          onClick={() => navigate("/rehab")}
          className="glass rounded-2xl p-4 flex items-center gap-4 text-left min-h-[88px] bg-gradient-to-r from-accent/10 to-transparent hover:-translate-y-0.5 transition-transform"
        >
          <div className="size-14 rounded-2xl bg-accent grid place-items-center shrink-0">
            <Stethoscope className="size-6 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Mode Rééducation</div>
            <div className="text-xs text-muted-foreground mt-1">Programmes kinésithérapie · suivi médical</div>
          </div>
        </button>
      </section>
    </AppShell>
  );
};

export default Training;
