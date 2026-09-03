// Responsable de desplazar la interfaz de ChatGPT para forzar
// la carga de todas las páginas de la conversación y recolectarlas.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findScrollableContainer() {
  const all = [...document.querySelectorAll("*")];
  const candidates = all
    .filter((el) => {
      const style = getComputedStyle(el);
      return (
        el.scrollHeight > el.clientHeight &&
        (style.overflowY === "auto" || style.overflowY === "scroll")
      );
    })
    .sort((a, b) => b.scrollHeight - a.scrollHeight);

  return candidates[0] ?? document.scrollingElement ?? document.documentElement;
}

function waitForNewPage(timeoutMs = 45000) {
  return new Promise((resolve) => {
    const handler = (event) => {
      window.removeEventListener("AI_CHAT_EXPORTER_PAGE_CAPTURED", handler);
      clearTimeout(timer);
      resolve(event.detail);
    };

    const timer = setTimeout(() => {
      window.removeEventListener("AI_CHAT_EXPORTER_PAGE_CAPTURED", handler);
      resolve(null);
    }, timeoutMs);

    window.addEventListener("AI_CHAT_EXPORTER_PAGE_CAPTURED", handler);
  });
}

export async function collectViaScroll() {
  const container = findScrollableContainer();
  const state = window.__AI_CHAT_EXPORTER__;

  let lastPage =
    state.conversation.length > 0
      ? state.conversation[state.conversation.length - 1].data
      : null;

  let consecutiveTimeouts = 0;

  while (lastPage?.page_info?.has_previous_page) {
    container.scrollTop = 0;

    const newPage = await waitForNewPage();

    if (!newPage) {
      consecutiveTimeouts++;

      if (consecutiveTimeouts >= 3) {
        break;
      }

      container.scrollTop = 200;
      await sleep(500);
      container.scrollTop = 0;

      continue;
    }

    consecutiveTimeouts = 0;
    lastPage = newPage.data;

    await sleep(1500);
    container.scrollTop = 0;
    await sleep(300);
  }

  return state.conversation;
}