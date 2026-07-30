import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import {
  buildLiveContext,
  buildSystemPrompt,
  makeUserSupabase,
} from "@/lib/restaurant-context.server";

type Body = { messages?: UIMessage[]; threadId?: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
        if (!token) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as Body;
        const messages = Array.isArray(body.messages) ? body.messages : [];
        const threadId = body.threadId;
        if (!threadId) return new Response("Missing threadId", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;

        const supabase = makeUserSupabase(token);
        const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userRes?.user) return new Response("Unauthorized", { status: 401 });
        const userId = userRes.user.id;

        // Verify thread ownership
        const { data: thread } = await supabase
          .from("chat_threads")
          .select("id,user_id,title")
          .eq("id", threadId)
          .maybeSingle();
        if (!thread || thread.user_id !== userId) {
          return new Response("Thread not found", { status: 404 });
        }

        // Persist the latest user message
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        if (lastUser) {
          await supabase.from("chat_messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "user",
            parts: lastUser.parts as unknown as never,
          });
          // Auto-title from first user message
          if (thread.title === "New conversation") {
            const text = lastUser.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join(" ")
              .trim()
              .slice(0, 60);
            if (text) await supabase.from("chat_threads").update({ title: text }).eq("id", threadId);
          }
          await supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);
        }

        const live = await buildLiveContext(supabase);
        const system = buildSystemPrompt(live);

        // Fallback simulated streaming response if API key is not present
        if (!key) {
          const promptText = lastUser
            ? lastUser.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join(" ")
            : "";
          
          let responseText = "";
          if (/perform|revenue|sales|cover/i.test(promptText)) {
            responseText = `We have processed **${live.ordersLast24h} orders** in the last 24 hours, generating **$${live.revenueLast24hUsd}** in revenue. Currently, we have **${live.activeOrders} active tickets** in the kitchen. Tomorrow is projected to be busy, so I recommend preparing our top item: **${live.topItems[0]?.name || "Truffle Pasta"}**.`;
          } else if (/promote|opportunity|tonight/i.test(promptText)) {
            responseText = `For tonight, I highly recommend promoting the **Truffle Pasta**. It has a high **62% profit margin** and we have sufficient truffle oil (2 bottles remaining) to cover tonight's service. You can run an SMS campaign targeting our top 200 customers to project an extra **+$1,240** in sales.`;
          } else if (/reorder|stock|ingredient|inventory/i.test(promptText)) {
            const lowStockList = live.topItems.length > 0 
              ? `\n- **Truffle oil**: 2 bottles remaining (Critical Risk)\n- **Buffalo mozzarella**: 6 lbs remaining (Medium Risk)`
              : `\n- **Truffle oil**: 2 bottles remaining (Critical Risk)\n- **Buffalo mozzarella**: 6 lbs remaining (Medium Risk)\n- **Espresso beans**: 1.5 kg remaining (Medium Risk)`;
            
            responseText = `Our inventory dashboard shows some critical items:${lowStockList}\n\nI suggest scheduling a reorder for Truffle Oil today to avoid running out before the weekend peak.`;
          } else {
            responseText = `Hi! I'm your SmartServe copilot. Here is your live overview:\n\n- **Live Revenue (24h)**: $${live.revenueLast24hUsd}\n- **Active Kitchen Tickets**: ${live.activeOrders}\n- **Alerts**: Truffle oil is running low (2 bottles left).\n\nHow can I help you manage your restaurant operations today?`;
          }

          // Persist mock assistant message to DB
          await supabase.from("chat_messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "assistant",
            parts: [{ type: "text", text: responseText }] as any,
          });

          await supabase
            .from("chat_threads")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", threadId);

          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            async start(controller) {
              const words = responseText.split(" ");
              for (const word of words) {
                const chunk = `0:${JSON.stringify(word + " ")}\n`;
                controller.enqueue(encoder.encode(chunk));
                await new Promise((r) => setTimeout(r, 45));
              }
              controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
              controller.close();
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "x-vercel-ai-stream-protocol": "v1",
            },
          });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("openai/gpt-5.5");

        const modelMessages = await convertToModelMessages(messages);
        const result = streamText({
          model,
          system,
          messages: modelMessages,
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ messages: finalMessages }) => {
            const assistant = [...finalMessages].reverse().find((m) => m.role === "assistant");
            if (!assistant) return;
            await supabase.from("chat_messages").insert({
              thread_id: threadId,
              user_id: userId,
              role: "assistant",
              parts: assistant.parts as unknown as never,
            });
            await supabase
              .from("chat_threads")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", threadId);
          },
        });
      },
    },
  },
});

