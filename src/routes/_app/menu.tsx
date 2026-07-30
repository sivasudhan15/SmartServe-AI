import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Sparkles, Clock, Leaf, Filter } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/menu")({
  head: () => ({ meta: [{ title: "Digital Menu · SmartServe AI" }] }),
  component: MenuPage,
});

const cats = ["All", "Starters", "Mains", "Pasta", "Pizza", "Desserts", "Drinks"];

const dishes = [
  { name: "Truffle Pasta", cat: "Pasta", price: 32, time: 18, cal: 620, ai: true, hue: 30 },
  { name: "Margherita Pizza", cat: "Pizza", price: 18, time: 14, cal: 780, ai: false, hue: 10 },
  { name: "Wagyu Burger", cat: "Mains", price: 34, time: 20, cal: 890, ai: true, hue: 25 },
  { name: "Caesar Salad", cat: "Starters", price: 14, time: 8, cal: 320, ai: false, hue: 120 },
  { name: "Salmon Teriyaki", cat: "Mains", price: 28, time: 22, cal: 540, ai: true, hue: 15 },
  { name: "Tiramisu", cat: "Desserts", price: 12, time: 5, cal: 420, ai: false, hue: 40 },
  { name: "Mushroom Risotto", cat: "Pasta", price: 24, time: 25, cal: 580, ai: false, hue: 45 },
  { name: "Bruschetta", cat: "Starters", price: 10, time: 7, cal: 260, ai: false, hue: 20 },
];

function MenuPage() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? dishes : dishes.filter((d) => d.cat === cat);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital Menu"
        subtitle="Manage dishes, prices, and availability."
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" /> Filters</Button>
            <Button variant="hero" size="sm"><Plus className="h-3.5 w-3.5" /> Add dish</Button>
          </>
        }
      />

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search dishes…" className="pl-9 h-11 rounded-xl" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              cat === c
                ? "bg-primary text-primary-foreground shadow-elegant"
                : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((d) => (
          <Card key={d.name} className="group overflow-hidden rounded-2xl border-border/60 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all p-0">
            <div className="relative aspect-[4/3] overflow-hidden">
              <div
                className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                style={{
                  background: `radial-gradient(circle at 30% 30%, oklch(0.75 0.18 ${d.hue}), oklch(0.4 0.15 ${d.hue}))`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {d.ai && (
                <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 backdrop-blur-md gap-1">
                  <Sparkles className="h-3 w-3" /> AI pick
                </Badge>
              )}
              <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-card/80 backdrop-blur-md grid place-items-center text-xs font-semibold">
                ${d.price}
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <div className="text-[10px] uppercase tracking-widest opacity-80">{d.cat}</div>
                <div className="text-lg font-bold leading-tight">{d.name}</div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {d.time} min</span>
                <span className="flex items-center gap-1"><Leaf className="h-3 w-3" /> {d.cal} cal</span>
                <span className="ml-auto text-success font-semibold">Available</span>
              </div>
              <Button variant="hero" size="sm" className="w-full mt-3">
                <Plus className="h-3.5 w-3.5" /> Add to order
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
