import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="relative h-8 w-8 rounded-xl bg-gradient-primary shadow-elegant grid place-items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative h-4 w-4 text-primary-foreground"
          aria-hidden="true"
        >
          <path
            d="M4 7c0-1.5 1-3 3-3h10c2 0 3 1.5 3 3v2H4V7z"
            fill="currentColor"
            opacity="0.9"
          />
          <path d="M4 10h16v2c0 4-3 7-8 7s-8-3-8-7v-2z" fill="currentColor" />
          <circle cx="12" cy="14" r="1.5" fill="var(--primary)" />
        </svg>
      </div>
      {showText && (
        <span className="text-[15px] font-bold tracking-tight">
          SmartServe<span className="text-gradient"> AI</span>
        </span>
      )}
    </Link>
  );
}
