import { createFileRoute } from "@tanstack/react-router";
import { User, Bell, CreditCard, Shield, Plug, Key } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings · SmartServe AI" }] }),
  component: Settings,
});

function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your restaurant, account, and integrations." />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="rounded-xl bg-muted/50 p-1 flex-wrap h-auto">
          <TabsTrigger value="general" className="rounded-lg"><User className="h-3.5 w-3.5 mr-1.5" />General</TabsTrigger>
          <TabsTrigger value="notif" className="rounded-lg"><Bell className="h-3.5 w-3.5 mr-1.5" />Notifications</TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg"><CreditCard className="h-3.5 w-3.5 mr-1.5" />Billing</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg"><Shield className="h-3.5 w-3.5 mr-1.5" />Security</TabsTrigger>
          <TabsTrigger value="integ" className="rounded-lg"><Plug className="h-3.5 w-3.5 mr-1.5" />Integrations</TabsTrigger>
          <TabsTrigger value="api" className="rounded-lg"><Key className="h-3.5 w-3.5 mr-1.5" />API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6 rounded-2xl border-border/60 shadow-card space-y-5 max-w-3xl">
            <div>
              <Label htmlFor="rn">Restaurant name</Label>
              <Input id="rn" defaultValue="Oliva & Co · Downtown" className="mt-2 h-11 rounded-xl" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cu">Currency</Label>
                <Input id="cu" defaultValue="USD" className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="tz">Timezone</Label>
                <Input id="tz" defaultValue="America/Los_Angeles" className="mt-2 h-11 rounded-xl" />
              </div>
            </div>
            <div>
              <Label htmlFor="ad">Address</Label>
              <Input id="ad" defaultValue="440 Market St, San Francisco, CA 94108" className="mt-2 h-11 rounded-xl" />
            </div>
            <div className="flex justify-end">
              <Button variant="hero">Save changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notif">
          <Card className="p-6 rounded-2xl border-border/60 shadow-card max-w-3xl divide-y divide-border/60">
            {[
              { t: "New orders", d: "Get notified when a new order is placed." },
              { t: "Low stock alerts", d: "Real-time alerts when inventory runs low." },
              { t: "AI insights", d: "Daily brief and opportunity alerts." },
              { t: "Reviews", d: "New customer reviews and sentiment." },
              { t: "Team activity", d: "Staff clock-in/out and shift changes." },
            ].map((n, i) => (
              <div key={n.t} className={`flex items-center justify-between py-4 ${i === 0 ? "pt-0" : ""}`}>
                <div>
                  <div className="font-medium">{n.t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.d}</div>
                </div>
                <Switch defaultChecked={i < 3} />
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="p-6 rounded-2xl border-border/60 shadow-card max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Current plan</div>
                <div className="text-2xl font-bold mt-1">Growth</div>
                <div className="text-sm text-muted-foreground">$149/mo · renews Nov 12</div>
              </div>
              <Button variant="hero">Upgrade to Enterprise</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6 rounded-2xl border-border/60 shadow-card max-w-3xl">
            <div className="text-sm">Two-factor authentication</div>
            <div className="text-xs text-muted-foreground mt-1">Add an extra layer of security.</div>
            <Button variant="outline" className="mt-4">Enable 2FA</Button>
          </Card>
        </TabsContent>

        <TabsContent value="integ">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl">
            {["Stripe", "Toast POS", "DoorDash", "Uber Eats", "QuickBooks", "Mailchimp"].map((n) => (
              <Card key={n} className="p-5 rounded-2xl border-border/60 shadow-card">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary/10 text-primary font-bold grid place-items-center">{n[0]}</div>
                <div className="mt-3 font-semibold">{n}</div>
                <Button variant="outline" size="sm" className="mt-3 w-full">Connect</Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api">
          <Card className="p-6 rounded-2xl border-border/60 shadow-card max-w-3xl">
            <div className="text-sm font-semibold">Live API keys</div>
            <div className="mt-4 p-4 rounded-xl bg-muted font-mono text-xs break-all">sk_live_••••••••••••••••••••••••3f42</div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline">Rotate</Button>
              <Button variant="hero">Create new key</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
