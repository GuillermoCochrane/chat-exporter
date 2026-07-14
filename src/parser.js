export function extractMessages(conversation) {
    const mapping = conversation.mapping ?? {};

    const messages = [];

    for (const [id, node] of Object.entries(mapping)) {
        const message = node.message;

        if (!message) continue;

        messages.push({
            id,
            parent: node.parent ?? null,
            children: node.children ?? [],

            role: message.author?.role ?? null,

            createTime: message.create_time ?? null,
            status: message.status ?? null,

            rawContent: message.content ?? null,

            metadata: message.metadata ?? {}
        });
    }

    return messages;
}