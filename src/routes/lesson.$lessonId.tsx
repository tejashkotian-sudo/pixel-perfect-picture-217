import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { Page, PhraseRow, SpeakButton } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { buildQuiz, getLesson } from "@/lib/curriculum";
import { useAuth } from "@/hooks/useAuth";
import { recordQuiz } from "@/lib/data";

export const Route = createFileRoute("/lesson/$lessonId")({
  loader: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    if (!lesson) throw notFound();
    return { title: lesson.title, module: lesson.moduleTitle };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Kannada Connect` },
          { name: "description", content: `Learn Kannada phrases for ${loaderData.title.toLowerCase()} (${loaderData.module}).` },
          { property: "og:title", content: `${loaderData.title} — Kannada Connect` },
          { property: "og:description", content: `A short Kannada lesson from ${loaderData.module}.` },
        ]
      : [{ title: "Lesson unavailable — Kannada Connect" }, { name: "robots", content: "noindex" }],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const lesson = getLesson(lessonId)!;
  const quiz = useMemo(() => buildQuiz(lesson), [lesson]);
  const { user } = useAuth();
  const qc = useQueryClient();
  const [phase, setPhase] = useState<"learn" | "quiz" | "done">("learn");
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved" | "guest">("idle");

  const q = quiz[qi]!;

  async function next() {
    const r = [...results, { questionId: q.id, correct: picked === q.answer }];
    setResults(r);
    setPicked(null);
    if (qi + 1 < quiz.length) return setQi(qi + 1);
    setPhase("done");
    if (!user) return setSaved("guest");
    setSaved("saving");
    try {
      await recordQuiz(user.id, lesson.id, r);
      setSaved("saved");
      qc.invalidateQueries({ queryKey: ["progress"] });
    } catch {
      setSaved("idle");
      toast.error("Couldn't save your result. Check your connection and try again.");
    }
  }

  const score = results.filter((r) => r.correct).length;

  return (
    <Page>
      <Link to="/learn" className="text-sm text-muted-foreground hover:text-foreground">← {lesson.moduleTitle}</Link>
      <h1 className="mt-2 text-4xl font-semibold">{lesson.title}</h1>
      <p className="mt-1 text-muted-foreground">{lesson.summary}</p>

      {phase === "learn" && (
        <div className="mt-8 max-w-2xl space-y-3">
          {lesson.phrases.map((p) => <PhraseRow key={p.kn} p={p} />)}
          <p className="pt-2 text-sm text-muted-foreground">Tip: tap the speaker, then say each phrase aloud yourself.</p>
          <Button variant="hero" size="lg" onClick={() => setPhase("quiz")}>Start quiz ({quiz.length} questions)</Button>
        </div>
      )}

      {phase === "quiz" && (
        <div className="surface mt-8 max-w-2xl p-6">
          <Progress value={(qi / quiz.length) * 100} aria-label="Quiz progress" />
          <div className="mt-6 text-sm text-muted-foreground">Question {qi + 1} of {quiz.length} · What does this mean?</div>
          <div className="mt-2 flex items-center gap-3">
            <SpeakButton text={q.prompt.kn} />
            <div>
              <div className="kn text-3xl font-semibold text-primary">{q.prompt.kn}</div>
              <div className="text-sm italic text-muted-foreground">{q.prompt.tr}</div>
            </div>
          </div>
          <div className="mt-6 grid gap-2" role="radiogroup">
            {q.options.map((o) => {
              const state = picked == null ? "" : o === q.answer ? "border-success bg-success/10" : o === picked ? "border-destructive bg-destructive/10" : "opacity-60";
              return (
                <button key={o} role="radio" aria-checked={picked === o} disabled={picked != null} onClick={() => setPicked(o)} className={`rounded-xl border border-border p-3 text-left hover:border-saffron ${state}`}>
                  {o}
                </button>
              );
            })}
          </div>
          {picked != null && (
            <div className="mt-4 flex items-center justify-between gap-3" role="status">
              <span className={`flex items-center gap-2 text-sm ${picked === q.answer ? "text-success" : "text-destructive"}`}>
                {picked === q.answer ? <><CheckCircle2 className="size-4" /> Correct! +10 points</> : <><XCircle className="size-4" /> It means “{q.answer}”</>}
              </span>
              <Button variant="hero" onClick={next}>{qi + 1 < quiz.length ? "Next" : "Finish"}</Button>
            </div>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="surface mt-8 max-w-2xl p-8 text-center">
          <div className="kn text-4xl text-primary">{score === quiz.length ? "ಅದ್ಭುತ!" : "ಚೆನ್ನಾಗಿದೆ!"}</div>
          <div className="mt-2 text-2xl font-semibold">{score} / {quiz.length} correct</div>
          <div className="text-saffron">+{score * 10} points</div>
          <p className="mt-3 text-sm text-muted-foreground">
            {saved === "saving" && "Saving your progress…"}
            {saved === "saved" && "Saved to your progress."}
            {saved === "guest" && "You're not logged in, so this result wasn't saved."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="soft" onClick={() => { setPhase("learn"); setQi(0); setResults([]); setSaved("idle"); }}>Practise again</Button>
            {saved === "guest" ? (
              <Button asChild variant="hero"><Link to="/auth" search={{ mode: "signup" }}>Create a free account</Link></Button>
            ) : (
              <Button asChild variant="hero"><Link to="/dashboard">Back to dashboard</Link></Button>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}
