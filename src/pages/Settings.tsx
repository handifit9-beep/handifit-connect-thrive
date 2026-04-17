import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bluetooth, Globe, Bell, Mic, Captions, Vibrate, Eye, Moon, ChevronRight } from "lucide-react";
import AppShell from "@/components/AppShell";

const Settings = () => {
  const navigate = useNavigate();
  const groups = [
    {
      title: "Accessibilité",
      items: [
        { icon: Mic, label: "Guidage vocal", value: "Activé" },
        { icon: Captions, label: "Sous-titres", value: "Grand contraste" },
        { icon: Vibrate, label: "Retours haptiques", value: "Modérés" },
        { icon: Eye, label: "Profil sensoriel", value: "Visuel + Auditif" },
      ],
    },
    {
      title: "Appareil",
      items: [
        { icon: Bluetooth, label: "HANDIFIT Bike", value: "Connecté" },
      ],
    },
    {
      title: "Application",
      items: [
        { icon: Globe, label: "Langue", value: "Français" },
        { icon: Bell, label: "Notifications", value: "Toutes" },
        { icon: Moon, label: "Apparence", value: "Sombre" },
      ],
    },
  ];

  return (
    <AppShell hideNav>
      <header className="px-5 pt-8 pb-4 flex items-center gap-3 animate-fade-in">
        <button onClick={() => navigate(-1)} className="size-10 rounded-full glass grid place-items-center" aria-label="Retour">
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Réglages</p>
          <h1 className="text-xl font-display font-bold">Paramètres</h1>
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {groups.map((g) => (
          <section key={g.title}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{g.title}</h3>
            <div className="glass rounded-2xl divide-y divide-border/60">
              {g.items.map(({ icon: Icon, label, value }) => (
                <button key={label} className="w-full flex items-center gap-3 p-4 min-h-[60px] hover:bg-muted/30 first:rounded-t-2xl last:rounded-b-2xl transition-colors text-left">
                  <Icon className="size-5 text-primary shrink-0" />
                  <span className="flex-1 font-medium text-sm">{label}</span>
                  <span className="text-xs text-muted-foreground">{value}</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
};

export default Settings;
