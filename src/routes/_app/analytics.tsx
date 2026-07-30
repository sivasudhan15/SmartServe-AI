import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaTrend, BarTrend, DonutChart, LineTrend } from "@/components/dashboard/Charts";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics · SmartServe AI" }] }),
  component: Analytics,
});

const revenueMonthly = [
  { name: "Jan", v: 42000 }, { name: "Feb", v: 48000 }, { name: "Mar", v: 51000 },
  { name: "Apr", v: 58000 }, { name: "May", v: 62000 }, { name: "Jun", v: 71000 },
  { name: "Jul", v: 78000 }, { name: "Aug", v: 82000 }, { name: "Sep", v: 91000 },
];

const orders = [
  { name: "Mon", v: 180 }, { name: "Tue", v: 165 }, { name: "Wed", v: 210 },
  { name: "Thu", v: 240 }, { name: "Fri", v: 320 }, { name: "Sat", v: 380 }, { name: "Sun", v: 340 },
];

const salesTrend = [
  { name: "W1", revenue: 24000, profit: 8400 },
  { name: "W2", revenue: 28000, profit: 10200 },
  { name: "W3", revenue: 26500, profit: 9600 },
  { name: "W4", revenue: 32500, profit: 12800 },
  { name: "W5", revenue: 36200, profit: 14200 },
];

const waste = [
  { name: "Vegetables", value: 22, color: "var(--chart-1)" },
  { name: "Dairy", value: 14, color: "var(--chart-2)" },
  { name: "Meat", value: 8, color: "var(--chart-3)" },
  { name: "Grains", value: 6, color: "var(--chart-4)" },
  { name: "Other", value: 4, color: "var(--chart-5)" },
];

const reviews = [
  { name: "Positive", value: 78, color: "var(--success)" },
  { name: "Neutral", value: 15, color: "var(--amber)" },
  { name: "Negative", value: 7, color: "var(--destructive)" },
];

// Heatmap
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["10a", "12p", "2p", "4p", "6p", "8p", "10p"];
const heatmap = days.map(() => hours.map(() => Math.floor(Math.random() * 100)));

function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Deep insights across every corner of your operation." />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 rounded-2xl border-border/60 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Revenue growth</div>
              <div className="text-xs text-muted-foreground">Monthly · YTD $583K</div>
            </div>
            <Badge className="rounded-full bg-success/10 text-success border-success/30 gap-1">
              <TrendingUp className="h-3 w-3" /> +23.4%
            </Badge>
          </div>
          <div className="mt-4"><AreaTrend data={revenueMonthly} height={260} /></div>
        </Card>
        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          <div className="text-sm font-semibold">Review sentiment</div>
          <div className="text-xs text-muted-foreground">Last 30 days · 428 reviews</div>
          <div className="mt-4"><DonutChart data={reviews} height={200} /></div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            {reviews.map((r) => (
              <div key={r.name} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <div className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                  <span className="text-muted-foreground">{r.name}</span>
                </div>
                <div className="font-bold mt-0.5">{r.value}%</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          <div className="text-sm font-semibold">Sales trend</div>
          <div className="text-xs text-muted-foreground">Revenue vs. profit</div>
          <div className="mt-4"><LineTrend data={salesTrend} height={260} /></div>
        </Card>
        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          <div className="text-sm font-semibold">Orders by day</div>
          <div className="text-xs text-muted-foreground">This week</div>
          <div className="mt-4"><BarTrend data={orders} height={260} /></div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 rounded-2xl border-primary/30 shadow-card bg-gradient-primary/5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="font-semibold">Demand forecast · next 7 days</div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[520px]">
              <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 text-[10px] text-muted-foreground mb-1">
                <div />
                {hours.map((h) => <div key={h} className="text-center">{h}</div>)}
              </div>
              {days.map((d, i) => (
                <div key={d} className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 mb-1">
                  <div className="text-xs text-muted-foreground flex items-center">{d}</div>
                  {heatmap[i].map((v, j) => (
                    <div
                      key={j}
                      className="h-8 rounded-md"
                      title={`${v}% demand`}
                      style={{
                        background: `oklch(0.585 0.213 277 / ${0.08 + (v / 100) * 0.9})`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Darker = higher predicted demand. Staff up Sat 7–9pm.
          </div>
        </Card>
        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          <div className="text-sm font-semibold">Food waste breakdown</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-success" /> Down 34% MoM
          </div>
          <div className="mt-4"><DonutChart data={waste} height={200} /></div>
        </Card>
      </div>
    </div>
  );
}
