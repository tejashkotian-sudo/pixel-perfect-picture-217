import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Kannada Connect" },
      { name: "description", content: "How Kannada Connect handles your data." },
      { property: "og:title", content: "Privacy — Kannada Connect" },
      { property: "og:description", content: "How Kannada Connect handles your data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <InfoPage title="Privacy" kn="ಗೌಪ್ಯತೆ">
      <p>We store only what's needed to run your account: your email, name, learning preferences, completed lessons and quiz answers.</p><p>Your progress is private to you and protected so other users cannot read it. Passwords are never stored in plain text. We don't sell your data.</p>
    </InfoPage>
  ),
});
