import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, TrendingDown, Package, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BarTrend } from "@/components/dashboard/Charts";

export const Route = createFileRoute("/_app/inventory")({
  head: () => ({ meta: [{ title: "Inventory · SmartServe AI" }] }),
  component: Inventory,
});

const items = [
  { name: "Truffle oil", stock: 2, max: 20, unit: "bottles", supplier: "Piedmont Co.", expiry: "12 days", low: true },
  { name: "Wagyu beef", stock: 18, max: 40, unit: "kg", supplier: "Kobe Direct", expiry: "5 days", low: false },
  { name: "Mozzarella", stock: 6, max: 30, unit: "kg", supplier: "Napoli Farms", expiry: "8 days", low: true },
  { name: "San Marzano", stock: 42, max: 60, unit: "cans", supplier: "Italia Foods", expiry: "180 days", low: false },
  { name: "Arborio rice", stock: 28, max: 50, unit: "kg", supplier: "Milano Grain", expiry: "365 days", low: false },
  { name: "Fresh basil", stock: 3, max: 15, unit: "bunches", supplier: "Local Herbs", expiry: "3 days", low: true },
  { name: "Espresso beans", stock: 22, max: 30, unit: "kg", supplier: "Illy", expiry: "90 days", low: false },
  { name: "Mascarpone", stock: 4, max: 12, unit: "kg", supplier: "Napoli Farms", expiry: "6 days", low: true },
];

const usage = [
  { name: "Mon", v: 42 }, { name: "Tue", v: 38 }, { name: "Wed", v: 51 },
  { name: "Thu", v: 48 }, { name: "Fri", v: 68 }, { name: "Sat", v: 78 }, { name: "Sun", v: 72 },
];

function Inventory() {
  const low = items.filter((i) => i.low).length;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        subtitle="Track stock, forecast demand, and reduce waste."
        actions={
          <>
            <Button variant="outline" size="sm">Import</Button>
            <Button variant="hero" size="sm"><Plus className="h-3.5 w-3.5" /> New item</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total items", value: "218", icon: Package, color: "primary" },
          { label: "Low stock", value: String(low), icon: AlertTriangle, color: "amber" },
          { label: "Expiring soon", value: "12", icon: TrendingDown, color: "destructive" },
          { label: "Waste (week)", value: "-34%", icon: TrendingDown, color: "success" },
        ].map((s) => {
          const map: Record<string, string> = {
            primary: "text-primary bg-primary/10",
            amber: "text-amber bg-amber/10",
            destructive: "text-destructive bg-destructive/10",
            success: "text-success bg-success/10",
          };
          return (
            <Card key={s.label} className="p-5 rounded-2xl border-border/60 shadow-card">
              <div className={`h-10 w-10 rounded-xl grid place-items-center ${map[s.color]}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 rounded-2xl border-border/60 shadow-card">
          <div className="text-sm font-semibold">Inventory usage</div>
          <div className="text-xs text-muted-foreground">Last 7 days · kg consumed</div>
          <div className="mt-4"><BarTrend data={usage} /></div>
        </Card>
        <Card className="p-6 rounded-2xl border-amber/40 shadow-card bg-amber/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber" />
            <div className="font-semibold">Low stock alerts</div>
          </div>
          <div className="mt-4 space-y-3">
            {items.filter(i => i.low).map((i) => (
              <div key={i.name} className="flex items-center gap-3">
                <div>
                  <div className="text-sm font-medium">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.stock} {i.unit} left</div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">Reorder</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search inventory…" className="pl-9 h-11 rounded-xl max-w-md" />
      </div>

      <Card className="rounded-2xl border-border/60 shadow-card overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_2fr_1fr_1fr_120px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 bg-muted/30">
          <div>Item</div><div>Stock level</div><div>Supplier</div><div>Expiry</div><div>Status</div><div></div>
        </div>
        {items.map((i) => {
          const pct = Math.round((i.stock / i.max) * 100);
          return (
            <div key={i.name} className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_2fr_1fr_1fr_120px] gap-3 md:gap-4 px-5 py-4 border-b border-border/60 last:border-0 items-center hover:bg-accent/40 transition-colors">
              <div>
                <div className="font-medium text-sm">{i.name}</div>
                <div className="text-xs text-muted-foreground">{i.stock}/{i.max} {i.unit}</div>
              </div>
              <div>
                <Progress value={pct} className={`h-2 ${i.low ? "[&>div]:bg-amber" : ""}`} />
              </div>
              <div className="text-sm text-muted-foreground">{i.supplier}</div>
              <div className="text-sm">{i.expiry}</div>
              <div>
                <Badge variant="outline" className={i.low ? "text-amber border-amber/40 bg-amber/10" : "text-success border-success/40 bg-success/10"}>
                  {i.low ? "Low" : "OK"}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
