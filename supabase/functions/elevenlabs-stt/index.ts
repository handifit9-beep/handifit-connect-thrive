// Reconnaissance vocale ElevenLabs — transcription d'un fichier audio
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY missing");

    const { audio } = await req.json(); // base64
    if (!audio || typeof audio !== "string") {
      return new Response(JSON.stringify({ error: "Audio manquant" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // decode base64 to bytes
    const binary = Uint8Array.from(atob(audio), (c) => c.charCodeAt(0));
    const blob = new Blob([binary], { type: "audio/webm" });
    const fd = new FormData();
    fd.append("file", blob, "audio.webm");
    fd.append("model_id", "scribe_v2");
    fd.append("language_code", "fra");

    const resp = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: fd,
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("STT failed", resp.status, err);
      return new Response(JSON.stringify({ error: "Transcription échouée" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    return new Response(JSON.stringify({ text: data.text || "" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stt error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
