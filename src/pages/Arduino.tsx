import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Usb, Plug, Square, Activity, HeartPulse, Gauge, Zap, MapPin, Save, AlertTriangle, History } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { useArduinoSerial, type SensorReading } from "@/hooks/useArduinoSerial";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface PastSession {
  id: string;
  started_at: string;
  duration_seconds: number | null;
  total_distance_m: number | null;
  avg_bpm: number | null;
  avg_rpm: number | null;
}

const FLUSH_EVERY_MS = 2000;

const Arduino = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [readingsCount, setReadingsCount] = useState(0);
  const [history, setHistory] = useState<PastSession[]>([]);
  const bufferRef = useRef<SensorReading[]>([]);
  const aggRef = useRef({
    bpmSum: 0, bpmCount: 0, maxBpm: 0,
    rpmSum: 0, rpmCount: 0,
    forceSum: 0, forceCount: 0,
    lastDistance: 0,
    startedAt: 0,
  });

  const handleReading = useCallback((r: SensorReading) => {
    if (!recording || !sessionId) return;
    bufferRef.current.push(r);
    const a = aggRef.current;
    if (r.bpm !== undefined) { a.bpmSum += r.bpm; a.bpmCount++; if (r.bpm > a.maxBpm) a.maxBpm = r.bpm; }
    if (r.rpm !== undefined) { a.rpmSum += r.rpm; a.rpmCount++; }
    if (r.force_n !== undefined) { a.forceSum += r.force_n; a.forceCount++; }
    if (r.distance_m !== undefined) a.lastDistance = r.distance_m;
  }, [recording, sessionId]);

  const { supported, connected, error, latest, connect, disconnect } = useArduinoSerial({
    baudRate: 9600,
    onReading: handleReading,
  });

  const loadHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("sessions")
      .select("id, started_at, duration_seconds, total_distance_m, avg_bpm, avg_rpm")
      .order("started_at", { ascending: false })
      .limit(5);
    if (data) setHistory(data as PastSession[]);
  }, [user]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // Periodic flush of buffered readings to DB
  useEffect(() => {
    if (!recording || !sessionId || !user) return;
    const id = setInterval(async () => {
      const batch = bufferRef.current.splice(0, bufferRef.current.length);
      if (batch.length === 0) return;
      const rows = batch.map((r) => ({
        session_id: sessionId,
        user_id: user.id,
        recorded_at: new Date(r.timestamp).toISOString(),
        rpm: r.rpm ?? null,
        bpm: r.bpm ?? null,
        speed_kmh: r.speed_kmh ?? null,
        distance_m: r.distance_m ?? null,
        force_n: r.force_n ?? null,
        raw: r.raw ?? null,
      }));
      const { error: insErr } = await supabase.from("sensor_readings").insert(rows);
      if (insErr) console.error("flush error", insErr);
      else setReadingsCount((c) => c + batch.length);
    }, FLUSH_EVERY_MS);
    return () => clearInterval(id);
  }, [recording, sessionId, user]);

  const startSession = async () => {
    if (!user) { toast({ title: "Veuillez vous connecter", variant: "destructive" }); return; }
    if (!connected) { toast({ title: "Connectez d'abord l'Arduino", variant: "destructive" }); return; }
    const { data, error: insErr } = await supabase
      .from("sessions")
      .insert({ user_id: user.id, started_at: new Date().toISOString() })
      .select("id")
      .single();
    if (insErr || !data) {
      toast({ title: "Erreur démarrage session", description: insErr?.message, variant: "destructive" });
      return;
    }
    aggRef.current = { bpmSum: 0, bpmCount: 0, maxBpm: 0, rpmSum: 0, rpmCount: 0, forceSum: 0, forceCount: 0, lastDistance: 0, startedAt: Date.now() };
    bufferRef.current = [];
    setReadingsCount(0);
    setSessionId(data.id);
    setRecording(true);
    toast({ title: "Enregistrement démarré" });
  };

  const stopSession = async () => {
    if (!sessionId) return;
    setRecording(false);
    // flush remaining
    const batch = bufferRef.current.splice(0, bufferRef.current.length);
    if (batch.length > 0 && user) {
      await supabase.from("sensor_readings").insert(batch.map((r) => ({
        session_id: sessionId, user_id: user.id,
        recorded_at: new Date(r.timestamp).toISOString(),
        rpm: r.rpm ?? null, bpm: r.bpm ?? null, speed_kmh: r.speed_kmh ?? null,
        distance_m: r.distance_m ?? null, force_n: r.force_n ?? null, raw: r.raw ?? null,
      })));
    }
    const a = aggRef.current;
    const duration = Math.round((Date.now() - a.startedAt) / 1000);
    await supabase.from("sessions").update({
      ended_at: new Date().toISOString(),
      duration_seconds: duration,
      total_distance_m: a.lastDistance || 0,
      avg_bpm: a.bpmCount ? a.bpmSum / a.bpmCount : null,
      max_bpm: a.maxBpm || null,
      avg_rpm: a.rpmCount ? a.rpmSum / a.rpmCount : null,
      avg_force: a.forceCount ? a.forceSum / a.forceCount : null,
    }).eq("id", sessionId);
    toast({ title: "Session enregistrée", description: `${readingsCount} lectures · ${duration}s` });
    setSessionId(null);
    loadHistory();
  };

  const live = useMemo(() => ({
    rpm: latest?.rpm?.toFixed(0) ?? "—",
    bpm: latest?.bpm?.toFixed(0) ?? "—",
    speed: latest?.speed_kmh?.toFixed(1) ?? "—",
    distance: latest?.distance_m !== undefined ? (latest.distance_m / 1000).toFixed(2) : "—",
    force: latest?.force_n?.toFixed(0) ?? "—",
  }), [latest]);

  return (
    <AppShell>
      <PageHeader subtitle="Capteurs HANDIFIT" title="Connexion Arduino" />

      {/* Connection card */}
      <section className="px-5 mb-5">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`size-10 rounded-xl grid place-items-center ${connected ? "bg-success/20" : "bg-muted/50"}`}>
              <Usb className={`size-5 ${connected ? "text-success" : "text-muted-foreground"}`} />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{connected ? "Arduino connecté" : "Arduino déconnecté"}</p>
              <p className="text-xs text-muted-foreground">USB Série · 9600 bauds</p>
            </div>
          </div>

          {!supported && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/10 text-warning-foreground mb-3">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <p className="text-xs">Web Serial n'est disponible que sur Chrome/Edge desktop. Sur mobile, branchez un ordinateur.</p>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 text-destructive mb-3">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            {!connected ? (
              <Button onClick={connect} disabled={!supported} className="flex-1 min-h-[48px]">
                <Plug className="size-4 mr-2" /> Connecter
              </Button>
            ) : (
              <Button onClick={disconnect} variant="outline" className="flex-1 min-h-[48px]">
                <Square className="size-4 mr-2" /> Déconnecter
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Live data */}
      <section className="px-5 mb-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Données en direct</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Gauge} value={live.rpm} unit="rpm" label="Cadence" />
          <StatCard icon={HeartPulse} value={live.bpm} unit="bpm" label="Pouls" />
          <StatCard icon={Activity} value={live.speed} unit="km/h" label="Vitesse" />
          <StatCard icon={MapPin} value={live.distance} unit="km" label="Distance" />
          <StatCard icon={Zap} value={live.force} unit="N" label="Force" />
          <StatCard icon={Save} value={String(readingsCount)} unit="" label="Enregistrées" />
        </div>
      </section>

      {/* Recording controls */}
      <section className="px-5 mb-6">
        {!recording ? (
          <Button onClick={startSession} disabled={!connected} size="lg" className="w-full min-h-[56px] rounded-2xl">
            <Save className="size-5 mr-2" /> Démarrer l'enregistrement
          </Button>
        ) : (
          <Button onClick={stopSession} variant="destructive" size="lg" className="w-full min-h-[56px] rounded-2xl">
            <Square className="size-5 mr-2" /> Arrêter & sauvegarder
          </Button>
        )}
      </section>

      {/* History */}
      <section className="px-5 mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <History className="size-4" /> Sessions récentes
          </h3>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune session enregistrée.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((s) => (
              <li key={s.id} className="glass rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{new Date(s.started_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.duration_seconds ?? 0}s · {((s.total_distance_m ?? 0) / 1000).toFixed(2)} km
                    {s.avg_bpm ? ` · ${Math.round(s.avg_bpm)} bpm` : ""}
                    {s.avg_rpm ? ` · ${Math.round(s.avg_rpm)} rpm` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Help */}
      <section className="px-5 mb-8">
        <details className="glass rounded-2xl p-4">
          <summary className="text-sm font-semibold cursor-pointer">Format attendu côté Arduino</summary>
          <div className="mt-3 text-xs text-muted-foreground space-y-2">
            <p>Envoyez une ligne par mesure via <code>Serial.println()</code> au format JSON :</p>
            <pre className="p-2 rounded bg-muted/50 overflow-x-auto text-foreground">{`{"rpm":80,"bpm":120,"speed":15.2,"distance":250,"force":40}`}</pre>
            <p>ou en clé=valeur :</p>
            <pre className="p-2 rounded bg-muted/50 overflow-x-auto text-foreground">rpm=80,bpm=120,speed=15.2,distance=250,force=40</pre>
            <p>Baud rate : <strong>9600</strong>. Une mesure toutes les 200–500 ms est recommandée.</p>
          </div>
        </details>
      </section>
    </AppShell>
  );
};

export default Arduino;
