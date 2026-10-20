import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Set up your learning — Kannada Connect" }, { name: "description", content: "Tell us your level and goals." }] }),
  component: Onboarding,
});

const STEPS = [
  { key: "interface_language", q: "Preferred interface language", opts: [["en", "English"]] },
  { key: "level", q: "Your current Kannada level", opts: [["beginner", "Beginner"], ["basic", "Basic"], ["intermediate", "Intermediate"]] },
  { key: "goal", q: "Your learning goal", opts: [["travel", "Travel"], ["college", "College"], ["work", "Work"], ["daily", "Daily life"], ["general", "General learning"]] },
  { key: "daily_minutes", q: "Daily learning target", opts: [["5", "5 minutes"], ["10", "10 minutes"], ["15", "15 minutes"]] },
] as const;

function Onboarding() {
  const { userId } = Route.useRouteContext();
  const [vals, setVals] = useState<Record<string, string>>({ interface_language: "en" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const complete = STEPS.every((s) => vals[s.key]);

  async function save() {
    setBusy(true);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      interface_language: vals["interface_language"] ?? "en",
      level: vals["level"] ?? null,
      goal: vals["goal"] ?? null,
      daily_minutes: Number(vals["daily_minutes"]),
      onboarded: true,
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) {
      toast.error("Couldn't save your preferences. Please try again.");
      return;
    }
    await qc.invalidateQueries({ queryKey: ["profile"] });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Logo />
      <h1 className="mt-8 text-4xl font-semibold">Let's personalise your learning</h1>
      <p className="mt-2 text-muted-foreground">Four quick questions. You can change these later.</p>
      <div className="mt-8 space-y-6">
        {STEPS.map((s) => (
          <fieldset key={s.key} className="surface p-5">
            <legend className="sr-only">{s.q}</legend>
            <div className="mb-3 font-semibold">{s.q}</div>
            <div className="flex flex-wrap gap-2">
              {s.opts.map(([v, label]) => (
                <button key={v} type="button" aria-pressed={vals[s.key] === v} onClick={() => setVals({ ...vals, [s.key]: v })}
                  className={`rounded-full border px-4 py-2 text-sm ${vals[s.key] === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-saffron"}`}>
                  {label}
                </button>
              ))}
            </div>
            {s.key === "interface_language" && <p className="mt-2 text-xs text-muted-foreground">More languages coming soon.</p>}
          </fieldset>
        ))}
      </div>
      <Button variant="hero" size="lg" className="mt-8" disabled={!complete || busy} onClick={save}>{busy ? "Saving…" : "Start learning"}</Button>
    </div>
  );
}
