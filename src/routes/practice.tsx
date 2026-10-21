import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site";
import { Conversation } from "@/components/Conversation";
import { SCENARIOS } from "@/lib/curriculum";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Real-life Kannada conversations — Kannada Connect" },
      { name: "description", content: "Practise Kannada in interactive scenarios: auto rides, cafés and pharmacies." },
      { property: "og:title", content: "Real-Life Practice — Kannada Connect" },
      { property: "og:description", content: "Interactive Kannada conversation scenarios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <Page>
      <h1 className="text-4xl font-semibold">Real-life practice</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">Sample conversations you'll meet in Karnataka. Choose the right reply to move forward — wrong answers explain why.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {SCENARIOS.map((s) => <Conversation key={s.id} scenario={s} />)}
      </div>
    </Page>
  ),
});
