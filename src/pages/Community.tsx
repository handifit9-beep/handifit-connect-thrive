import { Trophy, Flame, Users, Star, Share2, Award } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const challenges = [
  { name: "30 km en immersif", progress: 60, reward: "Badge Explorateur", participants: 1284 },
  { name: "5 séances cette semaine", progress: 80, reward: "+200 pts", participants: 845 },
  { name: "Défi inclusif", progress: 35, reward: "Médaille Or", participants: 2150 },
];

const badges = [
  { name: "Premier pas", earned: true, icon: "🎯" },
  { name: "Régularité 7j", earned: true, icon: "🔥" },
  { name: "Marathon", earned: false, icon: "🏃" },
  { name: "Explorateur", earned: true, icon: "🌲" },
  { name: "Champion", earned: false, icon: "🏆" },
  { name: "Inclusion", earned: true, icon: "💙" },
];

const Community = () => {
  return (
    <AppShell>
      <PageHeader subtitle="Communauté" title="Avancez ensemble" />

      <section className="px-5 mb-6 animate-fade-in">
        <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-immersive shadow-elevated">
          <div className="absolute -right-4 -top-4 size-32 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="relative flex items-center gap-4">
            <div className="size-16 rounded-2xl glass-strong grid place-items-center">
              <Trophy className="size-8 text-primary-foreground" />
            </div>
            <div className="flex-1 text-primary-foreground">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Votre rang</p>
              <p className="text-2xl font-display font-bold">#127 mondial</p>
              <p className="text-xs opacity-90">2 480 points · top 8 %</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Défis actifs</h3>
        <div className="grid gap-3">
          {challenges.map((c) => (
            <div key={c.name} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                    <Users className="size-3" /> {c.participants.toLocaleString("fr-FR")} participants
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded-full">
                  <Star className="size-3 fill-current" />{c.reward}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full transition-all duration-700" style={{ width: `${c.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2 tabular-nums">{c.progress}%</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Badges</h3>
          <span className="text-xs text-muted-foreground tabular-nums">3/6</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`glass rounded-2xl p-3 text-center transition-all ${b.earned ? "ring-1 ring-primary/40" : "opacity-50"}`}
            >
              <div className={`text-3xl mb-1 ${!b.earned && "grayscale"}`}>{b.icon}</div>
              <p className="text-[11px] font-semibold leading-tight">{b.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mb-6">
        <Button variant="outline" size="lg" className="w-full rounded-full min-h-[52px]">
          <Share2 className="size-4 mr-2" />
          Partager mes progrès
        </Button>
      </section>
    </AppShell>
  );
};

export default Community;
