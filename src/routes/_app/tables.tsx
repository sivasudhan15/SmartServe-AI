import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/tables")({
  head: () => ({ meta: [{ title: "Tables · SmartServe AI" }] }),
  component: Tables,
});

type Status = "available" | "reserved" | "occupied" | "cleaning" | "waiting";

const tableData: { id: string; seats: number; status: Status; x: number; y: number }[] = [
  { id: "T01", seats: 2, status: "available", x: 10, y: 15 },
  { id: "T02", seats: 4, status: "occupied", x: 30, y: 15 },
  { id: "T03", seats: 4, status: "occupied", x: 55, y: 15 },
  { id: "T04", seats: 6, status: "reserved", x: 78, y: 15 },
  { id: "T05", seats: 2, status: "cleaning", x: 10, y: 40 },
  { id: "T06", seats: 4, status: "available", x: 30, y: 40 },
  { id: "T07", seats: 4, status: "occupied", x: 55, y: 40 },
  { id: "T08", seats: 8, status: "waiting", x: 78, y: 40 },
  { id: "T09", seats: 2, status: "available", x: 10, y: 65 },
  { id: "T10", seats: 4, status: "occupied", x: 30, y: 65 },
  { id: "T11", seats: 4, status: "occupied", x: 55, y: 65 },
  { id: "T12", seats: 6, status: "occupied", x: 78, y: 65 },
];

const statusColors: Record<Status, string> = {
  available: "bg-success/20 border-success text-success",
  reserved: "bg-primary/20 border-primary text-primary",
  occupied: "bg-amber/20 border-amber text-amber",
  cleaning: "bg-muted border-muted-foreground/40 text-muted-foreground",
  waiting: "bg-destructive/20 border-destructive text-destructive",
};

function Tables() {
  const [selected, setSelected] = useState<string | null>("T04");
  const sel = tableData.find((t) => t.id === selected);
  const counts = tableData.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {} as Record<Status, number>);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Floor Plan"
        subtitle="Live status of every table in your restaurant."
        actions={<Button variant="hero" size="sm">Add reservation</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(statusColors) as Status[]).map((s) => (
          <Card key={s} className="p-4 rounded-2xl border-border/60 shadow-card">
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${statusColors[s].split(" ")[0].replace("/20", "")}`} />
              <div className="text-xs text-muted-foreground capitalize">{s}</div>
            </div>
            <div className="text-2xl font-bold mt-1">{counts[s] ?? 0}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <Card className="p-6 rounded-2xl border-border/60 shadow-card relative overflow-hidden">
          <div className="text-sm font-semibold mb-4">Main Dining Room</div>
          <div className="relative aspect-[16/9] rounded-2xl bg-mesh border border-border/60 overflow-hidden">
            {/* Decorative floor features */}
            <div className="absolute left-2 top-2 right-2 bottom-2 border-2 border-dashed border-border/50 rounded-xl pointer-events-none" />
            <div className="absolute left-[45%] top-[85%] text-[10px] uppercase tracking-widest text-muted-foreground">Entrance</div>
            <div className="absolute right-3 top-3 text-[10px] uppercase tracking-widest text-muted-foreground">Kitchen →</div>

            {tableData.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 ${statusColors[t.status]} transition-all hover:scale-110 hover:shadow-elegant ${selected === t.id ? "ring-2 ring-offset-2 ring-offset-card ring-primary scale-110" : ""}`}
                style={{
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  width: t.seats <= 2 ? 52 : t.seats <= 4 ? 68 : 84,
                  height: t.seats <= 2 ? 52 : t.seats <= 4 ? 68 : 84,
                }}
              >
                <div className="text-xs font-bold">{t.id}</div>
                <div className="text-[10px] flex items-center justify-center gap-0.5"><Users className="h-2.5 w-2.5" />{t.seats}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-border/60 shadow-card">
          {sel ? (
            <>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">{sel.id}</div>
                <Badge className={`rounded-full capitalize border ${statusColors[sel.status]}`}>
                  {sel.status}
                </Badge>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{sel.seats} seats</div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Guest</span><span className="font-medium">Party of 4</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Arrival</span><span className="font-medium">7:30 PM</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Server</span><span className="font-medium">Alex R.</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Notes</span><span className="font-medium">Birthday 🎂</span></div>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Button variant="hero" size="sm">Seat guests</Button>
                <Button variant="outline" size="sm">Assign server</Button>
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Select a table to view details.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
