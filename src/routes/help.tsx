import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Kannada Connect" },
      { name: "description", content: "Answers to common Kannada Connect questions." },
      { property: "og:title", content: "Help — Kannada Connect" },
      { property: "og:description", content: "Answers to common Kannada Connect questions." },
    ],
  }),
  component: () => (
    <InfoPage title="Help" kn="ಸಹಾಯ">
      <p><strong className="text-foreground">How do points work?</strong> Each correct quiz answer earns 10 points.</p><p><strong className="text-foreground">How is my streak counted?</strong> Complete at least one lesson or daily challenge each day. Missing a full day resets it.</p><p><strong className="text-foreground">I can't hear audio.</strong> Tap the speaker on any phrase. If your device has a Kannada voice, you’ll hear the script; otherwise we speak the transliteration slowly in an Indian English voice. Chrome or Edge works best. Click the speaker again to stop.</p><p><strong className="text-foreground">Forgot your password?</strong> Use “Forgot password?” on the login page.</p>
    </InfoPage>
  ),
});
