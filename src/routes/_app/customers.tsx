import { createFileRoute } from "@tanstack/react-router";
import { Search, Star, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/customers")({
  head: () => ({ meta: [{ title: "Customers · SmartServe AI" }] }),
  component: Customers,
});

const customers = [
  { name: "Maria Alvarez", visits: 24, spend: "$2,140", loyalty: "Gold", last: "2 days ago" },
  { name: "James Chen", visits: 18, spend: "$1,820", loyalty: "Gold", last: "1 week ago" },
  { name: "Priya Patel", visits: 12, spend: "$980", loyalty: "Silver", last: "3 days ago" },
  { name: "David Kim", visits: 9, spend: "$720", loyalty: "Silver", last: "yesterday" },
  { name: "Sofia Rossi", visits: 6, spend: "$490", loyalty: "Bronze", last: "5 days ago" },
  { name: "Ahmed Hassan", visits: 15, spend: "$1,340", loyalty: "Gold", last: "today" },
];

const loyaltyMap = {
  Gold: "bg-amber/15 text-amber border-amber/30",
  Silver: "bg-muted-foreground/15 text-foreground border-border",
  Bronze: "bg-teal/15 text-teal border-teal/30",
} as const;

function Customers() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Know every guest. Build every relationship."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total customers", value: "3,412" },
          { label: "Loyalty members", value: "1,208" },
          { label: "Avg lifetime value", value: "$482" },
          { label: "Repeat rate", value: "68%" },
        ].map((s) => (
          <Card key={s.label} className="p-5 rounded-2xl border-border/60 shadow-card">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-2xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-success flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +8%</div>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search customers…" className="pl-9 h-11 rounded-xl" />
      </div>

      <Card className="rounded-2xl border-border/60 shadow-card overflow-hidden">
        {customers.map((c, i) => (
          <div key={c.name} className={`p-5 flex items-center gap-4 hover:bg-accent/40 transition-colors ${i > 0 ? "border-t border-border/60" : ""}`}>
            <div className="h-11 w-11 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm shrink-0">
              {c.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-medium truncate">{c.name}</div>
                <Badge variant="outline" className={`rounded-full text-[10px] ${loyaltyMap[c.loyalty as keyof typeof loyaltyMap]}`}>
                  <Star className="h-2.5 w-2.5 mr-0.5 fill-current" /> {c.loyalty}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.visits} visits · last: {c.last}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold">{c.spend}</div>
              <div className="text-xs text-muted-foreground">lifetime</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
