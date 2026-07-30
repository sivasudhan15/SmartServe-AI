import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ItemSchema = z.object({
  name: z.string(),
  qty: z.number().int().positive(),
  price_cents: z.number().int().nonnegative(),
  note: z.string().optional(),
});

const CreateOrderInput = z.object({
  table_label: z.string().min(1),
  guest_name: z.string().optional().nullable(),
  items: z.array(ItemSchema).min(1),
  notes: z.string().optional().nullable(),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CreateOrderInput.parse(d))
  .handler(async ({ data, context }) => {
    // generate a short order number
    const rand = Math.floor(1000 + Math.random() * 9000);
    const total_cents = data.items.reduce((s, i) => s + i.price_cents * i.qty, 0);

    const { data: row, error } = await context.supabase
      .from("orders")
      .insert({
        user_id: context.userId,
        order_number: `#${rand}`,
        table_label: data.table_label,
        guest_name: data.guest_name ?? null,
        items: data.items as unknown as never,
        total_cents,
        status: "received",
        notes: data.notes ?? null,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

const StatusSchema = z.enum(["received", "cooking", "ready", "served", "cancelled"]);

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: StatusSchema }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const seedDemoOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const demos = [
      {
        table_label: "T12",
        guest_name: "Walk-in",
        items: [
          { name: "Truffle Pasta", qty: 2, price_cents: 2600 },
          { name: "Caesar Salad", qty: 1, price_cents: 1400, note: "no anchovy" },
        ],
        status: "cooking" as const,
      },
      {
        table_label: "T08",
        guest_name: "J. Smith",
        items: [
          { name: "Margherita Pizza", qty: 1, price_cents: 1800 },
          { name: "Tiramisu", qty: 2, price_cents: 1200 },
        ],
        status: "ready" as const,
      },
      {
        table_label: "T04",
        guest_name: "M. Chen",
        items: [{ name: "Wagyu Burger", qty: 1, price_cents: 2400, note: "med rare" }],
        status: "received" as const,
      },
    ];

    for (const d of demos) {
      const total_cents = d.items.reduce((s, i) => s + i.price_cents * i.qty, 0);
      const rand = Math.floor(1000 + Math.random() * 9000);
      await context.supabase.from("orders").insert({
        user_id: context.userId,
        order_number: `#${rand}`,
        table_label: d.table_label,
        guest_name: d.guest_name,
        items: d.items as unknown as never,
        total_cents,
        status: d.status,
      });
    }
    return { ok: true };
  });
