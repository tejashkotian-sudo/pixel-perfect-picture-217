// Server route: streams spoken audio for Kannada phrases via Lovable AI text-to-speech.
// Kept public (no site auth) so guests hear phrases too; the handler verifies the
// caller with a same-origin check and caps text length to limit abuse.
import { createFileRoute } from "@tanstack/react-router";

const GATEWAY = "https://ai.gateway.lovable.dev";
const MODEL = "google/gemini-3.1-flash-tts-preview";
const VOICE = "Kore";
const MAX_TEXT = 300;
const MAX_CACHE = 100;

// Short in-memory cache: repeated taps on the same phrase don't re-bill.
const cache = new Map<string, Uint8Array>();

export const Route = createFileRoute("/api/public/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        const host = request.headers.get("host");
        if (origin) {
          let sameOrigin = false;
          try {
            sameOrigin = new URL(origin).host === host;
          } catch {
            sameOrigin = false;
          }
          if (!sameOrigin) return new Response("Forbidden", { status: 403 });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response("Voice service is not configured.", { status: 500 });
        }

        const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
        const text = typeof body?.text === "string" ? body.text.trim() : "";
        if (!text || text.length > MAX_TEXT) {
          return new Response("Send a text field of 1-300 characters.", { status: 400 });
        }

        const hit = cache.get(text);
        if (hit) return wavResponse(hit);

        const upstream = await fetch(`${GATEWAY}/v1/audio/speech`, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: MODEL,
            contents: [{ role: "user", parts: [{ text: `Say slowly and clearly: ${text}` }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } },
            },
            stream_format: "audio",
          }),
        });

        if (!upstream.ok) {
          const detail = await upstream.text().catch(() => "");
          return new Response(detail || "Voice service failed.", { status: upstream.status });
        }

        const audio = new Uint8Array(await upstream.arrayBuffer());
        if (cache.size >= MAX_CACHE) {
          const oldest = cache.keys().next().value;
          if (oldest !== undefined) cache.delete(oldest);
        }
        cache.set(text, audio);
        return wavResponse(audio);
      },
    },
  },
});

function wavResponse(bytes: Uint8Array): Response {
  return new Response(bytes as unknown as BodyInit, {
    status: 200,
    headers: { "Content-Type": "audio/wav", "Cache-Control": "no-cache" },
  });
}
