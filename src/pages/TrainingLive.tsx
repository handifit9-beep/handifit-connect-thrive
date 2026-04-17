import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pause, Play, Square, Volume2, Captions, Vibrate, HeartPulse, Activity, Mic } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const captionsScript = [
  "Échauffement : pédalez doucement pendant 2 minutes.",
  "Bien. Augmentez légèrement la cadence.",
  "Respiration profonde. Inspirez, expirez.",
  "Excellent rythme. Maintenez l'effort.",
  "Plus que 30 secondes. Vous y êtes presque !",
  "Bravo. Récupération en cours.",
];

const TrainingLive = () => {
  const navigate = useNavigate();
  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [hr, setHr] = useState(112);
  const [captionIndex, setCaptionIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
      setHr((h) => Math.max(95, Math.min(165, h + Math.round((Math.random() - 0.45) * 4))));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => {
    const t = window.setInterval(() => setCaptionIndex((i) => (i + 1) % captionsScript.length), 4500);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const distance = (seconds * 0.0035).toFixed(2);
  const kcal = Math.round(seconds * 0.18);

  const finish = () => navigate("/training");

  return (
    <AppShell hideNav>
      <div className="min-h-dvh flex flex-col px-6 pt-10 pb-8 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden />

        <div className="relative flex items-center justify-between mb-6">
          <button
            onClick={finish}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            ← Quitter
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="size-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-muted-foreground font-semibold">EN DIRECT</span>
          </div>
        </div>

        {/* Pulse ring with timer */}
        <div className="relative grid place-items-center my-4">
          <div className="absolute size-72 rounded-full bg-gradient-primary opacity-20 blur-3xl animate-pulse-glow" aria-hidden />
          <div className="relative size-64 rounded-full glass-strong grid place-items-center border-2 border-primary/40 shadow-glow">
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-2">Temps</div>
              <div className="text-6xl font-display font-bold tabular-nums text-gradient">{mm}:{ss}</div>
              <div className="mt-3 text-xs text-muted-foreground">Endurance Forêt · Niveau 3</div>
            </div>
          </div>
        </div>

        {/* Live metrics */}
        <div className="grid grid-cols-3 gap-3 mt-2 animate-fade-in">
          <div className="glass rounded-2xl p-3 text-center">
            <Activity className="size-4 text-primary mx-auto mb-1" />
            <div className="text-lg font-display font-bold tabular-nums">{distance}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">km</div>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <HeartPulse className="size-4 text-destructive mx-auto mb-1" />
            <div className="text-lg font-display font-bold tabular-nums">{hr}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">bpm</div>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <span className="block text-xs mb-1 text-warning">🔥</span>
            <div className="text-lg font-display font-bold tabular-nums">{kcal}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">kcal</div>
          </div>
        </div>

        {/* Captions */}
        <div
          aria-live="polite"
          className="glass rounded-2xl p-5 mt-4 min-h-[80px] flex items-center gap-3"
        >
          <Captions className="size-5 text-primary shrink-0" />
          <p key={captionIndex} className="text-base font-semibold leading-snug animate-fade-in">
            {captionsScript[captionIndex]}
          </p>
        </div>

        {/* Voice waveform indicator */}
        <div className="flex items-center justify-center gap-1 mt-4 h-8" aria-hidden>
          <Mic className="size-4 text-primary mr-2" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-primary animate-wave"
              style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="mt-auto flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            size="icon"
            className="size-14 rounded-full"
            aria-label="Vibrations"
          >
            <Vibrate className="size-5" />
          </Button>
          <Button
            onClick={() => setRunning((r) => !r)}
            size="icon"
            className="size-20 rounded-full bg-gradient-primary hover:opacity-90 shadow-glow"
            aria-label={running ? "Pause" : "Reprendre"}
          >
            {running ? <Pause className="size-8 text-primary-foreground" /> : <Play className="size-8 text-primary-foreground" />}
          </Button>
          <Button
            onClick={finish}
            variant="outline"
            size="icon"
            className="size-14 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
            aria-label="Terminer la séance"
          >
            <Square className="size-5" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default TrainingLive;
