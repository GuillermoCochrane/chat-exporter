import { loadConversation } from "./loader.js";

async function main() {
  const conversation = await loadConversation("./samples/simple.json");

  console.log("Título:", conversation.title);
  console.log("Tiene mapping:", "mapping" in conversation);
}

main().catch(console.error);