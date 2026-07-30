import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Sparkles } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col p-6 md:p-10">
        <Logo />
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-sm animate-fade-up">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-sm text-center text-muted-foreground">{footer}</div>}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Back to home</Link>
        </div>
      </div>

      {/* Visual side */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-primary items-center justify-center p-10">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-md text-primary-foreground">
          <div className="inline-flex items-center gap-2 rounded-full glass-strong bg-white/10 px-3 py-1.5 text-xs backdrop-blur border-white/20">
            <Sparkles className="h-3 w-3" /> Powered by AI
          </div>
          <h2 className="mt-6 text-4xl font-black tracking-tight leading-tight">
            The AI Operating System for Modern Restaurants.
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Join 12,000+ restaurants running smarter with SmartServe.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { v: "34%", l: "less waste" },
              { v: "22%", l: "revenue growth" },
              { v: "9m", l: "faster tickets" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl glass-strong bg-white/10 border-white/20 p-4 backdrop-blur">
                <div className="text-2xl font-black">{s.v}</div>
                <div className="text-xs text-primary-foreground/80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
