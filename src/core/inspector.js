export function inspectConversation(conversation) {
    const mapping = conversation.mapping ?? {};

    const stats = {
        title: conversation.title ?? "(Sin título)",
        nodes: 0,
        messages: 0,
        user: 0,
        assistant: 0,
        system: 0,
        tool: 0,
        empty: 0
    };

    // Mapeo directo con valores por defecto
    const roleCounters = {
        'user': 'user',
        'assistant': 'assistant', 
        'system': 'system',
        'tool': 'tool'
    };

    for (const node of Object.values(mapping)) {
        stats.nodes++;

        const message = node.message;

        if (!message) {
            stats.empty++;
            continue;
        }

        stats.messages++;

        const role = message.author?.role;
        // Incrementa directamente usando el mapeo
        if (role && role in roleCounters) {
            stats[roleCounters[role]]++;
        }
    }

    return stats;
}