import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  Boxes,
  Lightbulb,
  Plus,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  createThread,
  deleteThread,
  getThreadMessages,
  listThreads,
} from "@/lib/chat.functions";

export const Route = createFileRoute("/_app/ai/$threadId")({
  head: () => ({ meta: [{ title: "AI Assistant · SmartServe AI" }] }),
  component: ChatPage,
});

const SUGGESTIONS = [
  { icon: TrendingUp, text: "How are we performing today?" },
  { icon: Sparkles, text: "What should I promote tonight?" },
  { icon: Boxes, text: "Which ingredients should I reorder?" },
  { icon: Users, text: "Predict tomorrow's covers" },
  { icon: Lightbulb, text: "Summarize this week's performance" },
];

function ChatPage() {
  const { threadId } = useParams({ from: "/_app/ai/$threadId" });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAccessToken(session?.access_token ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const listFn = useServerFn(listThreads);
  const createFn = useServerFn(createThread);
  const deleteFn = useServerFn(deleteThread);
  const getMsgsFn = useServerFn(getThreadMessages);

  const threadsQ = useQuery({ queryKey: ["threads"], queryFn: () => listFn() });
  const historyQ = useQuery({
    queryKey: ["messages", threadId],
    queryFn: () => getMsgsFn({ data: { threadId } }),
  });

  const create = useMutation({
    mutationFn: () => createFn(),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/ai/$threadId", params: { threadId: t.id } });
    },
  });
  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: (_r, id) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      if (id === threadId) navigate({ to: "/ai" });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        subtitle="Your always-on restaurant intelligence."
        actions={
          <Badge className="rounded-full bg-primary/10 text-primary border-primary/20 gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> GPT-5 · online
          </Badge>
        }
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        {/* Thread list */}
        <Card className="rounded-2xl border-border/60 shadow-card overflow-hidden">
          <div className="p-3 border-b border-border/60">
            <Button
              variant="hero"
              size="sm"
              className="w-full"
              onClick={() => create.mutate()}
              disabled={create.isPending}
            >
              <Plus className="h-3.5 w-3.5" /> New chat
            </Button>
          </div>
          <div className="max-h-[520px] overflow-y-auto p-2">
            {(threadsQ.data ?? []).map((t) => (
              <div
                key={t.id}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                  t.id === threadId ? "bg-primary/10 text-primary" : "hover:bg-accent",
                )}
              >
                <Link
                  to="/ai/$threadId"
                  params={{ threadId: t.id }}
                  className="flex-1 flex items-center gap-2 min-w-0"
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{t.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(t.updated_at), { addSuffix: true })}
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => del.mutate(t.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  aria-label="Delete thread"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {threadsQ.data && threadsQ.data.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-6">No chats yet</div>
            )}
          </div>
        </Card>

        {/* Chat window */}
        {accessToken && historyQ.data ? (
          <ChatWindow
            key={threadId}
            threadId={threadId}
            accessToken={accessToken}
            initialMessages={historyQ.data.messages as UIMessage[]}
          />
        ) : (
          <Card className="rounded-2xl border-border/60 p-10 text-center text-muted-foreground min-h-[560px] grid place-items-center">
            Loading conversation…
          </Card>
        )}
      </div>
    </div>
  );
}

function ChatWindow({
  threadId,
  accessToken,
  initialMessages,
}: {
  threadId: string;
  accessToken: string;
  initialMessages: UIMessage[];
}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: { threadId },
      }),
    [accessToken, threadId],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message),
  });

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, status]);

  const busy = status === "submitted" || status === "streaming";

  const submit = (text: string) => {
    if (!text.trim() || busy) return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <Card className="rounded-3xl border-border/60 shadow-elegant overflow-hidden flex flex-col min-h-[560px]">
      <div ref={scrollRef} className="flex-1 p-6 space-y-5 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-elegant">
              <Bot className="h-5 w-5" />
            </div>
            <div className="mt-3 font-semibold">Ready when you are</div>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              I have live access to your orders and restaurant profile. Ask anything.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <MessageRow key={m.id} message={m} />
        ))}
        {busy && (
          <div className="flex gap-3">
            <div className="shrink-0 h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-elegant">
              <Bot className="h-4 w-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-muted rounded-tl-md">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "120ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "240ms" }} />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-xs text-destructive px-4 py-2 rounded-lg bg-destructive/10">
            {error.message}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/60 bg-muted/20">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              type="button"
              onClick={() => submit(s.text)}
              disabled={busy}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-card border border-border/60 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-50"
            >
              <s.icon className="h-3 w-3" /> {s.text}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your restaurant…"
            disabled={busy}
            className="h-12 rounded-xl bg-card"
          />
          <Button
            type="submit"
            variant="hero"
            size="icon"
            className="h-12 w-12 rounded-xl"
            disabled={busy || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

function MessageRow({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  return (
    <div className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser && (
        <div className="shrink-0 h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-elegant">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div className="max-w-[80%]">
        <div
          className={cn(
            "px-4 py-3 text-sm rounded-2xl whitespace-pre-wrap",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted rounded-tl-md",
          )}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
