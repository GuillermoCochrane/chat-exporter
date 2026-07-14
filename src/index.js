import { loadConversation } from "./loader.js";
import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";
import { filterConversationMessages } from "./filter.js";

async function main() {
    const conversation = await loadConversation("./input/epistolario_ORIGINAL.json");
    
    const stats = inspectConversation(conversation);
    const messages = extractMessages(conversation);
    const filtered = filterConversationMessages(messages);
    console.table(
    filtered.map(m => ({
            role: m.role,
            text: m.rawContent.parts?.[0]?.slice(0, 60)
        }))
    );
}

main().catch(console.error);