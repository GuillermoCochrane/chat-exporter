export function getState() {
  window.__AI_CHAT_EXPORTER__ ??= {};
  window.__AI_CHAT_EXPORTER__.conversation ??= [];
  return window.__AI_CHAT_EXPORTER__;
}

export function getConversation() {
  return getState().conversation;
}

export function addPage(page) {
  getConversation().push(page);
}