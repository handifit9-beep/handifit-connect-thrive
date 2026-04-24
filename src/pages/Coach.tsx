import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Sparkles, Globe, Send, ArrowLeft, Volume2, VolumeX, Square, Loader2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Msg { role: "user" | "assistant"; content: string; }

const presets = [
  "Guide-moi pour démarrer",
  "Adapte la séance à mon rythme",
  "Comment progresser cette semaine ?",
  "Lance la séance immersive forêt",
];

const initial: Msg[] = [
  { role: "assistant", content: "Bonjour 👋 Je suis votre coach HANDIFIT. Comment vous sentez-vous aujourd'hui ?" },
];

const NAV_REGEX = /\[NAV:(\/[a-z/-]+)\]/i;

const Coach = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  // -------- TTS --------
  const speak = async (text: string) => {
    if (!voiceOn || !text.trim()) return;
    try {
      setSpeaking(true);
      const { data, error } = await supabase.functions.invoke("elevenlabs-tts", { body: { text } });
      if (error || !data?.audioContent) throw error || new Error("TTS empty");
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch (e) {
      console.error(e);
      setSpeaking(false);
    }
  };

  const stopSpeak = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeaking(false);
  };

  // -------- LLM streaming --------
  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Msg = { role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setThinking(true);

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coach-chat`;
    let assistantText = "";

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newHistory.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Trop de requêtes, réessayez bientôt.");
        else if (resp.status === 402) toast.error("Crédits IA épuisés.");
        else toast.error("Le coach est indisponible.");
        setThinking(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;

      // push empty assistant placeholder
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }

      // Detect [NAV:/path] command
      const navMatch = assistantText.match(NAV_REGEX);
      let cleanText = assistantText;
      if (navMatch) {
        cleanText = assistantText.replace(NAV_REGEX, "").trim();
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: cleanText };
          return copy;
        });
        toast.success(`Navigation : ${navMatch[1]}`);
        setTimeout(() => navigate(navMatch[1]), 1200);
      }

      speak(cleanText);
    } catch (e) {
      console.error(e);
      toast.error("Erreur de connexion au coach.");
    } finally {
      setThinking(false);
    }
  };

  // -------- STT --------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(",")[1];
          setTranscribing(true);
          try {
            const { data, error } = await supabase.functions.invoke("elevenlabs-stt", { body: { audio: base64 } });
            if (error) throw error;
            const text = (data?.text || "").trim();
            if (text) send(text);
            else toast.message("Je n'ai rien entendu, réessayez.");
          } catch (e) {
            console.error(e);
            toast.error("Transcription impossible.");
          } finally {
            setTranscribing(false);
          }
        };
        reader.readAsDataURL(blob);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch {
      toast.error("Microphone inaccessible. Vérifiez les permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
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
          <button
            onClick={() => { if (speaking) stopSpeak(); setVoiceOn((v) => !v); }}
            className="size-10 rounded-full glass grid place-items-center"
            aria-label={voiceOn ? "Couper la voix" : "Activer la voix"}
          >
            {voiceOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4 text-muted-foreground" />}
          </button>
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
              <p className="text-sm font-semibold">{speaking ? "Le coach parle…" : recording ? "Écoute en cours…" : "Mode adaptatif activé"}</p>
              <p className="text-xs text-muted-foreground">IA temps réel · Voix ElevenLabs · Multilingue</p>
            </div>
            <div className="flex items-end gap-0.5 h-6">
              {[0,1,2,3,4].map((i) => (
                <span key={i} className={`w-0.5 bg-primary rounded-full ${(speaking || recording) ? "animate-wave" : "opacity-30 h-1"}`}
                  style={{ height: speaking || recording ? "100%" : undefined, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>

        <div ref={logRef} className="flex-1 px-5 pb-4 overflow-y-auto space-y-3" role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
                  : "glass text-foreground rounded-bl-sm"
              }`}>
                {m.content || (thinking && i === messages.length - 1 ? <Loader2 className="size-4 animate-spin" /> : "")}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-2">
            {presets.map((p) => (
              <button key={p} onClick={() => send(p)} disabled={thinking}
                className="shrink-0 glass rounded-full px-3 py-2 text-xs font-medium hover:bg-muted/40 transition-colors disabled:opacity-50">
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-6 flex items-center gap-2">
          <button
            onClick={recording ? stopRecording : (speaking ? stopSpeak : startRecording)}
            disabled={transcribing || thinking}
            className={`size-12 rounded-full grid place-items-center shrink-0 transition-all disabled:opacity-50 ${
              recording ? "bg-destructive text-destructive-foreground animate-pulse-glow"
              : speaking ? "bg-accent text-accent-foreground"
              : "bg-gradient-primary text-primary-foreground shadow-glow"
            }`}
            aria-label={recording ? "Arrêter l'écoute" : speaking ? "Arrêter la voix" : "Parler au coach"}
          >
            {transcribing ? <Loader2 className="size-5 animate-spin" /> : speaking ? <Square className="size-5" /> : <Mic className="size-5" />}
          </button>
          <div className="glass rounded-full flex-1 flex items-center pl-4 pr-1 min-h-[48px]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder={recording ? "Parlez maintenant…" : "Écrivez ou parlez…"}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              aria-label="Message au coach"
              disabled={recording || transcribing}
            />
            <Button onClick={() => send(input)} size="icon" disabled={thinking || !input.trim()}
              className="size-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Envoyer">
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Coach;
