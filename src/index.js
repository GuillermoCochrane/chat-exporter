import { loadConversation } from "./loader.js";
import { inspectConversation } from "./parser.js";

async function main() {
    const conversation = await loadConversation("./samples/simple.json");

    const stats = inspectConversation(conversation);

    console.table(stats);
}

main().catch(console.error);