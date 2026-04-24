// Coach IA HANDIFIT — streaming chat via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es le Coach IA de HANDIFIT, un vélo elliptique intelligent inclusif conçu pour les personnes malvoyantes, aveugles, malentendantes ou sourdes.
Règles :
- Tu réponds en français par défaut, de manière chaleureuse, concise (2-4 phrases max), accessible.
- Tu utilises un langage clair, jamais condescendant, valorisant l'autonomie.
- Tu adaptes les conseils au handicap mentionné (audio descriptif pour visuel, vibrations/visuel pour auditif).
- Tu peux suggérer une action de navigation dans l'app via une balise spéciale en fin de réponse, exactement formatée :
  [NAV:/route] où route est l'une de : /dashboard /training /training/live /immersive /health /community /profile /rehab /autonomy /settings
  N'inclus une balise [NAV:...] que si l'utilisateur demande explicitement à aller quelque part ou à lancer une action (ex: "lance la séance" → [NAV:/training/live]).
- Sécurité : si l'utilisateur évoque douleur, vertige, malaise → recommande d'arrêter et consulter un professionnel.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429)
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un instant." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (response.status === 402)
        return new Response(JSON.stringify({ error: "Crédits IA épuisés. Ajoutez du crédit dans Lovable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur passerelle IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("coach-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
