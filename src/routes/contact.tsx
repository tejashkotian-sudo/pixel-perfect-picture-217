import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Kannada Connect" },
      { name: "description", content: "Get in touch with the Kannada Connect team." },
      { property: "og:title", content: "Contact — Kannada Connect" },
      { property: "og:description", content: "Get in touch with the Kannada Connect team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <InfoPage title="Contact" kn="ಸಂಪರ್ಕಿಸಿ">
      <p>Have feedback, found a phrase that could be improved, or want to suggest a new situation? We'd love to hear from you.</p><p>Email: <span className="text-foreground">hello@kannadaconnect.example</span> (placeholder — replace with your real address).</p>
    </InfoPage>
  ),
});
