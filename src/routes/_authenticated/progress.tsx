import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle } from "lucide-react";
import { Page } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLearner } from "@/lib/useLearner";
import { MODULES } from "@/lib/curriculum";
import { completedLessonIds } from "@/lib/progress";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { SCENARIOS } from "@/lib/curriculum";
import { resetProgress } from "@/lib/progress-api";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "Your progress — Kannada Connect" }, { name: "description", content: "Module-by-module Kannada progress." }, { property: "og:title", content: "Your progress — Kannada Connect" }, { property: "og:description", content: "Module-by-module Kannada progress." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const { userId } = Route.useRouteContext();
  const L = useLearner(userId);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const done = completedLessonIds(L.completions);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  async function reset() {
    if (resetting) return;
    setResetting(true);
    await qc.cancelQueries({ queryKey: ["progress", userId] });
    const result = await resetProgress();
    if (result.ok) {
      await qc.invalidateQueries({ queryKey: ["progress", userId] });
      setResetOpen(false);
      toast.success("Your progress has been reset. Your account and preferences are unchanged.");
    } else toast.error(result.message);
    setResetting(false);
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <Page>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold">Your progress</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="soft"><Link to="/onboarding">Edit preferences</Link></Button>
          <Button variant="ghost" onClick={signOut}>Log out</Button>
        </div>
      </div>
      {L.loading ? <p className="mt-8 text-muted-foreground">Loading your progress…</p> : L.error ? <p role="alert" className="mt-8 text-destructive">Couldn't load your progress. <Button variant="ghost" onClick={() => qc.invalidateQueries({ queryKey: ["progress", userId] })}>Try again</Button></p> : <>
      <p className="mt-2 text-muted-foreground">{L.points} points · {L.streak}-day streak · {L.accuracy == null ? "no quizzes yet" : `${L.accuracy}% accuracy`}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {MODULES.map((m) => {
          const n = m.lessons.filter((l) => done.has(l.id)).length;
          return (
            <div key={m.id} className="surface p-5">
              <div className="flex justify-between">
                <div className="font-semibold">{m.number}. {m.title}</div>
                <div className="text-sm text-muted-foreground">{n}/{m.lessons.length}</div>
              </div>
              <Progress value={(n / m.lessons.length) * 100} className="mt-3" aria-label={`${m.title} progress`} />
              <ul className="mt-3 space-y-1">
                {m.lessons.map((l) => (
                  <li key={l.id}>
                    <Link to="/lesson/$lessonId" params={{ lessonId: l.id }} className="flex items-center gap-2 text-sm hover:text-primary">
                      {done.has(l.id) ? <CheckCircle2 className="size-4 text-success" /> : <Circle className="size-4 text-muted-foreground" />} {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <section className="mt-8 border-t border-border pt-6">
        <h2 className="text-2xl font-semibold">Conversations</h2>
        <ul className="mt-4 space-y-3">{SCENARIOS.map((s) => <li key={s.id}><Link to="/practice" className="flex items-center gap-2 text-sm hover:text-primary">{L.conversations.has(s.id) ? <CheckCircle2 className="size-4 text-success" /> : <Circle className="size-4 text-muted-foreground" />} {s.title}</Link></li>)}</ul>
      </section>
      <div className="mt-8 border-t border-border pt-6">
        <AlertDialog open={resetOpen} onOpenChange={(open) => { if (!resetting) setResetOpen(open); }}>
          <AlertDialogTrigger asChild><Button variant="outline" className="text-destructive">Reset progress</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Reset all learning progress?</AlertDialogTitle><AlertDialogDescription>This permanently removes your lesson results, quiz answers and completed conversations. Your account and learning preferences stay unchanged.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel disabled={resetting}>Cancel</AlertDialogCancel><Button variant="destructive" disabled={resetting} onClick={reset}>{resetting ? "Resetting…" : "Reset all progress"}</Button></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      </>}
    </Page>
  );
}
