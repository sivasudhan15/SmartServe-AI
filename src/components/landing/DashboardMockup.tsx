import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  DollarSign,
  ShoppingBag,
  Users,
  Utensils,
  Sparkles,
} from "lucide-react";

const rev = [
  { d: "Mon", v: 3200 },
  { d: "Tue", v: 2800 },
  { d: "Wed", v: 4100 },
  { d: "Thu", v: 3900 },
  { d: "Fri", v: 6200 },
  { d: "Sat", v: 7400 },
  { d: "Sun", v: 6800 },
];

const hours = [
  { h: "10a", v: 12 },
  { h: "12p", v: 48 },
  { h: "2p", v: 32 },
  { h: "4p", v: 18 },
  { h: "6p", v: 54 },
  { h: "8p", v: 72 },
  { h: "10p", v: 41 },
];

function Stat({
  icon: Icon,
  label,
  value,
  delta,
  color = "primary",
}: {
  icon: any;
  label: string;
  value: string;
  delta: string;
  color?: "primary" | "teal" | "amber";
}) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    teal: "text-teal bg-teal/10",
    amber: "text-amber bg-amber/10",
  } as const;
  return (
    <div className="rounded-xl border border-border/60 bg-card p-3">
      <div className="flex items-center justify-between">
        <div className={`h-7 w-7 rounded-lg grid place-items-center ${colorMap[color]}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="text-[10px] font-semibold text-success flex items-center gap-0.5">
          <ArrowUpRight className="h-3 w-3" /> {delta}
        </div>
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground">{label}</div>
      <div className="text-base font-bold tracking-tight">{value}</div>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl md:rounded-3xl border border-border/60 bg-card shadow-elegant overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-muted/30">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/60" />
            <div className="h-3 w-3 rounded-full bg-amber/70" />
            <div className="h-3 w-3 rounded-full bg-success/60" />
          </div>
          <div className="mx-auto text-[11px] text-muted-foreground">
            smartserve.ai / dashboard
          </div>
        </div>

        <div className="grid md:grid-cols-[180px_1fr]">
          {/* Sidebar */}
          <div className="hidden md:block border-r border-border/60 bg-muted/20 p-3 space-y-1">
            {["Dashboard", "Orders", "Menu", "Kitchen", "Inventory", "Customers", "Analytics"].map(
              (s, i) => (
                <div
                  key={s}
                  className={`text-xs px-2.5 py-1.5 rounded-md ${
                    i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
              ),
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Welcome back</div>
                <div className="text-sm font-semibold">Oliva & Co · Downtown</div>
              </div>
              <div className="text-[10px] px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                Live · 42 tables
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <Stat icon={DollarSign} label="Revenue today" value="$8,412" delta="+12%" />
              <Stat icon={ShoppingBag} label="Orders" value="284" delta="+8%" color="teal" />
              <Stat icon={Users} label="Guests" value="612" delta="+15%" color="amber" />
              <Stat icon={Utensils} label="Avg ticket" value="$29.6" delta="+4%" />
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2 rounded-xl border border-border/60 bg-card p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold">Weekly revenue</div>
                  <div className="text-[10px] text-muted-foreground">Last 7 days</div>
                </div>
                <div className="h-32 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rev}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="d" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 11,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        fill="url(#g1)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-primary/30 bg-gradient-primary/5 p-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <div className="text-xs font-semibold">AI Insight</div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                  Push tonight's "Truffle Pasta" — projected +23% margin based on inventory and
                  guest patterns.
                </p>
                <div className="mt-3 flex gap-1.5">
                  <div className="text-[10px] px-2 py-1 rounded-md bg-primary text-primary-foreground">
                    Auto-promote
                  </div>
                  <div className="text-[10px] px-2 py-1 rounded-md bg-muted">Dismiss</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold">Peak hours</div>
                <div className="text-[10px] text-muted-foreground">Today</div>
              </div>
              <div className="h-24 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hours}>
                    <XAxis dataKey="h" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                    />
                    <Bar dataKey="v" fill="var(--teal)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
