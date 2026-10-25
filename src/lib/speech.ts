export type SpeakInput = { kn: string; tr?: string };
export type VoicePick = {
  voice: SpeechSynthesisVoice | null;
  mode: "native" | "roman";
};
/** Prefer a Kannada voice; otherwise use Indian/English and speak transliteration. */
export function pickVoice(voices: SpeechSynthesisVoice[]): VoicePick {
  const lang = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
  const kn = voices.find((v) => lang(v).startsWith("kn"));
  if (kn) return { voice: kn, mode: "native" };
  const enIn = voices.find((v) => lang(v).startsWith("en-in"));
  if (enIn) return { voice: enIn, mode: "roman" };
  const en = voices.find((v) => lang(v).startsWith("en"));
  return { voice: en ?? voices[0] ?? null, mode: "roman" };
}
/** ASCII-ish pronunciation of ISO-15919 transliteration so English TTS is clearer. */
export function romanForSpeech(tr: string) {
  return tr
    .replace(/ā/g, "aa")
    .replace(/ē/g, "e")
    .replace(/ī/g, "ee")
    .replace(/ō/g, "o")
    .replace(/ū/g, "oo")
    .replace(/ḷ/g, "l")
    .replace(/ṇ/g, "n")
    .replace(/ñ/g, "n")
    .replace(/[ṣś]/g, "sh")
    .replace(/ṭ/g, "t")
    .replace(/ḍ/g, "d")
    .replace(/ṃ/g, "m")
    .replace(/ḥ/g, "h");
}
export function resolveSpokenText(input: SpeakInput, mode: VoicePick["mode"]) {
  if (mode === "native") return input.kn;
  return romanForSpeech(input.tr?.trim() ? input.tr : input.kn);
}
export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
function currentPick(): VoicePick {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return { voice: null, mode: "native" };
  return pickVoice(voices);
}
let speakGen = 0;
export function stopSpeaking() {
  speakGen += 1;
  if (speechSupported()) window.speechSynthesis.cancel();
}
type SpeakOpts = {
  onStart?: () => void;
  onEnd?: () => void;
};
function makeUtterance(text: string, pick: VoicePick, opts: SpeakOpts) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = pick.mode === "native" ? "kn-IN" : (pick.voice?.lang ?? "en-IN");
  u.rate = 0.78;
  if (pick.voice) u.voice = pick.voice;
  u.onstart = () => opts.onStart?.();
  u.onend = () => opts.onEnd?.();
  u.onerror = () => opts.onEnd?.();
  return u;
}
function playNow(u: SpeechSynthesisUtterance) {
  const busy = window.speechSynthesis.speaking || window.speechSynthesis.pending;
  if (busy) window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
/** Speak one Kannada phrase. Must run from a click so the browser allows audio. */
export function speak(input: SpeakInput | string, opts: SpeakOpts = {}): boolean {
  if (!speechSupported()) return false;
  const phrase = typeof input === "string" ? { kn: input } : input;
  speakGen += 1;
  const pick = currentPick();
  playNow(makeUtterance(resolveSpokenText(phrase, pick.mode), pick, opts));
  return true;
}
/** Speak phrases one after another. Clicking another speaker cancels the rest. */
export function speakSequence(phrases: SpeakInput[], opts: SpeakOpts = {}): boolean {
  if (!speechSupported() || phrases.length === 0) return false;
  speakGen += 1;
  const gen = speakGen;
  const pick = currentPick();
  const run = (i: number) => {
    if (gen !== speakGen) return;
    if (i >= phrases.length) {
      opts.onEnd?.();
      return;
    }
    playNow(
      makeUtterance(resolveSpokenText(phrases[i]!, pick.mode), pick, {
        onStart: i === 0 ? opts.onStart : undefined,
        onEnd: () => {
          if (gen !== speakGen) {
            opts.onEnd?.();
            return;
          }
          run(i + 1);
        },
      }),
    );
  };
  run(0);
  return true;
}