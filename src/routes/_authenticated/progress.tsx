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

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "Your progress — Kannada Connect" }, { name: "description", content: "Module-by-module Kannada progress." }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const { userId } = Route.useRouteContext();
  const L = useLearner(userId);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const done = completedLessonIds(L.completions);

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
        <div className="flex gap-2">
          <Button asChild variant="soft"><Link to="/onboarding">Edit preferences</Link></Button>
          <Button variant="ghost" onClick={signOut}>Log out</Button>
        </div>
      </div>
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
    </Page>
  );
}
