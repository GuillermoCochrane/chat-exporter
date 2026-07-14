const VALID_ROLES = new Set(["user", "assistant"]);

export function filterConversationMessages(messages) {
    return messages.filter(message =>
        VALID_ROLES.has(message.role) &&
        message.rawContent?.content_type === "text"
    );
}