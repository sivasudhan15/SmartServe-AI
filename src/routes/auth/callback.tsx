import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Authenticating · SmartServe AI" }] }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Verifying Google sign-in…");

  useEffect(() => {
    let handled = false;

    const processAuthCallback = async () => {
      if (handled) return;
      handled = true;

      try {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;

        // Check for error parameters returned from OAuth provider
        const error = searchParams.get("error") || searchParams.get("error_code");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          console.error("[OAuth Callback Error]", error, errorDescription);
          toast.error(errorDescription || "Google sign-in was cancelled or failed.");
          navigate({ to: "/login" });
          return;
        }

        // If PKCE authorization code is present in URL query params
        const code = searchParams.get("code");
        if (code) {
          setStatusMessage("Exchanging authorization code…");
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("[PKCE Exchange Error]", exchangeError);
            toast.error(exchangeError.message || "Failed to verify OAuth session.");
            navigate({ to: "/login" });
            return;
          }
        }

        // Retrieve active session after code exchange or hash fragment parse
        setStatusMessage("Loading user profile…");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.error("[Session Check Error]", sessionError);
          toast.error("Could not complete authentication. Please try logging in again.");
          navigate({ to: "/login" });
          return;
        }

        const user = session.user;
        const userMeta = user.user_metadata || {};

        // Ensure user metadata role and names are initialized for OAuth users
        if (!userMeta.role || !userMeta.first_name) {
          setStatusMessage("Initializing account settings…");
          const fullName = (userMeta.full_name as string) || (userMeta.name as string) || "";
          const nameParts = fullName.trim().split(" ");
          const firstName = userMeta.first_name || nameParts[0] || "User";
          const lastName = userMeta.last_name || nameParts.slice(1).join(" ") || "";
          const role = userMeta.role || "owner";

          await supabase.auth.updateUser({
            data: {
              role,
              first_name: firstName,
              last_name: lastName,
            },
          });
        }

        toast.success("Successfully signed in with Google!");
        navigate({ to: "/dashboard" });
      } catch (err: unknown) {
        console.error("[OAuth Callback Exception]", err);
        toast.error("An unexpected error occurred during Google sign-in.");
        navigate({ to: "/login" });
      }
    };

    processAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border/60 bg-card shadow-card text-center space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-foreground">{statusMessage}</p>
          <p className="text-xs text-muted-foreground">Please wait while we redirect you to your workspace.</p>
        </div>
      </div>
    </div>
  );
}
