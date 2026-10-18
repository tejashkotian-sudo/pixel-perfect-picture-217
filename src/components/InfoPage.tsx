import type { ReactNode } from "react";
import { Page } from "./site";

export function InfoPage({ title, kn, children }: { title: string; kn: string; children: ReactNode }) {
  return (
    <Page>
      <div className="max-w-2xl">
        <p className="kn text-saffron">{kn}</p>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </Page>
  );
}
