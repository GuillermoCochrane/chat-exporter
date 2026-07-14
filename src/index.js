import { loadConversation } from "./loader.js";
import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";

async function main() {
    const conversation = await loadConversation("./input/epistolario.json");

    const stats = inspectConversation(conversation);
    const messages = extractMessages(conversation);

    console.table(stats);
    console.log(messages);
}

main().catch(console.error);