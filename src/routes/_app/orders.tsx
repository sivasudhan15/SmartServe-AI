import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Filter,
  Search,
  Plus,
  Package,
  Flame,
  Check,
  UtensilsCrossed,
  Ban,
  Circle,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  createOrder,
  seedDemoOrders,
  updateOrderStatus,
} from "@/lib/orders.functions";

export const Route = createFileRoute("/_app/orders")({
  head: () => ({ meta: [{ title: "Orders · SmartServe AI" }] }),
  component: OrdersPage,
});

type OrderItem = { name: string; qty: number; price_cents: number; note?: string };
type Status = "received" | "cooking" | "ready" | "served" | "cancelled";
type Order = {
  id: string;
  order_number: string;
  table_label: string;
  guest_name: string | null;
  items: OrderItem[];
  total_cents: number;
  status: Status;
  created_at: string;
  updated_at: string;
};
type OrderEvent = {
  id: string;
  order_id: string;
  status: Status;
  note: string | null;
  created_at: string;
};

const TIMELINE: { key: Status; label: string; icon: typeof Package }[] = [
  { key: "received", label: "Received", icon: Package },
  { key: "cooking", label: "Cooking", icon: Flame },
  { key: "ready", label: "Ready", icon: Check },
  { key: "served", label: "Served", icon: UtensilsCrossed },
];

const statusColor: Record<Status, string> = {
  received: "bg-primary/15 text-primary border-primary/30",
  cooking: "bg-amber/15 text-amber border-amber/30",
  ready: "bg-teal/15 text-teal border-teal/30",
  served: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

function OrdersPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | Status | "active">("active");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
    enabled: !!user,
  });

  const eventsQuery = useQuery({
    queryKey: ["order_events", expandedId],
    queryFn: async (): Promise<OrderEvent[]> => {
      if (!expandedId) return [];
      const { data, error } = await supabase
        .from("order_events")
        .select("*")
        .eq("order_id", expandedId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as OrderEvent[];
    },
    enabled: !!expandedId,
  });

  // Realtime subscription — refetch on any change to orders / events
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`orders-live-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ["orders"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_events", filter: `user_id=eq.${user.id}` },
        () => {
          qc.invalidateQueries({ queryKey: ["order_events"] });
          qc.invalidateQueries({ queryKey: ["orders"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, qc]);

  const advanceFn = useServerFn(updateOrderStatus);
  const advance = useMutation({
    mutationFn: (input: { id: string; status: Status }) => advanceFn({ data: input }),
    onError: (e) => toast.error((e as Error).message),
  });

  const seedFn = useServerFn(seedDemoOrders);
  const createFn = useServerFn(createOrder);
  const newOrder = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          table_label: `T${Math.floor(Math.random() * 20) + 1}`,
          guest_name: "Walk-in",
          items: [
            {
              name: ["Truffle Pasta", "Margherita Pizza", "Wagyu Burger", "Salmon Teriyaki"][
                Math.floor(Math.random() * 4)
              ],
              qty: 1 + Math.floor(Math.random() * 2),
              price_cents: 1800 + Math.floor(Math.random() * 1000),
            },
          ],
        },
      }),
    onSuccess: () => toast.success("Order received"),
    onError: (e) => toast.error((e as Error).message),
  });

  const orders = ordersQuery.data ?? [];
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter === "active" && !["received", "cooking", "ready"].includes(o.status)) return false;
      if (filter !== "all" && filter !== "active" && o.status !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !o.order_number.toLowerCase().includes(q) &&
          !(o.guest_name ?? "").toLowerCase().includes(q) &&
          !o.table_label.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [orders, filter, query]);

  const counts = useMemo(() => {
    const c = { received: 0, cooking: 0, ready: 0, served: 0, cancelled: 0 } as Record<Status, number>;
    for (const o of orders) c[o.status]++;
    return c;
  }, [orders]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Live order feed with real-time status timeline."
        actions={
          <>
            <Badge className="rounded-full bg-success/10 text-success border-success/30 gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
            </Badge>
            {orders.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => seedFn().then(() => qc.invalidateQueries({ queryKey: ["orders"] }))}
              >
                <Sparkles className="h-3.5 w-3.5" /> Seed demo
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            <Button
              variant="hero"
              size="sm"
              onClick={() => newOrder.mutate()}
              disabled={newOrder.isPending}
            >
              <Plus className="h-3.5 w-3.5" /> New order
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Received", value: counts.received, color: "text-primary bg-primary/10", icon: Package },
          { label: "Cooking", value: counts.cooking, color: "text-amber bg-amber/10", icon: Flame },
          { label: "Ready", value: counts.ready, color: "text-teal bg-teal/10", icon: Check },
          { label: "Served", value: counts.served, color: "text-success bg-success/10", icon: UtensilsCrossed },
          { label: "Cancelled", value: counts.cancelled, color: "text-destructive bg-destructive/10", icon: Ban },
        ].map((s) => (
          <Card key={s.label} className="p-4 rounded-2xl border-border/60 shadow-card flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-xl grid place-items-center", s.color)}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order # or guest…"
            className="pl-9 h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {(["active", "all", "received", "cooking", "ready", "served", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors",
              filter === s
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {ordersQuery.isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-5 rounded-2xl border-border/60 shadow-card flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-9 w-20 bg-muted rounded-xl" />
                <div className="h-6 w-16 bg-muted rounded-lg" />
                <div className="h-5 w-40 bg-muted rounded-lg" />
              </div>
              <div className="h-6 w-16 bg-muted rounded-xl" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center rounded-3xl border-dashed border-border/60 bg-muted/10 max-w-2xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-elegant animate-float">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">No orders found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create a live order to track tickets, monitor status steps, and view real-time kitchen progress.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => seedFn().then(() => qc.invalidateQueries({ queryKey: ["orders"] }))}
            >
              <Sparkles className="h-3.5 w-3.5" /> Seed demo
            </Button>
            <Button
              variant="hero"
              size="sm"
              onClick={() => newOrder.mutate()}
              disabled={newOrder.isPending}
            >
              <Plus className="h-3.5 w-3.5" /> Create live order
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              expanded={expandedId === o.id}
              onToggle={() => setExpandedId((id) => (id === o.id ? null : o.id))}
              events={expandedId === o.id ? eventsQuery.data ?? [] : []}
              onAdvance={(status) => advance.mutate({ id: o.id, status })}
              busy={advance.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  onToggle,
  events,
  onAdvance,
  busy,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  events: OrderEvent[];
  onAdvance: (s: Status) => void;
  busy: boolean;
}) {
  const currentIdx = TIMELINE.findIndex((t) => t.key === order.status);
  const isCancelled = order.status === "cancelled";
  const nextStatus: Status | null =
    order.status === "received"
      ? "cooking"
      : order.status === "cooking"
        ? "ready"
        : order.status === "ready"
          ? "served"
          : null;

  return (
    <Card className="rounded-2xl border-border/60 shadow-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-accent/40 transition-colors"
      >
        <div className="min-w-[80px]">
          <div className="font-bold text-sm">{order.order_number}</div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
          </div>
        </div>
        <Badge variant="outline" className="rounded-md">
          {order.table_label}
        </Badge>
        <div className="text-sm flex-1 truncate">
          {order.guest_name ?? "Walk-in"} ·{" "}
          <span className="text-muted-foreground">
            {order.items.reduce((s, i) => s + i.qty, 0)} items
          </span>
        </div>
        <div className="font-semibold text-sm">${(order.total_cents / 100).toFixed(2)}</div>
        <Badge variant="outline" className={cn("rounded-full capitalize", statusColor[order.status])}>
          {order.status}
        </Badge>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-border/60 bg-muted/20 space-y-5">
          {/* Timeline */}
          <div className="pt-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Status timeline
            </div>
            {isCancelled ? (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <Ban className="h-4 w-4" /> Order cancelled
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-0 right-0 top-4 h-0.5 bg-border" />
                <div
                  className="absolute left-0 top-4 h-0.5 bg-primary transition-all"
                  style={{ width: `${(currentIdx / (TIMELINE.length - 1)) * 100}%` }}
                />
                <div className="relative grid grid-cols-4 gap-2">
                  {TIMELINE.map((step, i) => {
                    const done = i <= currentIdx;
                    const active = i === currentIdx;
                    const event = events.find((e) => e.status === step.key);
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center">
                        <div
                          className={cn(
                            "relative h-8 w-8 rounded-full grid place-items-center border-2 transition-all",
                            done
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-background border-border text-muted-foreground",
                            active && "ring-4 ring-primary/20 scale-110",
                          )}
                        >
                          {done ? <step.icon className="h-3.5 w-3.5" /> : <Circle className="h-2 w-2 fill-current" />}
                        </div>
                        <div className={cn("mt-2 text-xs font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                          {step.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 h-4">
                          {event
                            ? formatDistanceToNow(new Date(event.created_at), { addSuffix: true })
                            : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Items
            </div>
            <ul className="space-y-1.5">
              {order.items.map((it, i) => (
                <li key={i} className="text-sm flex items-baseline gap-2">
                  <span className="text-muted-foreground w-6">{it.qty}×</span>
                  <span className="font-medium">{it.name}</span>
                  {it.note && <span className="text-xs text-muted-foreground italic">({it.note})</span>}
                  <span className="ml-auto text-muted-foreground">
                    ${((it.price_cents * it.qty) / 100).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Event log */}
          {events.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Activity
              </div>
              <ul className="space-y-1.5 text-xs">
                {events.map((e) => (
                  <li key={e.id} className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="capitalize font-medium text-foreground">{e.status}</span>
                    {e.note && <span>· {e.note}</span>}
                    <span className="ml-auto">
                      {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          {!isCancelled && (
            <div className="flex gap-2 pt-1">
              {nextStatus && (
                <Button
                  variant="hero"
                  size="sm"
                  disabled={busy}
                  onClick={() => onAdvance(nextStatus)}
                >
                  Advance to {nextStatus}
                </Button>
              )}
              {order.status !== "served" && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => onAdvance("cancelled")}
                >
                  <Ban className="h-3.5 w-3.5" /> Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
