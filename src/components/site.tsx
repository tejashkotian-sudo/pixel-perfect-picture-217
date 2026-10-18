import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Volume2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { speak } from "@/lib/data";
import type { Phrase } from "@/lib/curriculum";

const NAV = [
  { to: "/learn", label: "Learn" },
  { to: "/practice", label: "Real-Life Practice" },
  { to: "/progress", label: "Progress" },
  { to: "/about", label: "About" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
      <span className="kn grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">ಕ</span>
      Kannada Connect
    </Link>
  );
}

export function SiteHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
              {n.label}
            </Link>
          ))}
          {user ? (
            <Button asChild variant="hero" size="sm"><Link to="/dashboard">My dashboard</Link></Button>
          ) : (
            <Button asChild variant="hero" size="sm"><Link to="/auth">Log in</Link></Button>
          )}
        </nav>
        <button className="md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-muted">{n.label}</Link>
          ))}
          <Link to={user ? "/dashboard" : "/auth"} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 font-medium text-primary">
            {user ? "My dashboard" : "Log in"}
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">Learn Kannada. Live Confidently.</p>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm text-muted-foreground" aria-label="Footer">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/help" className="hover:text-foreground">Help</Link>
        </nav>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SpeakButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={`Listen to ${text}`}
      className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground hover:bg-saffron/40"
    >
      <Volume2 className="size-4" />
    </button>
  );
}

export function PhraseRow({ p }: { p: Phrase }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <SpeakButton text={p.kn} />
      <div className="min-w-0">
        <div className="kn text-xl font-semibold text-primary">{p.kn}</div>
        <div className="text-sm italic text-muted-foreground">{p.tr}</div>
      </div>
      <div className="ml-auto text-right text-sm">{p.en}</div>
    </div>
  );
}
