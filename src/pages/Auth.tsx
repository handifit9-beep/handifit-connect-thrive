import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Accessibility } from "lucide-react";
import handifitLogo from "@/assets/handifit-logo.png";

const signInSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(6, "Mot de passe : 6 caractères minimum").max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Nom trop court").max(100),
});

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [signUp, setSignUp] = useState({ fullName: "", email: "", password: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/dashboard", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse(signIn);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    setLoading(false);
    if (error) toast.error(error.message === "Invalid login credentials" ? "Identifiants incorrects" : error.message);
    else toast.success("Bienvenue 👋");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse(signUp);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message.includes("already") ? "Cet email est déjà utilisé" : error.message);
    else toast.success("Compte créé ! Vous êtes connecté·e.");
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) {
      toast.error("Connexion Google impossible");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-5 py-8 relative overflow-hidden">
      {/* Background neon glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md space-y-6 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <img src={handifitLogo} alt="HANDIFIT" className="h-16 w-auto drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]" />
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Connexion sécurisée</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 w-full glass">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="glass rounded-3xl p-6 space-y-4 mt-3">
              <div className="space-y-2">
                <Label htmlFor="si-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="si-email" type="email" autoComplete="email" required className="pl-10"
                    value={signIn.email} onChange={(e) => setSignIn({ ...signIn, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="si-pass">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="si-pass" type="password" autoComplete="current-password" required className="pl-10"
                    value={signIn.password} onChange={(e) => setSignIn({ ...signIn, password: e.target.value })} />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Se connecter"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="glass rounded-3xl p-6 space-y-4 mt-3">
              <div className="space-y-2">
                <Label htmlFor="su-name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="su-name" required className="pl-10"
                    value={signUp.fullName} onChange={(e) => setSignUp({ ...signUp, fullName: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="su-email" type="email" autoComplete="email" required className="pl-10"
                    value={signUp.email} onChange={(e) => setSignUp({ ...signUp, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-pass">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="su-pass" type="password" autoComplete="new-password" required minLength={6} className="pl-10"
                    value={signUp.password} onChange={(e) => setSignUp({ ...signUp, password: e.target.value })} />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Créer mon compte"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
        </div>

        <Button onClick={handleGoogle} disabled={loading} variant="outline" className="w-full glass border-border/40">
          <svg className="size-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.94h5.27c-.23 1.4-1.66 4.1-5.27 4.1-3.17 0-5.76-2.63-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.71 1.43l2.53-2.43C16.93 4.05 14.86 3 12.18 3 6.85 3 2.5 7.35 2.5 12.69s4.35 9.69 9.68 9.69c5.59 0 9.29-3.93 9.29-9.46 0-.64-.07-1.13-.12-1.82z"/></svg>
          Continuer avec Google
        </Button>

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <Accessibility className="size-3" /> Conçu pour l'accessibilité
        </p>
      </div>
    </div>
  );
};

export default Auth;
