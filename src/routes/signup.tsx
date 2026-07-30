import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ChefHat, Utensils, Store, ShieldCheck, Bike, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Get started · SmartServe AI" }] }),
  component: Signup,
});

const roles = [
  { id: "owner", label: "Owner", icon: Store },
  { id: "manager", label: "Manager", icon: ShieldCheck },
  { id: "chef", label: "Chef", icon: ChefHat },
  { id: "waiter", label: "Waiter", icon: Utensils },
  { id: "customer", label: "Customer", icon: User },
  { id: "admin", label: "Admin", icon: Bike },
];

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("owner");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, role },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/dashboard" });
    } else {
      toast.success("Check your email to confirm your account.");
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: redirectUri,
      });

      if (result.error) {
        setBusy(false);
        toast.error(result.error.message || "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      setBusy(false);
      const errMsg = err instanceof Error ? err.message : String(err);
      toast.error(errMsg || "An unexpected error occurred during Google sign-in");
    }
  };

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Start your 14-day free trial. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Button
          type="button"
          onClick={google}
          disabled={busy}
          variant="outline"
          className="w-full h-11 rounded-xl gap-2"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-2 3.2-4.8 3.2-7.9z" />
              <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.2 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8C4 20.9 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M6 13.4c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.2H2.3C1.5 7.7 1 9.5 1 11.2s.5 3.5 1.3 5l3.7-2.8z" />
              <path fill="#EA4335" d="M12 5c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 1.8 14.9.8 12 .8 7.7.8 4 3 2.3 6.2L6 9c.9-2.5 3.2-4 6-4z" />
            </svg>
          )}
          {busy ? "Connecting to Google…" : "Continue with Google"}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative text-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">or</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fn">First name</Label>
            <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-2 h-11 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="ln">Last name</Label>
            <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-2 h-11 rounded-xl" />
          </div>
        </div>
        <div>
          <Label htmlFor="em">Work email</Label>
          <Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11 rounded-xl" />
        </div>
        <div>
          <Label htmlFor="pw">Password</Label>
          <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-11 rounded-xl" />
        </div>
        <div>
          <Label>I am a…</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  role === r.id
                    ? "border-primary bg-primary/10 text-primary shadow-elegant"
                    : "border-border/60 hover:border-primary/30"
                }`}
              >
                <r.icon className="h-4 w-4" />
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" variant="hero" disabled={busy} className="w-full h-11 rounded-xl">
          {busy ? "Creating…" : "Create workspace"}
        </Button>
        <p className="text-[11px] text-center text-muted-foreground">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}
