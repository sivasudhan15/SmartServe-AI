import { createFileRoute } from "@tanstack/react-router";
import { ChefHat, Clock, Flame, Check, Timer } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_app/kitchen")({
  head: () => ({ meta: [{ title: "Kitchen · SmartServe AI" }] }),
  component: Kitchen,
});

type Ticket = {
  id: string; table: string; items: { name: string; qty: number; note?: string }[];
  status: "queued" | "cooking" | "ready"; priority?: boolean; elapsed: number; target: number;
};

const tickets: Ticket[] = [
  { id: "#2847", table: "T12", items: [{ name: "Truffle Pasta", qty: 2 }, { name: "Caesar Salad", qty: 1, note: "no anchovy" }], status: "cooking", priority: true, elapsed: 8, target: 18 },
  { id: "#2848", table: "T04", items: [{ name: "Wagyu Burger", qty: 1, note: "med rare" }, { name: "Fries", qty: 2 }], status: "cooking", elapsed: 12, target: 20 },
  { id: "#2849", table: "T08", items: [{ name: "Margherita", qty: 1 }, { name: "Bruschetta", qty: 1 }], status: "queued", elapsed: 0, target: 14 },
  { id: "#2850", table: "T15", items: [{ name: "Salmon Teriyaki", qty: 2 }], status: "queued", elapsed: 0, target: 22 },
  { id: "#2851", table: "T02", items: [{ name: "Tiramisu", qty: 2 }, { name: "Espresso", qty: 2 }], status: "ready", elapsed: 5, target: 5 },
  { id: "#2852", table: "T09", items: [{ name: "Mushroom Risotto", qty: 1 }], status: "ready", elapsed: 25, target: 25 },
];

function Column({ title, color, tickets: t }: { title: string; color: string; tickets: Ticket[] }) {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center gap-2 px-1">
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">· {t.length}</div>
      </div>
      <div className="space-y-3">
        {t.map((tk) => <TicketCard key={tk.id} t={tk} />)}
      </div>
    </div>
  );
}

function TicketCard({ t }: { t: Ticket }) {
  const pct = Math.min(100, (t.elapsed / t.target) * 100);
  const overdue = t.elapsed > t.target;
  return (
    <Card className={`p-4 rounded-2xl border-border/60 shadow-card hover:shadow-elegant transition-all ${t.priority ? "ring-2 ring-amber/50" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{t.id}</span>
          <Badge variant="outline" className="rounded-full text-[10px]">{t.table}</Badge>
          {t.priority && (
            <Badge className="rounded-full bg-amber/15 text-amber border-amber/30 gap-1 text-[10px]">
              <Flame className="h-3 w-3" /> Priority
            </Badge>
          )}
        </div>
        <div className={`text-xs font-semibold flex items-center gap-1 ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
          <Timer className="h-3 w-3" /> {t.elapsed}/{t.target}m
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {t.items.map((i, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <div>
              <span className="font-medium">{i.qty}× {i.name}</span>
              {i.note && <span className="ml-2 text-xs text-muted-foreground italic">({i.note})</span>}
            </div>
          </li>
        ))}
      </ul>
      {t.status === "cooking" && (
        <div className="mt-3">
          <Progress value={pct} className="h-1.5" />
        </div>
      )}
      <div className="mt-3 flex gap-2">
        {t.status === "queued" && <Button variant="hero" size="sm" className="w-full"><Flame className="h-3.5 w-3.5" /> Start</Button>}
        {t.status === "cooking" && <Button variant="hero" size="sm" className="w-full"><Check className="h-3.5 w-3.5" /> Mark ready</Button>}
        {t.status === "ready" && <Button variant="outline" size="sm" className="w-full text-success border-success/40 hover:bg-success/10"><Check className="h-3.5 w-3.5" /> Served</Button>}
      </div>
    </Card>
  );
}

function Kitchen() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Kitchen Display"
        subtitle="Real-time ticket queue across all stations."
        actions={
          <div className="flex items-center gap-4">
            <div className="text-xs">
              <span className="text-muted-foreground">Avg time · </span>
              <span className="font-bold">14m</span>
            </div>
            <Badge className="rounded-full bg-success/10 text-success border-success/30 gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Kitchen live
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "In queue", value: tickets.filter(t => t.status === "queued").length, icon: Clock, color: "text-muted-foreground bg-muted" },
          { label: "Cooking", value: tickets.filter(t => t.status === "cooking").length, icon: Flame, color: "text-amber bg-amber/10" },
          { label: "Ready", value: tickets.filter(t => t.status === "ready").length, icon: Check, color: "text-success bg-success/10" },
          { label: "Priority", value: tickets.filter(t => t.priority).length, icon: ChefHat, color: "text-primary bg-primary/10" },
        ].map((s) => (
          <Card key={s.label} className="p-4 rounded-2xl border-border/60 shadow-card flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl grid place-items-center ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Column title="Queued" color="bg-muted-foreground/40" tickets={tickets.filter(t => t.status === "queued")} />
        <Column title="Cooking" color="bg-amber" tickets={tickets.filter(t => t.status === "cooking")} />
        <Column title="Ready" color="bg-success" tickets={tickets.filter(t => t.status === "ready")} />
      </div>
    </div>
  );
}
