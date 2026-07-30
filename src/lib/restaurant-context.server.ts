import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Static baseline about the demo restaurant. In a full build this would come
// from the menu / inventory tables — kept inline for now.
export const STATIC_RESTAURANT = {
  name: "Oliva & Co",
  cuisine: "Modern Italian",
  hours: "Mon–Sun · 11:30am – 11:00pm",
  seats: 84,
  popularItems: [
    { name: "Truffle Pasta", price: 26, marginPct: 62 },
    { name: "Wagyu Burger", price: 24, marginPct: 55 },
    { name: "Margherita Pizza", price: 18, marginPct: 71 },
    { name: "Salmon Teriyaki", price: 28, marginPct: 48 },
    { name: "Mushroom Risotto", price: 22, marginPct: 66 },
    { name: "Tiramisu", price: 12, marginPct: 74 },
  ],
  lowStock: [
    { item: "Truffle oil", remaining: "2 bottles", risk: "critical" },
    { item: "Buffalo mozzarella", remaining: "6 lbs", risk: "medium" },
    { item: "Espresso beans", remaining: "1.5 kg", risk: "medium" },
  ],
  reservationsTonight: 12,
};

export function makeUserSupabase(accessToken: string): SupabaseClient<Database> {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

export async function buildLiveContext(supabase: SupabaseClient<Database>) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: orders } = await supabase
    .from("orders")
    .select("id,status,total_cents,items,created_at,table_label")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  const list = orders ?? [];
  const active = list.filter((o) => ["received", "cooking", "ready"].includes(o.status));
  const completed = list.filter((o) => o.status === "served");
  const revenueCents = completed.reduce((s, o) => s + (o.total_cents ?? 0), 0);
  const itemCounts = new Map<string, number>();
  for (const o of list) {
    const items = Array.isArray(o.items) ? (o.items as Array<{ name?: string; qty?: number }>) : [];
    for (const it of items) {
      if (!it?.name) continue;
      itemCounts.set(it.name, (itemCounts.get(it.name) ?? 0) + (it.qty ?? 1));
    }
  }
  const topItems = [...itemCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));

  return {
    ordersLast24h: list.length,
    activeOrders: active.length,
    completedOrders: completed.length,
    revenueLast24hUsd: (revenueCents / 100).toFixed(2),
    topItems,
    activeOrdersDetail: active.slice(0, 8).map((o) => ({
      table: o.table_label,
      status: o.status,
      totalUsd: ((o.total_cents ?? 0) / 100).toFixed(2),
      startedAt: o.created_at,
    })),
  };
}

export function buildSystemPrompt(live: Awaited<ReturnType<typeof buildLiveContext>>) {
  return `You are SmartServe AI, an operations copilot for a restaurant.

Restaurant profile:
- Name: ${STATIC_RESTAURANT.name} (${STATIC_RESTAURANT.cuisine})
- Hours: ${STATIC_RESTAURANT.hours}, seats: ${STATIC_RESTAURANT.seats}
- Popular menu: ${STATIC_RESTAURANT.popularItems.map((i) => `${i.name} ($${i.price}, ${i.marginPct}% margin)`).join("; ")}
- Low stock: ${STATIC_RESTAURANT.lowStock.map((s) => `${s.item} — ${s.remaining} (${s.risk})`).join("; ")}
- Reservations tonight: ${STATIC_RESTAURANT.reservationsTonight}

Live operations (last 24h, from the manager's actual order data):
- Orders: ${live.ordersLast24h} (active: ${live.activeOrders}, completed: ${live.completedOrders})
- Revenue: $${live.revenueLast24hUsd}
- Top items: ${live.topItems.map((t) => `${t.name} ×${t.qty}`).join(", ") || "no orders yet"}
- Active orders: ${JSON.stringify(live.activeOrdersDetail)}

Rules:
- Be concise, warm, and specific. Format with light markdown (**bold**, bullet lists) when it aids scanning.
- Ground every claim in the numbers above. If the user has no orders yet, say so and suggest creating a first order in the Orders page.
- Prefer actionable recommendations: what to promote, reorder, prep, or staff — with quantified impact.
- Never invent metrics or menu items that aren't listed.`;
}
