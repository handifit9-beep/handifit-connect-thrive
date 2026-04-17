import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Volume2, Sparkles, Globe, Send, ArrowLeft } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";

interface Msg { role: "coach" | "user"; text: string; }

const presets = [
  "Guide-moi pour démarrer",
  "Adapte la séance à mon rythme",
  "Comment progresser cette semaine ?",
  "Active la séance immersive forêt",
];

const initial: Msg[] = [
  { role: "coach", text: "Bonjour Elias 👋 Je suis votre coach HANDIFIT. Comment vous sentez-vous aujourd'hui ?" },
];

const Coach = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text };
    const reply: Msg = { role: "coach", text: "C'est noté. Je prépare une séance personnalisée selon votre fréquence cardiaque et vos derniers résultats. Activez le guidage vocal quand vous êtes prêt·e." };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  };

  return (
    <AppShell hideNav>
      <div className="min-h-dvh flex flex-col">
        <header className="px-5 pt-8 pb-4 flex items-center gap-3 animate-fade-in">
          <button onClick={() => navigate(-1)} className="size-10 rounded-full glass grid place-items-center" aria-label="Retour">
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Coach IA</p>
            <h1 className="text-xl font-display font-bold">Assistant intelligent</h1>
          </div>
          <button className="size-10 rounded-full glass grid place-items-center" aria-label="Langue">
            <Globe className="size-4" />
          </button>
        </header>

        <div className="px-5 mb-3">
          <div className="glass rounded-2xl p-3 flex items-center gap-3">
            <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="size-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Mode adaptatif activé</p>
              <p className="text-xs text-muted-foreground">Analyse en temps réel · Multilingue</p>
            </div>
            <div className="flex items-end gap-0.5 h-6">
              {[0,1,2,3,4].map((i) => (
                <span key={i} className="w-0.5 bg-primary rounded-full animate-wave" style={{ height: "100%", animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 px-5 pb-4 overflow-y-auto space-y-3" role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
                  : "glass text-foreground rounded-bl-sm"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="shrink-0 glass rounded-full px-3 py-2 text-xs font-medium hover:bg-muted/40 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-6 flex items-center gap-2">
          <button
            onClick={() => setListening((l) => !l)}
            className={`size-12 rounded-full grid place-items-center shrink-0 transition-all ${
              listening ? "bg-destructive text-destructive-foreground animate-pulse-glow" : "bg-gradient-primary text-primary-foreground shadow-glow"
            }`}
            aria-label={listening ? "Arrêter l'écoute" : "Parler au coach"}
          >
            <Mic className="size-5" />
          </button>
          <div className="glass rounded-full flex-1 flex items-center pl-4 pr-1 min-h-[48px]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Écrivez ou parlez..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              aria-label="Message au coach"
            />
            <Button
              onClick={() => send(input)}
              size="icon"
              className="size-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Envoyer"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Coach;
