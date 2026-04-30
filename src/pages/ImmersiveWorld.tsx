import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Pause, Play, Gauge } from "lucide-react";
import ImmersiveScene, { type WorldId } from "@/components/ImmersiveScene";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const WORLD_LABELS: Record<WorldId, string> = {
  forest: "Forêt nordique",
  alps: "Sommets alpins",
  city: "Ville futuriste",
  coast: "Côte sauvage",
};

const ImmersiveWorld = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const world = (params.get("w") as WorldId) || "forest";
  const [speed, setSpeed] = useState([0.35]);
  const [paused, setPaused] = useState(false);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <ImmersiveScene world={world} speed={paused ? 0 : speed[0]} />

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10">
        <button
          onClick={() => navigate("/immersive")}
          className="size-10 rounded-full glass grid place-items-center hover:bg-white/20 transition"
          aria-label="Retour"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="glass rounded-full px-4 py-2">
          <p className="text-sm font-display font-bold">{WORLD_LABELS[world]}</p>
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className="size-10 rounded-full glass grid place-items-center hover:bg-white/20 transition"
          aria-label={paused ? "Reprendre" : "Pause"}
        >
          {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
        </button>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-0 inset-x-0 p-5 z-10">
        <div className="glass rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center">
                <Gauge className="size-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Intensité</p>
                <p className="text-lg font-display font-bold tabular-nums">
                  {Math.round(speed[0] * 100)}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Vitesse simulée</p>
              <p className="text-lg font-display font-bold tabular-nums">
                {(speed[0] * 45).toFixed(1)} km/h
              </p>
            </div>
          </div>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            min={0}
            max={1}
            step={0.01}
            disabled={paused}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setSpeed([Math.max(0, speed[0] - 0.1)])}
            >
              −
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => setSpeed([Math.min(1, speed[0] + 0.1)])}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveWorld;
