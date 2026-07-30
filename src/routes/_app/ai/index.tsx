import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createThread, listThreads } from "@/lib/chat.functions";

export const Route = createFileRoute("/_app/ai/")({
  head: () => ({ meta: [{ title: "AI Assistant · SmartServe AI" }] }),
  component: AIIndex,
});

function AIIndex() {
  const navigate = useNavigate();
  const listFn = useServerFn(listThreads);
  const createFn = useServerFn(createThread);
  const threads = useQuery({ queryKey: ["threads"], queryFn: () => listFn() });

  const create = useMutation({
    mutationFn: () => createFn(),
    onSuccess: (t) => navigate({ to: "/ai/$threadId", params: { threadId: t.id } }),
  });

  useEffect(() => {
    if (!threads.isLoading && threads.data && threads.data.length > 0) {
      navigate({ to: "/ai/$threadId", params: { threadId: threads.data[0].id }, replace: true });
    }
  }, [threads.isLoading, threads.data, navigate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        subtitle="Your always-on restaurant intelligence."
        actions={
          <Button variant="hero" size="sm" onClick={() => create.mutate()} disabled={create.isPending}>
            <Plus className="h-3.5 w-3.5" /> New chat
          </Button>
        }
      />
      <Card className="p-16 rounded-3xl border-dashed border-border/60 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-elegant">
          <Bot className="h-6 w-6" />
        </div>
        <div className="mt-4 text-lg font-semibold">Start a conversation</div>
        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
          Ask SmartServe AI about tonight's sales, staffing, inventory risks, or menu ideas — grounded in your live data.
        </p>
        <Button
          variant="hero"
          className="mt-6"
          onClick={() => create.mutate()}
          disabled={create.isPending}
        >
          <Sparkles className="h-4 w-4" /> New chat
        </Button>
      </Card>
    </div>
  );
}
