import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · SmartServe AI" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/dashboard" });
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your SmartServe workspace."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Get started
          </Link>
        </>
      }
    >
      <form onSubmit={signIn} className="space-y-4">
        <Button
          type="button"
          onClick={google}
          disabled={busy}
          variant="outline"
          className="w-full h-11 rounded-xl gap-2"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-2 3.2-4.8 3.2-7.9z" />
            <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.2 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8C4 20.9 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M6 13.4c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.2H2.3C1.5 7.7 1 9.5 1 11.2s.5 3.5 1.3 5l3.7-2.8z" />
            <path fill="#EA4335" d="M12 5c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 1.8 14.9.8 12 .8 7.7.8 4 3 2.3 6.2L6 9c.9-2.5 3.2-4 6-4z" />
          </svg>
          Continue with Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative text-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">or</span>
          </div>
        </div>
        <div>
          <Label htmlFor="e">Email</Label>
          <Input
            id="e"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@restaurant.com"
            className="mt-2 h-11 rounded-xl"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="p">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <Input
            id="p"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2 h-11 rounded-xl"
          />
        </div>
        <Button type="submit" variant="hero" disabled={busy} className="w-full h-11 rounded-xl">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
