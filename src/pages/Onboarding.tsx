import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Ear, Sparkles, Volume2, Captions, Vibrate, ChevronRight, Check } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Disability = "visual" | "hearing" | "both" | null;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [disability, setDisability] = useState<Disability>(null);
  const [prefs, setPrefs] = useState({ voice: true, captions: true, haptics: true });

  const finish = () => {
    localStorage.setItem("handifit:onboarded", "1");
    localStorage.setItem("handifit:profile", JSON.stringify({ disability, prefs }));
    navigate("/");
  };

  return (
    <AppShell hideNav>
      <div className="px-6 pt-12 pb-8 min-h-dvh flex flex-col">
        <div className="flex items-center gap-2 mb-10 animate-fade-in">
          <div className="size-10 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">HANDIFIT</p>
            <p className="text-xs text-muted-foreground">Sport inclusif & intelligent</p>
          </div>
        </div>

        <div className="flex gap-1.5 mb-8" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={3}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i <= step ? "bg-gradient-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="flex-1 flex flex-col animate-slide-up">
            <h1 className="text-4xl font-display font-bold mb-3 text-balance">
              Bienvenue dans <span className="text-gradient">HANDIFIT</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Le sport intelligent, accessible et inclusif. Connecté à votre vélo elliptique HANDIFIT.
            </p>
            <div className="grid gap-3 mb-auto">
              {[
                { icon: Volume2, label: "Coach vocal intelligent" },
                { icon: Captions, label: "Sous-titres en temps réel" },
                { icon: Vibrate, label: "Retours haptiques" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="glass rounded-2xl p-4 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 grid place-items-center">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col animate-slide-up">
            <h1 className="text-3xl font-display font-bold mb-2 text-balance">Personnalisons votre expérience</h1>
            <p className="text-muted-foreground mb-8">Sélectionnez ce qui vous correspond. Vous pourrez modifier à tout moment.</p>
            <div className="grid gap-3">
              {([
                { id: "visual", icon: Eye, label: "Malvoyant·e ou aveugle", desc: "Guidage vocal prioritaire" },
                { id: "hearing", icon: Ear, label: "Malentendant·e ou sourd·e", desc: "Sous-titres et signaux visuels" },
                { id: "both", icon: Sparkles, label: "Les deux", desc: "Expérience multimodale complète" },
              ] as const).map(({ id, icon: Icon, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setDisability(id)}
                  aria-pressed={disability === id}
                  className={cn(
                    "text-left glass rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 min-h-[72px]",
                    disability === id ? "ring-2 ring-primary glow-primary" : "hover:bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "size-12 rounded-2xl grid place-items-center shrink-0 transition-colors",
                    disability === id ? "bg-gradient-primary" : "bg-muted"
                  )}>
                    <Icon className={cn("size-6", disability === id ? "text-primary-foreground" : "text-foreground")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </div>
                  {disability === id && <Check className="size-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col animate-slide-up">
            <h1 className="text-3xl font-display font-bold mb-2 text-balance">Préférences d'assistance</h1>
            <p className="text-muted-foreground mb-8">Activez ce dont vous avez besoin pendant vos séances.</p>
            <div className="grid gap-3">
              {([
                { key: "voice", icon: Volume2, label: "Guidage vocal", desc: "Le coach vous parle pendant l'effort" },
                { key: "captions", icon: Captions, label: "Sous-titres", desc: "Affichage en gros caractères, contraste élevé" },
                { key: "haptics", icon: Vibrate, label: "Vibrations", desc: "Alertes haptiques de progression et sécurité" },
              ] as const).map(({ key, icon: Icon, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                  aria-pressed={prefs[key]}
                  className={cn(
                    "text-left glass rounded-2xl p-5 flex items-center gap-4 transition-all min-h-[72px]",
                    prefs[key] && "ring-1 ring-primary/50"
                  )}
                >
                  <div className={cn(
                    "size-12 rounded-2xl grid place-items-center shrink-0 transition-colors",
                    prefs[key] ? "bg-gradient-primary" : "bg-muted"
                  )}>
                    <Icon className={cn("size-6", prefs[key] ? "text-primary-foreground" : "text-muted-foreground")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </div>
                  <div className={cn(
                    "w-12 h-7 rounded-full p-1 transition-colors shrink-0",
                    prefs[key] ? "bg-primary" : "bg-muted"
                  )}>
                    <div className={cn(
                      "size-5 rounded-full bg-background transition-transform",
                      prefs[key] && "translate-x-5"
                    )} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep(step - 1)} className="rounded-full min-h-[56px] flex-1">
              Retour
            </Button>
          )}
          <Button
            size="lg"
            onClick={() => (step < 2 ? setStep(step + 1) : finish())}
            disabled={step === 1 && !disability}
            className="rounded-full min-h-[56px] flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow font-semibold text-base"
          >
            {step < 2 ? "Continuer" : "Commencer"}
            <ChevronRight className="size-5 ml-1" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default Onboarding;
