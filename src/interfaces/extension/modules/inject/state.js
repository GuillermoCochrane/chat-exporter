// Encapsula el estado interno de la extensión en la página.
// Evita que los módulos accedan directamente a window.__AI_CHAT_EXPORTER__.

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

export function getPageCount() {
  return getConversation().length;
}

export function getLastPage() {
  const conversation = getConversation();
  return conversation.length > 0 ? conversation[conversation.length - 1].data : null;
}