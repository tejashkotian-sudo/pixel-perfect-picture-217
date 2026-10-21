import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { saveProgress } from "@/lib/progress-api";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { Scenario } from "@/lib/curriculum";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "./site";

export function Conversation({ scenario }: { scenario: Scenario }) {
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<{ who: string; kn: string; tr: string; en: string; mine?: boolean }[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saving = useRef(false);
  const { user } = useAuth();
  const qc = useQueryClient();
  const done = step >= scenario.steps.length;
  const cur = scenario.steps[step];

  async function save() {
    if (!user || saving.current) return;
    saving.current = true;
    setSaved("saving");
    const ok = await saveProgress({ kind: "conversation_completed", itemId: scenario.id });
    setSaved(ok ? "saved" : "error");
    saving.current = false;
    if (ok) await qc.invalidateQueries({ queryKey: ["progress"] });
  }

  const choose = (i: number) => {
    const c = cur?.choices[i];
    if (!cur || !c) return;
    setFeedback({ ok: c.correct, text: c.feedback });
    if (c.correct) {
      setLog((l) => [...l, { who: cur.speakerName, ...cur.speaker }, { who: "You", ...c.reply, mine: true }]);
      setStep((s) => s + 1);
      if (step + 1 === scenario.steps.length) void save();
    }
  };
  const reset = () => { setStep(0); setLog([]); setFeedback(null); setSaved("idle"); };

  return (
    <div className="surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-display text-lg font-semibold">{scenario.title}</div>
          <div className="text-xs text-muted-foreground">{scenario.place}</div>
        </div>
        <Button variant="ghost" size="sm" disabled={saved === "saving"} onClick={reset}><RotateCcw /> Restart</Button>
      </div>
      <div className="space-y-3" aria-live="polite">
        {log.map((m, i) => (
          <Bubble key={i} {...m} />
        ))}
        {!done && cur && <Bubble who={cur.speakerName} {...cur.speaker} />}
      </div>
      {feedback && (
        <p className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-sm ${feedback.ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`} role="status">
          {feedback.ok ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />} {feedback.text}
        </p>
      )}
      {!done && cur ? (
        <div className="mt-4 grid gap-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Choose your reply</div>
          {cur.choices.map((c, i) => (
            <Button variant="outline" key={i} onClick={() => choose(i)} className="h-auto flex-col items-start whitespace-normal rounded-xl border border-border bg-background p-3 text-left hover:border-saffron hover:bg-accent/40">
              <span className="kn block font-semibold text-primary">{c.reply.kn}</span>
              <span className="text-xs text-muted-foreground">{c.reply.tr} · {c.reply.en}</span>
            </Button>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-primary p-4 text-center text-primary-foreground">
          <div className="kn text-2xl">ಶಭಾಷ್!</div>
          <div className="text-sm">Conversation complete. Try another scenario.</div>
          <p role="status" className="mt-2 text-sm">{saved === "saving" ? "Saving…" : saved === "saved" ? "Saved to your progress." : !user ? "Sign in to save your progress." : saved === "error" ? "Your conversation hasn't been saved yet." : ""}</p>
          {saved === "error" && <Button variant="soft" className="mt-3" onClick={save}>Retry saving</Button>}
        </div>
      )}
    </div>
  );
}

function Bubble({ who, kn, tr, en, mine }: { who: string; kn: string; tr: string; en: string; mine?: boolean }) {
  return (
    <div className={`flex items-start gap-2 ${mine ? "flex-row-reverse text-right" : ""}`}>
      <SpeakButton text={kn} />
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <div className="text-[10px] uppercase tracking-wide opacity-70">{who}</div>
        <div className="kn text-lg font-semibold">{kn}</div>
        <div className="text-xs opacity-80">{tr} — {en}</div>
      </div>
    </div>
  );
}
