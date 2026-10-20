import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Award, Flame, Target, Trophy, BookOpen, Sparkles } from "lucide-react";
import { Page, SpeakButton } from "@/components/site";
import { Button } from "@/components/ui/button";
import { useLearner } from "@/lib/useLearner";
import { ALL_LESSONS, dailyPhrase } from "@/lib/curriculum";
import { recordQuiz } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Your dashboard — Kannada Connect" }, { name: "description", content: "Your Kannada learning progress." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { userId } = Route.useRouteContext();
  const L = useLearner(userId);
  if (L.loading) return <Page><p className="text-muted-foreground">Loading your progress…</p></Page>;
  if (L.error) return <Page><p className="text-destructive">Couldn't load your progress. Please refresh.</p></Page>;
  if (L.profile && !L.profile.onboarded) return <Navigate to="/onboarding" />;
  const p = L.profile;
  const first = L.completions.length === 0;

  return (
    <Page>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kn text-saffron">ನಮಸ್ಕಾರ,</p>
          <h1 className="text-4xl font-semibold">Welcome, {p?.display_name ?? "learner"}</h1>
          <p className="mt-1 text-sm capitalize text-muted-foreground">{p?.level} level · goal: {p?.goal} · {p?.daily_minutes} min/day</p>
        </div>
        {L.next && (
          <Button asChild variant="hero" size="lg">
            <Link to="/lesson/$lessonId" params={{ lessonId: L.next.lesson.id }}>{first ? "Start first lesson" : "Continue learning"}</Link>
          </Button>
        )}
      </div>

      {first && (
        <div className="surface pattern-dots mt-8 p-6">
          <div className="font-display text-2xl font-semibold">Your journey starts here</div>
          <p className="mt-1 text-muted-foreground">Complete your first lesson to earn points, start a streak and unlock your first badge.</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={BookOpen} label="Lessons completed" value={`${L.lessonsDone} / ${ALL_LESSONS.length}`} />
        <Stat icon={Trophy} label="Total points" value={String(L.points)} />
        <Stat icon={Flame} label="Current streak" value={`${L.streak} day${L.streak === 1 ? "" : "s"}`} />
        <Stat icon={Target} label="Quiz accuracy" value={L.accuracy == null ? "—" : `${L.accuracy}%`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {L.next && (
            <div className="surface p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-saffron"><Sparkles className="size-4" /> Recommended next</div>
              <div className="mt-2 font-display text-2xl font-semibold">{L.next.lesson.title}</div>
              <p className="text-sm text-muted-foreground">{L.next.lesson.moduleTitle} · {L.next.reason}</p>
              <Button asChild variant="saffron" className="mt-4"><Link to="/lesson/$lessonId" params={{ lessonId: L.next.lesson.id }}>Open lesson</Link></Button>
            </div>
          )}
          <DailyChallenge userId={userId} doneToday={L.completions.some((c) => c.lesson_id === "daily" && new Date(c.completed_at).toDateString() === new Date().toDateString())} />
        </div>
        <div className="surface p-6">
          <div className="font-semibold">Recent activity</div>
          {L.completions.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {L.completions.slice(0, 6).map((c, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{c.lesson_id === "daily" ? "Daily challenge" : ALL_LESSONS.find((l) => l.id === c.lesson_id)?.title ?? c.lesson_id}</span>
                  <span className="text-muted-foreground">{c.score}/{c.total} · {new Date(c.completed_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="surface mt-6 p-6">
        <div className="flex items-center gap-2 font-semibold"><Award className="size-5 text-saffron" /> Badges</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {L.badges.map((b) => (
            <div key={b.id} className={`rounded-xl border p-3 text-center ${b.earned ? "border-saffron bg-accent" : "border-dashed border-border opacity-60"}`}>
              <Award className={`mx-auto ${b.earned ? "text-saffron" : "text-muted-foreground"}`} />
              <div className="mt-1 text-sm font-semibold">{b.label}</div>
              <div className="text-xs text-muted-foreground">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return (
    <div className="surface p-5">
      <Icon className="size-5 text-saffron" />
      <div className="mt-2 font-display text-3xl font-semibold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function DailyChallenge({ userId, doneToday }: { userId: string; doneToday: boolean }) {
  const phrase = dailyPhrase();
  const options = [...new Set([phrase.en, ...ALL_LESSONS.flatMap((l) => l.phrases.map((x) => x.en)).filter((e) => e !== phrase.en).slice(phrase.en.length % 20, (phrase.en.length % 20) + 2)])];
  options.sort();
  const [picked, setPicked] = useState<string | null>(null);
  const qc = useQueryClient();
  async function pick(o: string) {
    setPicked(o);
    try {
      await recordQuiz(userId, "daily", [{ questionId: `daily-${new Date().toDateString()}`, correct: o === phrase.en }]);
      qc.invalidateQueries({ queryKey: ["progress"] });
    } catch {
      toast.error("Couldn't save the challenge.");
    }
  }
  return (
    <div className="surface p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-saffron">Daily challenge</div>
      <div className="mt-2 flex items-center gap-3">
        <SpeakButton text={phrase.kn} />
        <div>
          <div className="kn text-2xl font-semibold text-primary">{phrase.kn}</div>
          <div className="text-sm italic text-muted-foreground">{phrase.tr}</div>
        </div>
      </div>
      {doneToday && picked == null ? (
        <p className="mt-4 text-sm text-success">Done for today — it means “{phrase.en}”. Come back tomorrow!</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {options.map((o) => (
            <button key={o} disabled={picked != null} onClick={() => pick(o)}
              className={`rounded-xl border p-3 text-sm ${picked == null ? "border-border hover:border-saffron" : o === phrase.en ? "border-success bg-success/10" : o === picked ? "border-destructive bg-destructive/10" : "opacity-60"}`}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
