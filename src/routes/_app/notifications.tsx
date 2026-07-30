import { createFileRoute } from "@tanstack/react-router";
import { Bell, ShoppingBag, ChefHat, Boxes, Sparkles, Star } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications · SmartServe AI" }] }),
  component: Notifications,
});

const items = [
  { icon: Boxes, title: "Truffle oil critically low", body: "Only 2 bottles remain — 45 servings at risk.", priority: "high", time: "8m ago", color: "destructive" },
  { icon: Sparkles, title: "New AI insight ready", body: "Promote Truffle Pasta tonight for +$1,240.", priority: "medium", time: "22m ago", color: "primary" },
  { icon: ShoppingBag, title: "Large order placed", body: "Table 12 · $234.80 · 8 items.", priority: "low", time: "34m ago", color: "teal" },
  { icon: Star, title: "New 5-star review", body: "\"Best truffle pasta in the city\" — J. Chen", priority: "low", time: "1h ago", color: "amber" },
  { icon: ChefHat, title: "Kitchen ticket overdue", body: "Ticket #2844 · 8 min over target time.", priority: "medium", time: "1h ago", color: "amber" },
  { icon: Bell, title: "Staff clocked in", body: "Alex R. started shift.", priority: "low", time: "2h ago", color: "muted-foreground" },
];

const priorityMap = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-amber text-amber-foreground",
  low: "bg-muted text-muted-foreground",
} as const;

function Notifications() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="All the alerts, insights, and updates from your operation."
        actions={<Button variant="outline" size="sm">Mark all read</Button>}
      />

      <div className="flex gap-2">
        {["All", "Unread", "Alerts", "Insights", "Kitchen"].map((f, i) => (
          <button key={f} className={`px-4 py-2 rounded-full text-sm ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-muted-foreground"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((n, i) => {
          const colors: Record<string, string> = {
            destructive: "bg-destructive/10 text-destructive",
            primary: "bg-primary/10 text-primary",
            teal: "bg-teal/10 text-teal",
            amber: "bg-amber/10 text-amber",
            "muted-foreground": "bg-muted text-muted-foreground",
          };
          return (
            <Card key={i} className="p-5 rounded-2xl border-border/60 shadow-card hover:shadow-elegant transition-all flex gap-4">
              <div className={`h-11 w-11 rounded-xl grid place-items-center shrink-0 ${colors[n.color]}`}>
                <n.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-semibold">{n.title}</div>
                  <Badge className={`rounded-full text-[10px] uppercase ${priorityMap[n.priority as keyof typeof priorityMap]}`}>{n.priority}</Badge>
                  <span className="text-xs text-muted-foreground ml-auto">{n.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
