import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingBag,
  Users,
  CalendarCheck,
  Boxes,
  Clock,
  Sparkles,
  TrendingUp,
  Utensils,
  ChefHat,
  Star,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AreaTrend, LineTrend, BarTrend } from "@/components/dashboard/Charts";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · SmartServe AI" },
      { name: "description", content: "Live operations overview for your restaurant." },
    ],
  }),
  component: Dashboard,
});

const revenueData = [
  { name: "Mon", v: 3200 }, { name: "Tue", v: 2800 }, { name: "Wed", v: 4100 },
  { name: "Thu", v: 3900 }, { name: "Fri", v: 6200 }, { name: "Sat", v: 7400 }, { name: "Sun", v: 6800 },
];
const profitData = [
  { name: "W1", revenue: 24000, profit: 8400 },
  { name: "W2", revenue: 28000, profit: 10200 },
  { name: "W3", revenue: 26500, profit: 9600 },
  { name: "W4", revenue: 32500, profit: 12800 },
];
const peakHours = [
  { name: "10a", v: 12 }, { name: "11a", v: 22 }, { name: "12p", v: 48 },
  { name: "1p", v: 54 }, { name: "2p", v: 32 }, { name: "3p", v: 18 },
  { name: "6p", v: 54 }, { name: "7p", v: 68 }, { name: "8p", v: 72 }, { name: "9p", v: 55 },
];

function KPI({
  icon: Icon, label, value, delta, up = true, color = "primary",
}: {
  icon: any; label: string; value: string; delta: string; up?: boolean;
  color?: "primary" | "teal" | "amber" | "success";
}) {
  const map = {
    primary: "text-primary bg-primary/10",
    teal: "text-teal bg-teal/10",
    amber: "text-amber bg-amber/10",
    success: "text-success bg-success/10",
  } as const;
  return (
    <Card className="p-5 rounded-2xl border-border/60 shadow-card hover:shadow-elegant transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-xl grid place-items-center ${map[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <Badge
          variant="outline"
          className={`gap-1 rounded-full text-[11px] ${
            up ? "text-success border-success/30 bg-success/5" : "text-destructive border-destructive/30 bg-destructive/5"
          }`}
        >
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </Badge>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
    </Card>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Good evening, Maria 👋"
        subtitle="Here's what's happening at Oliva & Co · Downtown, right now."
        actions={
          <>
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="hero" size="sm"><Sparkles className="h-3.5 w-3.5" /> Daily brief</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={DollarSign} label="Revenue today" value="$8,412" delta="+12.4%" color="primary" />
        <KPI icon={ShoppingBag} label="Orders" value="284" delta="+8.1%" color="teal" />
        <KPI icon={Users} label="Guests served" value="612" delta="+15%" color="amber" />
        <KPI icon={CalendarCheck} label="Reservations" value="42" delta="+3" color="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 rounded-2xl border-border/60 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Revenue & Profit</div>
              <div className="text-xs text-muted-foreground">Last 4 weeks</div>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal" /> Profit</span>
            </div>
          </div>
          <div className="mt-4">
            <LineTrend data={profitData} />
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-primary/30 shadow-card bg-gradient-primary/5 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
          <div className="relative">
            <Badge className="rounded-full bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-1" /> AI Insights
            </Badge>
            <h3 className="mt-3 font-semibold">Tonight's opportunity</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Truffle Pasta has 32% higher margin than avg and inventory covers 45 servings.
              Promote to your top 200 loyal guests via SMS — <span className="font-semibold text-foreground">projected +$1,240</span> tonight.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="hero" size="sm" className="flex-1">Auto-promote</Button>
              <Button variant="outline" size="sm">Dismiss</Button>
            </div>
            <div className="mt-4 pt-4 border-t border-border/60 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Confidence</span><span className="font-semibold">94%</span></div>
              <Progress value={94} className="h-1.5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          <div className="text-sm font-semibold">Weekly revenue</div>
          <div className="text-xs text-muted-foreground">$34,412 total</div>
          <div className="mt-4"><AreaTrend data={revenueData} height={180} /></div>
        </Card>
        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          <div className="text-sm font-semibold">Peak hours</div>
          <div className="text-xs text-muted-foreground">Orders by hour · today</div>
          <div className="mt-4"><BarTrend data={peakHours} height={180} /></div>
        </Card>
        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          <div className="text-sm font-semibold">Customer satisfaction</div>
          <div className="text-xs text-muted-foreground">Based on 128 reviews</div>
          <div className="mt-6 flex items-center gap-4">
            <div>
              <div className="text-5xl font-black tracking-tight">4.8</div>
              <div className="flex gap-0.5 text-amber mt-1">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {[[5, 78], [4, 15], [3, 4], [2, 2], [1, 1]].map(([s, p]) => (
                <div key={s} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-muted-foreground">{s}</span>
                  <Progress value={p} className="h-1.5 flex-1" />
                  <span className="w-8 text-right text-muted-foreground">{p}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Top selling items</div>
              <div className="text-xs text-muted-foreground">This week</div>
            </div>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: "Truffle Pasta", orders: 142, revenue: "$4,260", trend: "+18%" },
              { name: "Margherita Pizza", orders: 128, revenue: "$2,304", trend: "+9%" },
              { name: "Wagyu Burger", orders: 96, revenue: "$2,880", trend: "+22%" },
              { name: "Caesar Salad", orders: 84, revenue: "$1,260", trend: "+4%" },
            ].map((d, i) => (
              <div key={d.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors">
                <div className="h-9 w-9 rounded-lg bg-gradient-primary/10 grid place-items-center text-primary font-bold text-sm">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{d.revenue}</div>
                  <div className="text-xs text-success">{d.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Activity</div>
              <div className="text-xs text-muted-foreground">Live feed</div>
            </div>
            <div className="text-[11px] px-2 py-1 rounded-full bg-success/10 text-success font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {[
              { icon: ShoppingBag, text: "New order #2847 from Table 12", time: "just now", color: "primary" },
              { icon: ChefHat, text: "Kitchen: 3 tickets ready for pickup", time: "2m", color: "teal" },
              { icon: Boxes, text: "Low stock: Truffle oil (2 units left)", time: "8m", color: "amber" },
              { icon: TrendingUp, text: "Revenue passed $8K today 🎉", time: "22m", color: "success" },
              { icon: Utensils, text: "Menu updated: 2 items marked 86'd", time: "1h", color: "primary" },
            ].map((a, i) => {
              const map = {
                primary: "bg-primary/10 text-primary",
                teal: "bg-teal/10 text-teal",
                amber: "bg-amber/10 text-amber",
                success: "bg-success/10 text-success",
              } as any;
              return (
                <div key={i} className="flex gap-3">
                  <div className={`shrink-0 h-9 w-9 rounded-xl grid place-items-center ${map[a.color]}`}>
                    <a.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pb-4 border-b border-border/60 last:border-0 last:pb-0">
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {a.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
