import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { HeartPulse, Flame, MapPin, Activity, TrendingUp } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

const weekData = [
  { day: "L", min: 18, hr: 118 },
  { day: "M", min: 25, hr: 124 },
  { day: "M", min: 0, hr: 0 },
  { day: "J", min: 22, hr: 121 },
  { day: "V", min: 30, hr: 128 },
  { day: "S", min: 15, hr: 110 },
  { day: "D", min: 28, hr: 126 },
];

const history = [
  { name: "Endurance Forêt", date: "Aujourd'hui · 09:14", duration: 25, kcal: 280 },
  { name: "Réveil énergique", date: "Hier · 07:30", duration: 12, kcal: 110 },
  { name: "Intervalles éclair", date: "Lun · 18:42", duration: 18, kcal: 240 },
];

const Health = () => {
  return (
    <AppShell>
      <PageHeader subtitle="Santé" title="Vos performances" />

      <section className="px-5 grid grid-cols-2 gap-3 mb-5 animate-fade-in">
        <StatCard icon={MapPin} value="22.4" unit="km" label="Cette semaine" />
        <StatCard icon={Flame} value="1 480" unit="kcal" label="Cette semaine" />
        <StatCard icon={HeartPulse} value="121" unit="bpm" label="FC moyenne" />
        <StatCard icon={Activity} value="138" unit="min" label="Temps actif" />
      </section>

      <section className="px-5 mb-6">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Activité de la semaine</h3>
            <span className="inline-flex items-center gap-1 text-xs text-success font-semibold">
              <TrendingUp className="size-3.5" /> +12 %
            </span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area type="monotone" dataKey="min" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#actGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="px-5 mb-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Fréquence cardiaque</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData.filter(d => d.hr > 0)}>
                <XAxis dataKey="day" hide />
                <YAxis hide domain={[80, 160]} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                />
                <Line type="monotone" dataKey="hr" stroke="hsl(var(--destructive))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--destructive))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Historique</h3>
        <div className="grid gap-3">
          {history.map((h) => (
            <div key={h.name + h.date} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 grid place-items-center">
                <Activity className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{h.name}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums">{h.duration} min</p>
                <p className="text-xs text-muted-foreground tabular-nums">{h.kcal} kcal</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

export default Health;
