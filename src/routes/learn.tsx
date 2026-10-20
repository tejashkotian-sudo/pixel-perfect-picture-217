import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Page } from "@/components/site";
import { MODULES } from "@/lib/curriculum";
import { useAuth } from "@/hooks/useAuth";
import { fetchProgress } from "@/lib/data";
import { completedLessonIds } from "@/lib/progress";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Kannada lessons by situation — Kannada Connect" },
      { name: "description", content: "Six practical modules: basics, travel, shopping & food, college & work, healthcare and everyday life." },
      { property: "og:title", content: "Kannada lessons — Kannada Connect" },
      { property: "og:description", content: "Six practical modules for everyday Kannada." },
    ],
  }),
  component: Learn,
});

function Learn() {
  const { user } = useAuth();
  const { data } = useQuery({ queryKey: ["progress", user?.id], queryFn: () => fetchProgress(user!.id), enabled: !!user });
  const done = completedLessonIds(data?.completions ?? []);
  return (
    <Page>
      <h1 className="text-4xl font-semibold">Curriculum</h1>
      <p className="mt-2 text-muted-foreground">Six modules built around real situations. {user ? "" : "Log in to save your progress."}</p>
      <div className="mt-10 space-y-8">
        {MODULES.map((m) => (
          <section key={m.id} id={m.id} className="scroll-mt-24">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl text-saffron">{String(m.number).padStart(2, "0")}</span>
              <div>
                <h2 className="text-2xl font-semibold">{m.title}</h2>
                <p className="text-sm text-muted-foreground">{m.situation}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {m.lessons.map((l) => (
                <Link key={l.id} to="/lesson/$lessonId" params={{ lessonId: l.id }} className="surface p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold">{l.title}</div>
                    {done.has(l.id) && <CheckCircle2 className="size-5 text-success" aria-label="Completed" />}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{l.summary}</p>
                  <div className="kn mt-3 text-primary">{l.phrases[0]?.kn}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{l.phrases.length} phrases · quiz</div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Page>
  );
}
