import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Kannada Connect" },
      { name: "description", content: "Why Kannada Connect exists and who it is for." },
      { property: "og:title", content: "About — Kannada Connect" },
      { property: "og:description", content: "Why Kannada Connect exists and who it is for." },
    ],
  }),
  component: () => (
    <InfoPage title="About" kn="ನಮ್ಮ ಬಗ್ಗೆ">
      <p>Kannada Connect helps students, professionals, tourists and new residents speak practical Kannada in everyday situations — travelling, shopping, eating out, visiting a doctor, studying and working.</p><p>Instead of grammar-heavy lessons, you learn short, useful phrases with Kannada script, transliteration and English meaning, then practise them in quizzes and real-life conversations.</p>
    </InfoPage>
  ),
});
