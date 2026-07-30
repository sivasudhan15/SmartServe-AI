import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  ChefHat,
  ChartLine,
  Sparkles,
  Utensils,
  Boxes,
  Bell,
  Users,
  ShieldCheck,
  Check,
  Star,
  Zap,
  Clock,
  TrendingUp,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { DashboardMockup } from "@/components/landing/DashboardMockup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartServe AI — The AI Operating System for Modern Restaurants" },
      {
        name: "description",
        content:
          "AI-powered restaurant OS: analytics, live kitchens, predictive inventory, digital menus, and customer intelligence in one beautiful platform.",
      },
      { property: "og:title", content: "SmartServe AI — The AI Operating System for Modern Restaurants" },
      {
        property: "og:description",
        content:
          "AI-powered restaurant OS: analytics, live kitchens, predictive inventory, digital menus, and customer intelligence in one beautiful platform.",
      },
    ],
  }),
  component: Landing,
});

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    { href: "#features", label: "Features" },
    { href: "#ai", label: "AI" },
    { href: "#workflow", label: "Workflow" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-4 transition-all ${
          scrolled ? "" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all ${
            scrolled ? "glass-strong shadow-card" : ""
          }`}
        >
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/signup">
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <div className="md:hidden mt-2 rounded-2xl glass-strong p-3 animate-fade-up">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button variant="hero" size="sm" className="flex-1" asChild>
                <Link to="/signup">Get started</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-70 pointer-events-none" />
      <div
        className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse at center top, black 30%, transparent 70%)",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_60%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_60%,transparent)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <div className="animate-fade-up">
          <Badge
            variant="outline"
            className="glass rounded-full px-3.5 py-1.5 text-xs font-medium gap-1.5"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            Now with GPT-powered restaurant insights
          </Badge>
        </div>
        <h1
          className="mt-6 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] animate-fade-up"
          style={{ animationDelay: "60ms" }}
        >
          The AI Operating System <br className="hidden sm:block" />
          for <span className="text-gradient">Modern Restaurants</span>
        </h1>
        <p
          className="mt-6 mx-auto max-w-2xl text-base md:text-lg text-muted-foreground animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          Run smarter kitchens, delight customers, and predict demand — all from one
          beautifully designed platform trusted by high-performing restaurants worldwide.
        </p>
        <div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up"
          style={{ animationDelay: "180ms" }}
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/signup">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="glass" size="xl" asChild>
            <a href="#features">Explore features</a>
          </Button>
        </div>
        <div
          className="mt-4 text-xs text-muted-foreground animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          No credit card required · 14-day trial · Cancel anytime
        </div>

        <div
          className="relative mt-16 md:mt-20 animate-fade-up"
          style={{ animationDelay: "280ms" }}
        >
          <div className="absolute -inset-6 md:-inset-10 bg-gradient-primary opacity-20 blur-3xl rounded-[3rem]" />
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  const brands = [
    "OLIVA & CO",
    "TOKYO SUSHI",
    "URBAN GRILL",
    "SAFRÓN",
    "NORTH BREW",
    "CASA VERDE",
  ];
  return (
    <section className="py-16 border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by 12,000+ restaurants across 40+ countries
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
          {brands.map((b) => (
            <div
              key={b}
              className="text-center text-sm font-bold tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Utensils,
    title: "Digital Menu & QR Ordering",
    desc: "Beautiful menus, real-time availability, and contactless ordering that customers actually love.",
  },
  {
    icon: ChefHat,
    title: "Live Kitchen Display",
    desc: "Prioritized ticket queues, cooking timers, and station routing built for peak-hour chaos.",
  },
  {
    icon: Boxes,
    title: "Predictive Inventory",
    desc: "Never run out again. AI forecasts stock needs, flags waste, and auto-generates purchase orders.",
  },
  {
    icon: ChartLine,
    title: "Real-time Analytics",
    desc: "Revenue, table turnover, item performance — all streamed live to gorgeous dashboards.",
  },
  {
    icon: Users,
    title: "Customer Intelligence",
    desc: "Loyalty, preferences, and sentiment analysis so every guest feels like a regular.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    desc: "SOC 2 Type II, role-based access, and audit trails ready for multi-branch operations.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="rounded-full">Platform</Badge>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            Everything you need to run a <span className="text-gradient">world-class restaurant.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            One platform. Every workflow. From front-of-house to inventory — SmartServe replaces
            the messy stack you're duct-taping together today.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className="group relative p-6 rounded-2xl border-border/60 hover:border-primary/40 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-10 blur-2xl transition-opacity" />
              <div className="relative">
                <div className="h-11 w-11 rounded-xl bg-gradient-primary/10 border border-primary/20 grid place-items-center text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function AISection() {
  const ai = [
    { icon: Bot, title: "AI Assistant", desc: "Ask anything: 'Why are Tuesday sales dipping?' Get answers with data." },
    { icon: TrendingUp, title: "Demand Forecast", desc: "Hyperlocal heatmaps predict tomorrow's rush per dish." },
    { icon: Sparkles, title: "Smart Recommendations", desc: "Dish suggestions personalized to each returning guest." },
    { icon: Zap, title: "Waste Prediction", desc: "Cut spoilage by up to 34% with prep-window intelligence." },
  ];
  return (
    <section id="ai" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Badge className="rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              <Sparkles className="h-3 w-3 mr-1" /> Powered by AI
            </Badge>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              An AI that <span className="text-gradient">actually runs</span> your restaurant.
            </h2>
            <p className="mt-4 text-muted-foreground">
              SmartServe's proprietary Restaurant Intelligence Engine learns your operation,
              predicts your needs, and quietly automates the busywork — so your team can focus on
              hospitality.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {ai.map((a) => (
                <div
                  key={a.title}
                  className="glass rounded-2xl p-4 flex gap-3 hover:shadow-elegant transition-all"
                >
                  <div className="shrink-0 h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-elegant">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AIChatPreview />
        </div>
      </div>
    </section>
  );
}

function AIChatPreview() {
  return (
    <div className="relative animate-fade-up">
      <div className="absolute -inset-4 bg-gradient-accent opacity-25 blur-3xl rounded-3xl" />
      <Card className="relative rounded-3xl border-border/60 shadow-elegant p-1 overflow-hidden">
        <div className="rounded-[calc(var(--radius)+8px)] bg-card">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">SmartServe Assistant</div>
              <div className="text-[11px] text-success flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Online
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3 min-h-[320px]">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5 text-sm">
                Why are sales lower this Tuesday?
              </div>
            </div>
            <div className="flex gap-2">
              <div className="shrink-0 h-7 w-7 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="max-w-[85%] space-y-2">
                <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-2.5 text-sm">
                  Tuesday sales are down 12% vs your 4-week avg. Key drivers:
                </div>
                <div className="rounded-2xl bg-muted px-4 py-3 text-sm space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lunch traffic</span>
                    <span className="font-semibold text-destructive">-18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg ticket size</span>
                    <span className="font-semibold text-success">+4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weather (rain)</span>
                    <span className="font-semibold text-amber">Impact</span>
                  </div>
                </div>
                <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-2.5 text-sm">
                  💡 Suggestion: push a 20% rainy-day combo via SMS to your top 200 loyal
                  customers. Est. +$1,240 recovery.
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-muted-foreground flex items-center justify-between">
              Ask about your restaurant…
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border">⏎</kbd>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Workflow() {
  const steps = [
    { icon: Utensils, title: "Order Placed", desc: "QR menu or waiter tablet — orders sync instantly." },
    { icon: ChefHat, title: "Kitchen Fires", desc: "KDS routes tickets by station with cook timers." },
    { icon: Bell, title: "Ready & Served", desc: "Runners notified. Guests updated live." },
    { icon: ChartLine, title: "AI Learns", desc: "Every service improves your forecasts." },
  ];
  return (
    <section id="workflow" className="py-24 md:py-32 bg-muted/30 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Badge variant="secondary" className="rounded-full">Workflow</Badge>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            From order to insight — <span className="text-gradient">in seconds.</span>
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-4 gap-4 relative">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="relative mx-auto h-16 w-16 rounded-2xl bg-gradient-primary shadow-elegant grid place-items-center text-primary-foreground animate-float" style={{ animationDelay: `${i * 300}ms` }}>
                <s.icon className="h-7 w-7" />
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-card border border-border grid place-items-center text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "SmartServe cut our food waste by 31% in the first quarter. It's like hiring an operations analyst who never sleeps.",
      name: "Maria Alvarez",
      role: "Owner, Casa Verde",
    },
    {
      quote:
        "The kitchen display alone is worth it. Our ticket times dropped from 14 to 9 minutes during Friday rush.",
      name: "Kenji Tanaka",
      role: "Head Chef, Tokyo Sushi",
    },
    {
      quote:
        "Beautiful, fast, and our staff learned it in an hour. Feels like Linear for restaurants.",
      name: "David Okonkwo",
      role: "COO, Urban Grill Group",
    },
  ];
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="rounded-full">Loved by operators</Badge>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            Restaurants that switched <span className="text-gradient">never went back.</span>
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <Card
              key={t.name}
              className="p-6 rounded-2xl border-border/60 shadow-card hover:shadow-elegant transition-all"
            >
              <div className="flex gap-0.5 text-amber">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-[15px] leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "$49",
      desc: "For single-location restaurants finding their feet.",
      features: ["Digital menu & QR", "Order & table management", "Basic analytics", "Email support"],
    },
    {
      name: "Growth",
      price: "$149",
      desc: "For growing restaurants ready to scale operations.",
      featured: true,
      features: [
        "Everything in Starter",
        "AI Assistant & Insights",
        "Predictive Inventory",
        "Kitchen Display System",
        "Loyalty & CRM",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For multi-branch groups and franchise operations.",
      features: [
        "Everything in Growth",
        "Multi-branch dashboards",
        "SSO & audit logs",
        "Custom AI models",
        "Dedicated success manager",
      ],
    },
  ];
  return (
    <section id="pricing" className="py-24 md:py-32 bg-muted/30 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Badge variant="secondary" className="rounded-full">Pricing</Badge>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            Simple pricing. <span className="text-gradient">Serious ROI.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free for 14 days. No credit card needed.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5 items-stretch">
          {tiers.map((t) => (
            <Card
              key={t.name}
              className={`relative p-7 rounded-2xl transition-all ${
                t.featured
                  ? "border-primary/50 shadow-elegant scale-[1.02] bg-card"
                  : "border-border/60 shadow-card hover:shadow-elegant"
              }`}
            >
              {t.featured && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground border-0 shadow-elegant">
                  Most popular
                </Badge>
              )}
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight">{t.price}</span>
                {t.price.startsWith("$") && (
                  <span className="text-sm text-muted-foreground">/mo</span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <Button
                variant={t.featured ? "hero" : "outline"}
                className="w-full mt-6"
                asChild
              >
                <Link to="/signup">Get started</Link>
              </Button>
              <div className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 rounded-full bg-primary/15 text-primary grid place-items-center">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Do I need special hardware?",
      a: "No. SmartServe runs in any modern browser. Bring your own tablets, printers, and POS — we integrate with the majors.",
    },
    {
      q: "How long is the setup?",
      a: "Most single-location restaurants are live within an hour. Multi-branch onboarding takes 1–2 days with our concierge team.",
    },
    {
      q: "Is my data secure?",
      a: "Yes. We're SOC 2 Type II certified with role-based access, encryption in transit and at rest, and full audit trails.",
    },
    {
      q: "Can I try before I buy?",
      a: "Absolutely. 14 days free, no credit card. You can cancel anytime and export all your data.",
    },
  ];
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <Badge variant="secondary" className="rounded-full">FAQ</Badge>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            Questions? <span className="text-gradient">Answered.</span>
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`i-${i}`}
              className="rounded-2xl border border-border/60 bg-card px-5 shadow-card"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-gradient-primary" />
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-primary-foreground">
              Ready to run a smarter restaurant?
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
              Join thousands of operators using SmartServe to grow revenue, cut waste, and delight
              guests every single service.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="xl" variant="glass" className="text-primary-foreground border-white/30" asChild>
                <Link to="/signup">Start free trial <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="xl" variant="ghost" className="text-primary-foreground hover:bg-white/10" asChild>
                <a href="#pricing">See pricing</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "AI", "Pricing", "Changelog", "Roadmap"] },
    { title: "Company", links: ["About", "Careers", "Press", "Partners", "Contact"] },
    { title: "Resources", links: ["Docs", "Blog", "Case Studies", "Community", "Status"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA", "Cookies"] },
  ];
  return (
    <footer className="border-t border-border/60 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-6 gap-10">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              The AI Operating System for Modern Restaurants. Built with love in San Francisco.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> All systems operational
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {c.title}
              </div>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} SmartServe AI, Inc. All rights reserved.</div>
          <div>Made for restaurants that give a damn.</div>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-dvh bg-background">
      <Nav />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <AISection />
        <Workflow />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
