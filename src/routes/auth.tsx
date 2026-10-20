import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { mode?: "signup" } => (s["mode"] === "signup" ? { mode: "signup" } : {}),
  head: () => ({
    meta: [
      { title: "Log in or sign up — Kannada Connect" },
      { name: "description", content: "Create a free Kannada Connect account to save your learning progress." },
      { property: "og:title", content: "Log in — Kannada Connect" },
      { property: "og:description", content: "Save your Kannada learning progress." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function AuthPage() {
  const { mode: initial } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initial === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (mode === "forgot") {
      const r = z.string().email().safeParse(email.trim());
      if (!r.success) return setErrors({ email: "Enter a valid email" });
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
      setBusy(false);
      return error ? toast.error(error.message) : toast.success("Check your email for a reset link.");
    }
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      return setErrors(errs);
    }
    setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: window.location.origin + "/dashboard", data: { display_name: name.trim() || undefined } },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      if (!data.session) toast.success("Account created! Check your email to confirm, then log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      setBusy(false);
      if (error) return toast.error(error.message === "Invalid login credentials" ? "Incorrect email or password." : error.message);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error("Google sign-in failed. Please try again.");
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="surface p-7">
          <h1 className="text-2xl font-semibold">
            {mode === "signup" ? "Create your free account" : mode === "forgot" ? "Reset your password" : "Welcome back"}
          </h1>
          <p className="kn mt-1 text-sm text-muted-foreground">{mode === "signup" ? "ಸ್ವಾಗತ — welcome!" : "ನಮಸ್ಕಾರ"}</p>
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!errors["email"]} />
              {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
            </div>
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} aria-invalid={!!errors["password"]} />
                {errors["password"] && <p className="text-xs text-destructive">{errors["password"]}</p>}
              </div>
            )}
            <Button type="submit" variant="hero" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Log in"}
            </Button>
          </form>
          {mode !== "forgot" && (
            <>
              <div className="my-4 text-center text-xs text-muted-foreground">or</div>
              <Button variant="soft" className="w-full" onClick={google}>Continue with Google</Button>
            </>
          )}
          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
            {mode === "login" && (
              <>
                <button className="text-primary underline" onClick={() => setMode("signup")}>New here? Create an account</button>
                <button className="text-muted-foreground underline" onClick={() => setMode("forgot")}>Forgot password?</button>
              </>
            )}
            {mode !== "login" && <button className="text-primary underline" onClick={() => setMode("login")}>Already have an account? Log in</button>}
            <Link to="/" className="text-muted-foreground">← Back home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
