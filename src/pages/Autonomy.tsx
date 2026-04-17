import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, TrendingUp, Check } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import AppShell from "@/components/AppShell";
import AutonomyRing from "@/components/AutonomyRing";

const evolution = [
  { m: "Nov", score: 52 },
  { m: "Déc", score: 58 },
  { m: "Jan", score: 65 },
  { m: "Fév", score: 71 },
  { m: "Mar", score: 78 },
  { m: "Avr", score: 84 },
];

const criteria = [
  { label: "Utilisation sans assistance", score: 92, status: "Excellent" },
  { label: "Réactivité aux instructions", score: 88, status: "Très bon" },
  { label: "Régularité des performances", score: 78, status: "Bon" },
  { label: "Adaptation à l'effort", score: 80, status: "Bon" },
];

const Autonomy = () => {
  const navigate = useNavigate();
  return (
    <AppShell hideNav>
      <header className="px-5 pt-8 pb-4 flex items-center gap-3 animate-fade-in">
        <button onClick={() => navigate(-1)} className="size-10 rounded-full glass grid place-items-center" aria-label="Retour">
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Score d'autonomie</p>
          <h1 className="text-xl font-display font-bold">Votre indépendance</h1>
        </div>
      </header>

      <section className="px-5 mb-6 animate-scale-in">
        <div className="glass-strong rounded-3xl p-6 text-center bg-gradient-to-br from-secondary/15 via-primary/5 to-transparent">
          <div className="flex justify-center mb-4">
            <AutonomyRing score={84} size={160} />
          </div>
          <p className="text-sm text-muted-foreground mb-2">Niveau actuel</p>
          <p className="text-2xl font-display font-bold text-gradient mb-3">Très autonome</p>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full">
            <TrendingUp className="size-3.5" />
            +6 points ce mois
          </div>
        </div>
      </section>

      <section className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Évolution</h3>
        <div className="glass rounded-2xl p-4">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolution}>
                <defs>
                  <linearGradient id="autoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis hide domain={[40, 100]} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--secondary))" strokeWidth={2.5} fill="url(#autoGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Critères évalués</h3>
        <div className="grid gap-3">
          {criteria.map((c) => (
            <div key={c.label} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">{c.label}</p>
                <span className="text-xs font-bold tabular-nums">{c.score}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-primary rounded-full transition-all duration-700" style={{ width: `${c.score}%` }} />
              </div>
              <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Check className="size-3 text-success" /> {c.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="glass rounded-2xl p-5 flex gap-3 items-start bg-gradient-to-br from-primary/10 to-transparent">
          <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-1">Recommandation IA</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vous progressez régulièrement. Le système augmente progressivement la difficulté de vos séances pour soutenir votre indépendance.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Autonomy;
