import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Kannada Connect" },
      { name: "description", content: "Answers to common Kannada Connect questions." },
      { property: "og:title", content: "Help — Kannada Connect" },
      { property: "og:description", content: "Answers to common Kannada Connect questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <InfoPage title="Help" kn="ಸಹಾಯ">
      <p><strong className="text-foreground">How do points work?</strong> Each correct quiz answer earns 10 points.</p><p><strong className="text-foreground">How is my streak counted?</strong> Complete at least one lesson or daily challenge each day. Missing a full day resets it.</p><p><strong className="text-foreground">I can't hear audio.</strong> Audio uses your browser's speech voice. Some devices don't include a Kannada voice — try Chrome on Android or desktop.</p><p><strong className="text-foreground">Forgot your password?</strong> Use “Forgot password?” on the login page.</p>
    </InfoPage>
  ),
});
