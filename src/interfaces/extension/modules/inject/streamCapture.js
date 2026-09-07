import { addPage } from "./state.js";

function buildUserMessage(message) {
  return {
    id: message.id ?? null,
    author: { role: "user" },
    create_time: message.create_time ?? null,
    content: {
      content_type: message.content?.content_type ?? "text",
      parts: message.content?.parts ?? [],
    },
    metadata: {
      parent_id: message.metadata?.parent_id ?? message.parent_id ?? null,
    },
  };
}

function buildAssistantMessage(message) {
  return {
    id: message.id ?? null,
    author: { role: "assistant" },
    create_time: message.create_time ?? null,
    content: {
      content_type: "text",
      parts: [""],
    },
    metadata: {
      parent_id: message.metadata?.parent_id ?? message.parent_id ?? null,
    },
  };
}

// Solo procesa texto si la ruta corresponde al contenido visible.
function applyTextDelta(accumulated, delta) {
  if (!delta) return accumulated;

  if (delta.p !== undefined && delta.p !== "/message/content/parts/0") {
    return accumulated;
  }

  if (delta.o === "replace" && typeof delta.v === "string") {
    return delta.v;
  }

  if ((delta.o === "append" || delta.o === undefined) && typeof delta.v === "string") {
    return accumulated + delta.v;
  }

  return accumulated;
}

export async function captureStream(response) {
  const reader = response.clone().body.getReader();
  const decoder = new TextDecoder("utf-8");

  let userMessage = null;
  let assistantMessage = null;
  let accumulatedText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    for (const line of chunk.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const payload = trimmed.slice(5).trim();
      if (!payload) continue;

      try {
        const json = JSON.parse(payload);

        if (json.type === "input_message") {
          const msg = json.input_message;
          if (msg?.author?.role === "user") {
            userMessage = buildUserMessage(msg);
          }
        }

        if (json.v?.message?.author?.role === "assistant") {
          const incoming = json.v.message;
          if (incoming.content?.content_type === "text") {
            assistantMessage = buildAssistantMessage(incoming);
            accumulatedText = "";
          }
        }

        // 1) Delta con ruta y operación
        if (json.p && json.o) {
          accumulatedText = applyTextDelta(accumulatedText, json);
        }
        // 2) Patch array
        else if (Array.isArray(json.v) && json.o === "patch") {
          for (const operation of json.v) {
            accumulatedText = applyTextDelta(accumulatedText, operation);
          }
        }
        // 3) Delta simple de texto
        else if (typeof json.v === "string") {
          accumulatedText = applyTextDelta(accumulatedText, {
            p: "/message/content/parts/0",
            o: "append",
            v: json.v,
          });
        }
      } catch {
        // No es JSON; se ignora.
      }
    }
  }

  if (assistantMessage) {
    assistantMessage.content.parts = [accumulatedText];
  }

  const messages = [];
  if (userMessage) messages.push(userMessage);
  if (assistantMessage) messages.push(assistantMessage);

  if (messages.length > 0) {
    addPage({
      url: response.url,
      data: { messages },
    });
  }
}