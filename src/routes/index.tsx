import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, ShoppingBag, UtensilsCrossed, HeartPulse, GraduationCap, Briefcase, BookOpen, MessagesSquare, Mic, LineChart, Accessibility, Volume2, Type, Keyboard } from "lucide-react";
import { Page, PhraseRow } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/components/Conversation";
import { SCENARIOS, SITUATIONS } from "@/lib/curriculum";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kannada Connect — Learn Kannada. Live Confidently." },
      { name: "description", content: "Practise useful Kannada for autos, markets, cafés, hospitals and work — in minutes a day." },
      { property: "og:title", content: "Kannada Connect — Learn Kannada. Live Confidently." },
      { property: "og:description", content: "Practical, situation-based Kannada lessons with interactive conversations and progress tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ICONS = [Bus, ShoppingBag, UtensilsCrossed, HeartPulse, GraduationCap, Briefcase];
const PREVIEW = [
  { kn: "ನಮಸ್ಕಾರ", tr: "namaskāra", en: "Hello" },
  { kn: "ಇದು ಎಷ್ಟು?", tr: "idu eṣṭu?", en: "How much is this?" },
  { kn: "ಮೀಟರ್ ಹಾಕಿ", tr: "mīṭar hāki", en: "Put the meter on" },
];

function Index() {
  return (
    <Page>
      <section className="grid items-center gap-12 py-8 md:grid-cols-2 md:py-16">
        <div>
          <p className="kn mb-4 inline-block rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">ಕನ್ನಡ ಕಲಿಯಿರಿ · Learn Kannada</p>
          <h1 className="text-5xl font-semibold leading-[1.05] md:text-6xl">Kannada is closer than you think.</h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Practise the Kannada you'll actually use — in autos, markets, cafés and offices — in just a few minutes a day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><Link to="/auth" search={{ mode: "signup" }}>Start Learning Free</Link></Button>
            <Button asChild variant="soft" size="lg"><Link to="/practice">Try a Real-Life Conversation</Link></Button>
          </div>
        </div>
        <div className="surface pattern-dots relative space-y-3 p-6">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phrase preview · tap to listen</div>
          {PREVIEW.map((p) => <PhraseRow key={p.kn} p={p} />)}
        </div>
      </section>

      <section className="py-12" aria-labelledby="situations">
        <h2 id="situations" className="text-3xl font-semibold">Learn by situation</h2>
        <p className="mt-2 text-muted-foreground">Start wherever you need Kannada most.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITUATIONS.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <Link key={s.key} to="/learn" hash={s.moduleId} className="surface group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><Icon /></span>
                <div>
                  <div className="font-semibold">{s.key} <span className="kn ml-1 text-saffron">{s.kn}</span></div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="py-12" aria-labelledby="how">
        <h2 id="how" className="text-3xl font-semibold">How it works</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            [BookOpen, "Learn", "Short lessons with script, transliteration and meaning."],
            [MessagesSquare, "Practise", "Quizzes and branching real-life conversations."],
            [Mic, "Speak", "Listen to each phrase and repeat it aloud."],
            [LineChart, "Track progress", "Points, streaks, accuracy and badges."],
          ].map(([Icon, t, d], i) => {
            const I = Icon as typeof BookOpen;
            return (
              <li key={t as string} className="surface p-5">
                <div className="flex items-center gap-2 text-saffron"><I /> <span className="text-xs font-semibold">STEP {i + 1}</span></div>
                <div className="mt-3 font-display text-xl font-semibold">{t as string}</div>
                <p className="mt-1 text-sm text-muted-foreground">{d as string}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid gap-8 py-12 md:grid-cols-2" aria-labelledby="demo">
        <div>
          <h2 id="demo" className="text-3xl font-semibold">Try it right now</h2>
          <p className="mt-3 text-muted-foreground">This is a sample conversation. Pick the right reply to keep the conversation going — no account needed.</p>
          <Button asChild variant="link" className="mt-2 px-0"><Link to="/practice">See all scenarios →</Link></Button>
        </div>
        <Conversation scenario={SCENARIOS[0]} />
      </section>

      <section className="surface my-12 grid gap-6 p-8 md:grid-cols-3" aria-labelledby="access">
        <div className="md:col-span-3">
          <h2 id="access" className="flex items-center gap-2 text-3xl font-semibold"><Accessibility className="text-saffron" /> Built for beginners</h2>
          <p className="mt-2 text-muted-foreground">No grammar drills, no prior knowledge needed.</p>
        </div>
        {[
          [Type, "Script + transliteration", "Every phrase shows Kannada script, Roman letters and English."],
          [Volume2, "Listen anytime", "Tap the speaker to hear phrases at a slower pace."],
          [Keyboard, "Keyboard friendly", "Clear focus states and readable contrast throughout."],
        ].map(([Icon, t, d]) => {
          const I = Icon as typeof Type;
          return (
            <div key={t as string}>
              <I className="text-primary" />
              <div className="mt-2 font-semibold">{t as string}</div>
              <p className="text-sm text-muted-foreground">{d as string}</p>
            </div>
          );
        })}
      </section>
    </Page>
  );
}
