import { describe, expect, it } from "vitest";
import { pickVoice, resolveSpokenText, romanForSpeech } from "@/lib/speech";
const voice = (lang: string, name = lang) => ({ lang, name }) as SpeechSynthesisVoice;
describe("speech helpers", () => {
  it("uses a Kannada voice when the browser has one", () => {
    const pick = pickVoice([voice("en-US"), voice("kn-IN", "Kannada")]);
    expect(pick.mode).toBe("native");
    expect(pick.voice?.lang).toBe("kn-IN");
  });
  it("falls back to Indian English and roman mode", () => {
    const pick = pickVoice([voice("en-US"), voice("en-IN")]);
    expect(pick.mode).toBe("roman");
    expect(pick.voice?.lang).toBe("en-IN");
  });
  it("expands transliteration for English TTS", () => {
    expect(romanForSpeech("namaskāra")).toBe("namaskaara");
    expect(romanForSpeech("dhanyavādagaḷu")).toBe("dhanyavaadagalu");
  });
  it("speaks script natively and transliteration as fallback", () => {
    const p = { kn: "ನಮಸ್ಕಾರ", tr: "namaskāra" };
    expect(resolveSpokenText(p, "native")).toBe("ನಮಸ್ಕಾರ");
    expect(resolveSpokenText(p, "roman")).toBe("namaskaara");
  });
});
