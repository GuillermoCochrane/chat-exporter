export function extractMessages(conversation) {
  const pages = Array.isArray(conversation) ? conversation : [];

  const messages = [];

  for (const page of pages) {
    const pageMessages = page.data?.messages ?? [];

    for (const message of pageMessages) {
      messages.push({
        id: message.id,
        parent: message.metadata?.parent_id ?? null,
        children: [],

        role: message.author?.role ?? null,

        createTime: message.create_time ?? null,
        updateTime: message.update_time ?? null,
        status: message.status ?? null,

        rawContent: message.content ?? null,

        metadata: message.metadata ?? {},
      });
    }
  }

  return messages;
}