import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock, Users, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/reservations")({
  head: () => ({ meta: [{ title: "Reservations · SmartServe AI" }] }),
  component: Reservations,
});

const days = ["Today", "Tomorrow", "Fri", "Sat", "Sun"];
const list = [
  { time: "6:30 PM", name: "Chen party", size: 4, table: "T07", note: "Anniversary" },
  { time: "7:00 PM", name: "Patel", size: 2, table: "T01", note: "" },
  { time: "7:30 PM", name: "Rodriguez", size: 6, table: "T04", note: "Birthday 🎂" },
  { time: "7:45 PM", name: "Kim", size: 3, table: "T09", note: "Vegetarian" },
  { time: "8:00 PM", name: "Johnson family", size: 8, table: "T08", note: "Highchair x1" },
  { time: "8:15 PM", name: "Nguyen", size: 2, table: "T02", note: "Window seat" },
  { time: "8:30 PM", name: "O'Brien", size: 4, table: "T11", note: "" },
  { time: "9:00 PM", name: "Silva", size: 5, table: "T03", note: "Gluten-free" },
];

function Reservations() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservations"
        subtitle="42 covers booked for tonight."
        actions={<Button variant="hero" size="sm"><Plus className="h-3.5 w-3.5" /> New reservation</Button>}
      />

      <div className="flex gap-2 overflow-x-auto">
        {days.map((d, i) => (
          <button key={d} className={`shrink-0 px-5 py-3 rounded-2xl text-sm font-medium transition-all ${i === 0 ? "bg-primary text-primary-foreground shadow-elegant" : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"}`}>
            <div>{d}</div>
            <div className={`text-xs mt-0.5 ${i === 0 ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{[42, 38, 55, 72, 60][i]} covers</div>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((r) => (
          <Card key={r.time + r.name} className="p-5 rounded-2xl border-border/60 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> {r.time}
                </div>
                <div className="mt-2 font-medium">{r.name}</div>
              </div>
              <Badge variant="outline" className="rounded-full">{r.table}</Badge>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {r.size}</span>
              {r.note && <span>· {r.note}</span>}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Message</Button>
              <Button variant="hero" size="sm" className="flex-1"><CalendarCheck className="h-3.5 w-3.5" /> Check-in</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
