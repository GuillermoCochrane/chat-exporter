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

        if (typeof json.v === "string" && assistantMessage) {
          accumulatedText += json.v;
        }

        // Ignorar json.v arrays: son patches de metadata, no texto.
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